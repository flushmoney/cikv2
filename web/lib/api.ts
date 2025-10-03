export async function resolveHandle(handle: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.address as `0x${string}` | null;
}

export async function logTransfer(payload: {
  hash: `0x${string}`;
  from_addr: `0x${string}`;
  to: `0x${string}`;
  token: string;   // "CIK" or "ETH"
  amount: string;  // human string
  memo?: string;
  chain_id?: number;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/transfers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.NEXT_PUBLIC_API_KEY || '',
    },
    body: JSON.stringify({ chain_id: 8453, ...payload }),
  });
  if (!res.ok) throw new Error('backend log failed');
  return res.json();
}

export async function fetchActivity(limit: number = 20) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/activity?limit=${limit}`);
  if (!res.ok) return [];
  return res.json();
}
