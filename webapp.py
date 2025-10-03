# webapp.py
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import os, sqlite3, time

API_KEY = os.getenv("API_KEY", "devkey")  # set a real one in .env
DB_PATH = os.getenv("DB_PATH", "users.db")

app = FastAPI(title="CIK Backend API", version="1.0")

# CORS: allow your Next.js dev + prod
origins = ["http://localhost:3000", "http://127.0.0.1:3000", "https://christisking.io"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

def db():
    return sqlite3.connect(DB_PATH)

class ResolveReq(BaseModel):
    handle: str = Field(..., examples=["@adi"])

class ResolveRes(BaseModel):
    address: Optional[str]  # 0x… or None

class FeeReq(BaseModel):
    to: str
    token: str  # "CIK" or "ETH"
    amount: str # "1.23"

class FeeRes(BaseModel):
    gas_estimate: str   # wei
    total_cost: str     # human string, e.g. "0.00042"

class TransferLogReq(BaseModel):
    hash: str
    from_addr: str
    to: str
    token: str
    amount: str
    memo: Optional[str] = None
    chain_id: int = 8453

class TransferLogRes(BaseModel):
    ok: bool

def require_key(x_api_key: str = Header(None)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="bad api key")

@app.post("/resolve", response_model=ResolveRes)
def resolve(req: ResolveReq):
    # simple stub → replace with your real mapping / DB lookup
    book = {"@adi": "0x0000000000000000000000000000000000000001",
            "@umar": "0x0000000000000000000000000000000000000002",
            "@shad": "0x0000000000000000000000000000000000000003"}
    return {"address": book.get(req.handle.lower())}

@app.post("/fee-estimate", response_model=FeeRes)
def fee_estimate(req: FeeReq):
    # stub now; later call web3.py for real estimate
    return {"gas_estimate": "21000", "total_cost": "0.00042"}

@app.post("/transfers", response_model=TransferLogRes)
def log_transfer(req: TransferLogReq, x_api_key: str = Header(None)):
    require_key(x_api_key)
    con = db()
    con.execute("""
      CREATE TABLE IF NOT EXISTS transfers(
        hash TEXT PRIMARY KEY,
        from_addr TEXT, to_addr TEXT, token TEXT, amount TEXT,
        memo TEXT, chain_id INTEGER, ts INTEGER
      )
    """)
    con.execute(
      "INSERT OR REPLACE INTO transfers VALUES(?,?,?,?,?,?,?,?)",
      (req.hash, req.from_addr, req.to, req.token, req.amount, req.memo, req.chain_id, int(time.time()))
    )
    con.commit(); con.close()
    return {"ok": True}

@app.get("/transfers/{hash}", response_model=TransferLogRes)
def has_transfer(hash: str):
    con = db()
    cur = con.execute("SELECT 1 FROM transfers WHERE hash=?", (hash,))
    ok = cur.fetchone() is not None
    con.close()
    return {"ok": ok}

@app.get("/activity")
def activity(limit: int = 20):
    con = db()
    rows = con.execute(
      "SELECT hash, from_addr, to_addr, token, amount, ts FROM transfers ORDER BY ts DESC LIMIT ?",
      (limit,)
    ).fetchall()
    con.close()
    return [{"hash": r[0], "from": r[1], "to": r[2], "token": r[3], "amount": r[4], "ts": r[5]} for r in rows]
