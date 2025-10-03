#!/usr/bin/env python3
import os
import re
import time
import sqlite3
import logging
from decimal import Decimal, ROUND_DOWN
from datetime import datetime, timezone, timedelta

from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
from web3 import Web3

# ── CONFIG & AUTH ─────────────────────────────────
load_dotenv()
logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s [%(levelname)s] %(message)s")

# X credentials & state
X_USERNAME    = os.getenv("X_USERNAME")
X_PASSWORD    = os.getenv("X_PASSWORD")
STATE_FILE    = "x_state.json"
LAST_ID_FILE  = "last_id.txt"

# Network / funder
ETH_RPC_URL     = os.getenv("ETH_RPC_URL")  # Base mainnet RPC
FUNDER_KEY      = os.getenv("FUNDER_PRIVATE_KEY")
FUNDER_ADDRESS  = Web3.to_checksum_address(os.getenv("FUNDER_ADDRESS"))

# $CIK token
TOKEN_ADDRESS   = Web3.to_checksum_address(os.getenv("TOKEN_ADDRESS"))
TOKEN_DECIMALS_ENV = os.getenv("TOKEN_DECIMALS")
TOKEN_SYMBOL_ENV   = os.getenv("TOKEN_SYMBOL")

# amounts (human units, not wei)
TRANSFER_AMOUNT_TOKENS = Decimal(os.getenv("TRANSFER_AMOUNT_TOKENS", "1"))
BIND_REWARD_TOKENS     = Decimal(os.getenv("BIND_REWARD_TOKENS",     "1"))

# tx behavior
PRIORITY_FEE_GWEI = float(os.getenv("PRIORITY_FEE_GWEI", "2"))
CONFIRMATIONS     = int(os.getenv("CONFIRMATIONS", "2"))

# keywords
KEYWORD_BIND  = "bind me"
KEYWORD_BLESS = "bless"

# Images (optional)
IMAGE_DIR = os.getenv("IMAGE_DIR", "images")
IMG_BIND_SUCCESS         = os.getenv("IMG_BIND_SUCCESS", "bind_success.png")
IMG_NEEDS_BIND           = os.getenv("IMG_NEEDS_BIND", "needs_bind.png")
IMG_BLESS_SENT           = os.getenv("IMG_BLESS_SENT", "bless_sent.png")
IMG_SENDER_RATELIMIT     = os.getenv("IMG_SENDER_RATELIMIT", "rate_limit_sender.png")
IMG_RECIPIENT_RATELIMIT  = os.getenv("IMG_RECIPIENT_RATELIMIT", "rate_limit_recipient.png")
IMG_BLESS_FAILED         = os.getenv("IMG_BLESS_FAILED", "bless_failed.png")
IMG_BIND_REWARD_FAILED   = os.getenv("IMG_BIND_REWARD_FAILED", "bind_failed.png")

# ── WEB3 SETUP ────────────────────────────────────
w3       = Web3(Web3.HTTPProvider(ETH_RPC_URL))
CHAIN_ID = w3.eth.chain_id  # Base mainnet = 8453

# ERC-20 minimal ABI
ERC20_ABI = [
    {"constant": False, "inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],
     "name":"transfer","outputs":[{"name":"","type":"bool"}], "type":"function"},
    {"constant": True, "inputs":[], "name":"decimals","outputs":[{"name":"","type":"uint8"}], "type":"function"},
    {"constant": True, "inputs":[], "name":"symbol","outputs":[{"name":"","type":"string"}], "type":"function"},
    {"constant": True, "inputs":[{"name":"owner","type":"address"}], "name":"balanceOf","outputs":[{"name":"","type":"uint256"}], "type":"function"},
]

token = w3.eth.contract(address=TOKEN_ADDRESS, abi=ERC20_ABI)

# Discover token meta
try:
    TOKEN_DECIMALS = int(TOKEN_DECIMALS_ENV) if TOKEN_DECIMALS_ENV else int(token.functions.decimals().call())
except Exception:
    TOKEN_DECIMALS = 18
try:
    TOKEN_SYMBOL = TOKEN_SYMBOL_ENV or str(token.functions.symbol().call())
except Exception:
    TOKEN_SYMBOL = "CIK"

logging.info("Token %s at %s (decimals=%d)", TOKEN_SYMBOL, TOKEN_ADDRESS, TOKEN_DECIMALS)

# Seed nonce from pending txs
NEXT_NONCE = w3.eth.get_transaction_count(FUNDER_ADDRESS, "pending")
logging.info("Loaded NEXT_NONCE from pending: %s", NEXT_NONCE)

# ── DATABASE SETUP ────────────────────────────────
DB_FILE = "users.db"
conn    = sqlite3.connect(DB_FILE, check_same_thread=False)
conn.row_factory = sqlite3.Row
c       = conn.cursor()

c.execute("""
CREATE TABLE IF NOT EXISTS bindings (
    handle   TEXT PRIMARY KEY,
    eth_addr TEXT NOT NULL,
    bound_at TIMESTAMP NOT NULL
)
""")
c.execute("""
CREATE TABLE IF NOT EXISTS transfers (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    handle TEXT NOT NULL,
    kind   TEXT CHECK(kind IN ('sent','recv')) NOT NULL,
    ts     TIMESTAMP NOT NULL
)
""")
c.execute("""
CREATE TABLE IF NOT EXISTS pending_blessings (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient  TEXT NOT NULL,
  amount     REAL NOT NULL,       -- stored as human token units
  sender     TEXT NOT NULL,
  origin_tid INTEGER,
  created_at TIMESTAMP NOT NULL,
  consumed   INTEGER NOT NULL DEFAULT 0
)
""")
# NEW: processed tweets for idempotency
c.execute("""
CREATE TABLE IF NOT EXISTS processed_tweets (
  tweet_id     INTEGER PRIMARY KEY,
  reason       TEXT,
  processed_at TIMESTAMP NOT NULL
)
""")
conn.commit()

# ── UTILITIES ─────────────────────────────────────
ETH_ADDR_RE = re.compile(r"\b0x[a-f0-9]{40}\b")

def norm_handle(h: str) -> str:
    return h.strip().lstrip("@").lower()

def load_last_id() -> int:
    try:
        return int(open(LAST_ID_FILE).read().strip())
    except FileNotFoundError:
        return 0

def save_last_id(n: int):
    with open(LAST_ID_FILE, "w") as f:
        f.write(str(n))

def can_do(handle: str, kind: str) -> bool:
    cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
    hn = norm_handle(handle)
    c.execute("SELECT ts FROM transfers WHERE lower(handle)=? AND kind=? ORDER BY ts DESC LIMIT 1", (hn, kind))
    row = c.fetchone()
    if not row:
        return True
    last_ts = datetime.fromisoformat(row["ts"])
    if last_ts.tzinfo is None:
        last_ts = last_ts.replace(tzinfo=timezone.utc)
    return last_ts < cutoff

def record(handle: str, kind: str):
    c.execute("INSERT INTO transfers(handle,kind,ts) VALUES(?,?,?)",
              (norm_handle(handle), kind, datetime.now(timezone.utc).isoformat()))
    conn.commit()

def get_binding(handle: str):
    hn = norm_handle(handle)
    c.execute("SELECT eth_addr FROM bindings WHERE lower(handle)=?", (hn,))
    row = c.fetchone()
    return row["eth_addr"] if row else None

def bind_wallet_if_new(handle: str, addr: str) -> bool:
    if get_binding(handle):
        return False
    now = datetime.now(timezone.utc).isoformat()
    chk = Web3.to_checksum_address(addr)
    c.execute("INSERT INTO bindings(handle,eth_addr,bound_at) VALUES(?,?,?)",
              (norm_handle(handle), chk, now))
    conn.commit()
    return True

def has_unconsumed_pending(recipient: str) -> bool:
    rn = norm_handle(recipient)
    c.execute("SELECT 1 FROM pending_blessings WHERE lower(recipient)=? AND consumed=0 LIMIT 1", (rn,))
    return c.fetchone() is not None

def get_first_pending(recipient: str):
    rn = norm_handle(recipient)
    c.execute("""SELECT * FROM pending_blessings
                 WHERE lower(recipient)=? AND consumed=0
                 ORDER BY created_at ASC LIMIT 1""", (rn,))
    return c.fetchone()

def queue_single_pending(recipient: str, amount_tokens: Decimal, sender: str, origin_tid: int | None) -> bool:
    if has_unconsumed_pending(recipient):
        return False
    c.execute(
        "INSERT INTO pending_blessings(recipient,amount,sender,origin_tid,created_at,consumed) VALUES(?,?,?,?,?,0)",
        (norm_handle(recipient), float(amount_tokens), norm_handle(sender), origin_tid, datetime.now(timezone.utc).isoformat())
    )
    conn.commit()
    logging.info("Queued pending blessing: %s <- %s (%.6f %s) tid=%s",
                 norm_handle(recipient), norm_handle(sender), float(amount_tokens), TOKEN_SYMBOL, origin_tid)
    return True

def consume_pending(pending_id: int):
    c.execute("UPDATE pending_blessings SET consumed=1 WHERE id=?", (pending_id,))
    conn.commit()

def fmt_amount(x: Decimal) -> str:
    q = Decimal(10) ** -TOKEN_DECIMALS
    return str(x.quantize(q, rounding=ROUND_DOWN).normalize())

# NEW: idempotency helpers
def was_processed(tweet_id: int) -> bool:
    c.execute("SELECT 1 FROM processed_tweets WHERE tweet_id=?", (tweet_id,))
    return c.fetchone() is not None

def mark_processed(tweet_id: int, reason: str):
    c.execute(
        "INSERT OR IGNORE INTO processed_tweets(tweet_id,reason,processed_at) VALUES(?,?,?)",
        (tweet_id, reason, datetime.now(timezone.utc).isoformat())
    )
    conn.commit()

# ── IMAGE HELPERS ─────────────────────────────────
def _p(name: str) -> str:
    return os.path.join(IMAGE_DIR, name)

def _filter_existing(paths: list[str]) -> list[str]:
    ok = [p for p in paths if p and os.path.isfile(p)]
    missing = [p for p in paths if p and not os.path.isfile(p)]
    if missing:
        logging.warning("Image(s) not found, skipping: %s", missing)
    return ok

def images_for(event: str) -> list[str]:
    mapping = {
        "bind_success":        [_p(IMG_BIND_SUCCESS)],
        "needs_bind":          [_p(IMG_NEEDS_BIND)],
        "bless_sent":          [_p(IMG_BLESS_SENT)],
        "sender_rate_limit":   [_p(IMG_SENDER_RATELIMIT)],
        "recipient_rate_limit":[_p(IMG_RECIPIENT_RATELIMIT)],
        "bless_failed":        [_p(IMG_BLESS_FAILED)],
        "bind_failed":         [_p(IMG_BIND_REWARD_FAILED)],
    }
    return _filter_existing(mapping.get(event, []))

# ── ERC-20 TRANSFER ───────────────────────────────
def _wait_for_confirmations(base_block: int, min_conf: int):
    if min_conf <= 1:
        return
    deadline = time.time() + 180
    target = base_block + (min_conf - 1)
    while time.time() < deadline:
        latest = w3.eth.block_number
        if latest >= target:
            return
        time.sleep(2)
    logging.warning("Timed out waiting for %d confirmations (latest=%d target=%d)", min_conf, latest, target)

def tokens_to_uint(amount_tokens: Decimal) -> int:
    scale = Decimal(10) ** TOKEN_DECIMALS
    return int((amount_tokens * scale).to_integral_exact(rounding=ROUND_DOWN))

def send_tokens(to_addr: str, amount_tokens: Decimal) -> str:
    global NEXT_NONCE
    to = Web3.to_checksum_address(to_addr)
    amt_uint = tokens_to_uint(amount_tokens)

    priority = w3.to_wei(PRIORITY_FEE_GWEI, "gwei")
    base_fee = w3.eth.get_block("latest")["baseFeePerGas"]
    max_fee  = base_fee + priority * 2

    tx = token.functions.transfer(to, amt_uint).build_transaction({
        "from":    FUNDER_ADDRESS,
        "nonce":   NEXT_NONCE,
        "chainId": CHAIN_ID,
        "value":   0,
        "maxPriorityFeePerGas": priority,
        "maxFeePerGas":         max_fee,
    })

    try:
        gas_est = w3.eth.estimate_gas(tx)
    except Exception as e:
        logging.error("Gas estimation failed (%s). Falling back to 80000.", e)
        gas_est = 80_000
    tx["gas"] = gas_est

    signed = w3.eth.account.sign_transaction(tx, FUNDER_KEY)
    raw = getattr(signed, "raw_transaction", None) or getattr(signed, "rawTransaction", None)
    tx_hash = w3.eth.send_raw_transaction(raw)
    tx_hex  = w3.to_hex(tx_hash)

    logging.info("Broadcast %s %s → %s | nonce=%d gas=%d tip=%dgwei maxFee=%dgwei tx=%s",
                 fmt_amount(amount_tokens), TOKEN_SYMBOL, to, NEXT_NONCE, gas_est,
                 priority // 10**9, max_fee // 10**9, tx_hex)

    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=180)
    if receipt.status != 1:
        raise RuntimeError(f"Transaction {tx_hex} failed (status={receipt.status}) in block {receipt.blockNumber}")
    _wait_for_confirmations(receipt.blockNumber, CONFIRMATIONS)

    logging.info("Finalized %s in block %d (+%d conf)", tx_hex, receipt.blockNumber, max(CONFIRMATIONS-1, 0))
    NEXT_NONCE += 1
    return tx_hex

# ── X LOGIN ───────────────────────────────────────
def login_and_save_state():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        ctx     = browser.new_context()
        page    = ctx.new_page()
        page.goto("https://x.com/i/flow/login", wait_until="domcontentloaded")
        page.fill("input[name='text']", X_USERNAME)
        page.click("button:has-text('Next')")
        page.fill("input[name='password']", X_PASSWORD)
        page.click("button:has-text('Log in')")
        page.wait_for_url("https://x.com/home", timeout=30000)
        ctx.storage_state(path=STATE_FILE)
        browser.close()
    logging.info("✅ Logged in and saved session to %s", STATE_FILE)

# ── FETCH MENTIONS ───────────────────────────────
def fetch_mentions(since_id: int):
    out = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx     = browser.new_context(storage_state=STATE_FILE)
        page    = ctx.new_page()

        page.goto("https://x.com/notifications/mentions", wait_until="domcontentloaded", timeout=60000)

        try:
            if page.url.startswith("https://x.com/i/flow/login") or page.locator("input[name='text']").is_visible(timeout=3000):
                logging.warning("Session invalid or login required; refreshing STATE_FILE…")
                browser.close()
                login_and_save_state()
                return []
        except Exception:
            pass

        try:
            page.wait_for_load_state("networkidle", timeout=30000)
        except Exception:
            logging.warning("networkidle wait timed out; continuing anyway")

        selectors = [
            "article",
            "div[data-testid='cellInnerDiv'] article",
            "div[data-testid='tweet']",
        ]
        articles = []
        for sel in selectors:
            try:
                page.wait_for_selector(sel, timeout=25000)
                articles = page.query_selector_all(sel)
                if articles:
                    break
            except Exception:
                continue

        if not articles:
            logging.warning("No articles found on notifications page (layout change or empty inbox).")
            browser.close()
            return []

        for art in articles:
            try:
                text = art.inner_text().strip()
            except Exception:
                continue
            low = text.lower()

            if (KEYWORD_BIND not in low) and (KEYWORD_BLESS not in low) and (not ETH_ADDR_RE.search(low)):
                continue

            link = art.query_selector("a[href*='/status/']")
            if not link:
                continue
            href = (link.get_attribute("href") or "").strip("/")
            parts = href.split("/")
            if len(parts) < 3 or parts[1] != "status":
                continue

            handle, _, tid_s = parts
            if not tid_s.isdigit():
                continue
            tid = int(tid_s)

            if tid <= since_id or norm_handle(handle) == norm_handle(X_USERNAME):
                continue

            out.append({"id": tid, "handle": handle, "text": text})

        browser.close()

    return sorted(out, key=lambda x: x["id"])

# ── REPLY VIA UI (with optional images) ──────────
def reply_via_ui(tweet_id: int, handle: str, msg: str, image_paths: list[str] | None = None):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        ctx     = browser.new_context(storage_state=STATE_FILE)
        page    = ctx.new_page()
        page.goto(f"https://x.com/{handle}/status/{tweet_id}", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_selector("div[role='textbox']", timeout=15000)
        page.click("div[role='textbox']")

        if image_paths:
            page.locator("input[data-testid='fileInput']").set_input_files(image_paths)
            time.sleep(1.5)

        page.fill("div[role='textbox']", f"@{handle} {msg}")
        time.sleep(0.8)

        clicked = False
        for _ in range(12):
            btn = page.query_selector('div[data-testid="tweetButtonInline"]:not([aria-disabled="true"])')
            if btn and btn.is_visible():
                page.evaluate("b => b.click()", btn)
                clicked = True
                break
            time.sleep(0.25)
        if not clicked:
            page.keyboard.press("Control+Enter")
        time.sleep(1)
        browser.close()
    logging.info("Replied to @%s (tweet %d)%s", handle, tweet_id,
                 f" with {len(image_paths)} image(s)" if image_paths else "")

# NEW: convenience wrapper to reply and mark processed
def reply_and_mark(tweet_id: int, handle: str, msg: str, images: list[str] | None, reason: str):
    reply_via_ui(tweet_id, handle, msg, images)
    mark_processed(tweet_id, reason)

# ── CORE LOGIC ────────────────────────────────────
def parse_bless_target(text: str) -> str | None:
    m = re.search(r"\bbless\b\s+@?([A-Za-z0-9_]{1,15})", text)
    return m.group(1) if m else None

def process_pending_after_bind(bound_handle: str, bound_addr: str) -> tuple[bool, str | None]:
    row = get_first_pending(bound_handle)
    if not row:
        return False, None
    total_send = BIND_REWARD_TOKENS + Decimal(row["amount"])
    txh = send_tokens(bound_addr, total_send)
    record(bound_handle, "recv")
    consume_pending(row["id"])
    return True, txh

def main():
    last_id  = load_last_id()
    mentions = fetch_mentions(last_id)
    if not mentions:
        logging.info("No new mentions.")
        return

    for m in mentions:
        tid        = m["id"]
        author_raw = m["handle"]
        author     = norm_handle(author_raw)
        text       = m["text"].strip()
        low        = text.lower()

        # Skip if already processed (idempotent)
        if was_processed(tid):
            logging.info("Skipping already-processed tweet %d", tid)
            continue

        logging.info("Processing @%s (tweet %d): %s", author_raw, tid, low)

        # 0) Bare address reply handler (only when pending)
        if ETH_ADDR_RE.search(low) and ("bind me" not in low):
            addr = ETH_ADDR_RE.search(low).group(0)
            if get_binding(author):
                reply_and_mark(tid, author_raw, f"you’re already bound to {get_binding(author)}. No changes made.",
                               images_for("bind_failed"), "already_bound_bare")
                continue
            if has_unconsumed_pending(author):
                created = bind_wallet_if_new(author, addr)
                if created:
                    try:
                        sent, txh = process_pending_after_bind(author, addr)
                    except Exception as e:
                        logging.error("Pending-fulfillment send failed: %s", e)
                        sent, txh = False, None
                    if sent:
                        reply_and_mark(
                            tid, author_raw,
                            f"your wallet {addr} is bound. You’ve received {fmt_amount(BIND_REWARD_TOKENS)} {TOKEN_SYMBOL} (bind) + "
                            f"{fmt_amount(TRANSFER_AMOUNT_TOKENS)} {TOKEN_SYMBOL} blessing. Tx: https://basescan.org/tx/{txh}",
                            images_for("bind_success"),
                            "bind_and_fulfill_pending_bare"
                        )
                    else:
                        try:
                            txh = send_tokens(addr, BIND_REWARD_TOKENS)
                            record(author, "recv")
                            reply_and_mark(
                                tid, author_raw,
                                f"your wallet {addr} is bound and you’ve received {fmt_amount(BIND_REWARD_TOKENS)} {TOKEN_SYMBOL}! "
                                f"Tx: https://basescan.org/tx/{txh}",
                                images_for("bind_success"),
                                "bind_reward_bare"
                            )
                        except Exception as e:
                            logging.error("Bind reward send failed: %s", e)
                            reply_and_mark(tid, author_raw, "bind saved but reward failed to send.",
                                           images_for("bind_failed"), "bind_reward_failed_bare")
                else:
                    reply_and_mark(tid, author_raw, "binding exists already.",
                                   images_for("bind_failed"), "bind_exists_bare")
                continue
            reply_and_mark(tid, author_raw, 'to bind, reply: "bind me 0xYOURADDRESS"',
                           images_for("needs_bind"), "bind_instructions")
            continue

        # 1) Explicit Binding flow
        bind_match = re.search(r"bind me\s+(0x[a-f0-9]{40})", low)
        if bind_match:
            addr = bind_match.group(1)
            existing = get_binding(author)
            if existing:
                if existing.lower() == addr.lower():
                    reply_and_mark(tid, author_raw, f"you’re already bound to {existing}. No changes made.",
                                   images_for("bind_failed"), "already_bound_same")
                else:
                    reply_and_mark(tid, author_raw, f"you’re already bound to {existing}. Binding cannot be changed.",
                                   images_for("bind_failed"), "already_bound_diff")
                continue

            created = bind_wallet_if_new(author, addr)
            if not created:
                reply_and_mark(tid, author_raw, "binding exists already.",
                               images_for("bind_failed"), "bind_exists_explicit")
                continue

            try:
                sent, txh = process_pending_after_bind(author, addr)
            except Exception as e:
                logging.error("Pending-fulfillment send failed: %s", e)
                sent, txh = False, None

            if sent:
                reply_and_mark(
                    tid, author_raw,
                    f"your wallet {addr} is bound. You’ve received {fmt_amount(BIND_REWARD_TOKENS)} {TOKEN_SYMBOL} (bind) + "
                    f"{fmt_amount(TRANSFER_AMOUNT_TOKENS)} {TOKEN_SYMBOL} blessing. Tx: https://basescan.org/tx/{txh}",
                    images_for("bind_success"),
                    "bind_and_fulfill_pending"
                )
            else:
                try:
                    txh = send_tokens(addr, BIND_REWARD_TOKENS)
                    record(author, "recv")
                    reply_and_mark(
                        tid, author_raw,
                        f"your wallet {addr} is bound and you’ve received {fmt_amount(BIND_REWARD_TOKENS)} {TOKEN_SYMBOL}! "
                        f"Tx: https://basescan.org/tx/{txh}",
                        images_for("bind_success"),
                        "bind_reward"
                    )
                except Exception as e:
                    logging.error("Bind reward send failed: %s", e)
                    reply_and_mark(tid, author_raw, "bind saved but reward failed to send.",
                                   images_for("bind_failed"), "bind_reward_failed")
            continue

        # 2) Bless flow
        target = parse_bless_target(low)
        if target:
            target_norm = norm_handle(target)

            # self-bless guard
            if target_norm == author:
                reply_and_mark(tid, author_raw, "you can’t bless yourself.",
                               images_for("bless_failed"), "self_bless_block")
                continue

            # sender daily limit
            if not can_do(author, "sent"):
                reply_and_mark(tid, author_raw, "you can only send a blessing once every 24h.",
                               images_for("sender_rate_limit"), "sender_rate_limit")
                continue

            target_addr = get_binding(target_norm)
            if target_addr:
                if not can_do(target_norm, "recv"):
                    reply_and_mark(tid, author_raw, f"@{target} already received {TOKEN_SYMBOL} in last 24h.",
                                   images_for("recipient_rate_limit"), "recipient_rate_limit")
                else:
                    try:
                        txh = send_tokens(target_addr, TRANSFER_AMOUNT_TOKENS)
                        record(author, "sent")
                        record(target_norm, "recv")
                        reply_and_mark(
                            tid, author_raw,
                            f"→ @{target}: {fmt_amount(TRANSFER_AMOUNT_TOKENS)} {TOKEN_SYMBOL} sent! Tx: https://basescan.org/tx/{txh}",
                            images_for("bless_sent"),
                            "bless_sent"
                        )
                    except Exception as e:
                        logging.error("Bless send failed: %s", e)
                        reply_and_mark(tid, author_raw, "failed to send blessing.",
                                       images_for("bless_failed"), "bless_failed")
            else:
                if has_unconsumed_pending(target_norm):
                    reply_and_mark(
                        tid, author_raw,
                        f"@{target} needs to join the faith first. Please drop your ETH wallet below",
                        images_for("needs_bind"),
                        "needs_bind_existing_pending"
                    )
                else:
                    queued = queue_single_pending(target_norm, TRANSFER_AMOUNT_TOKENS, author, tid)
                    if queued:
                        record(author, "sent")
                    reply_and_mark(
                        tid, author_raw,
                        f"@{target} needs to join the faith first. Please drop your ETH wallet below",
                        images_for("needs_bind"),
                        "needs_bind_enqueued"
                    )
            continue

    save_last_id(mentions[-1]["id"])

# ── ENTRY POINT ───────────────────────────────────
if __name__ == "__main__":
    if not os.path.exists(STATE_FILE):
        login_and_save_state()
    while True:
        try:
            logging.info("--- Starting check loop ---")
            main()
        except Exception:
            logging.exception("Error in main loop")
        time.sleep(60)
