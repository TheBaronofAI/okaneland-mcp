// Wraps Okane Land's live AI-tool price index API. The server fetches this at call
// time (not bundled), so the data is always as fresh as the site's monthly re-verify
// and the package never needs a release when a price changes.

const API = "https://okaneland.com/api/v1/prices.json";

export interface Tool {
  id: string;
  name: string;
  category: string;
  what: string;
  free: string;
  paidFrom?: { usd: number; label: string };
  realWork?: { usd: number; label: string };
  units?: { label: string; value: string }[];
  gotcha?: string;
  verified?: string;
  review?: string;
  vendor?: string;
}

interface Index {
  name: string;
  updated: string;
  method: string;
  page: string;
  tools: Tool[];
}

export interface PriceQuery {
  category?: string;
  query?: string;
  id?: string;
  limit?: number;
}

export async function getPrices(opts: PriceQuery) {
  const res = await fetch(API, {
    headers: { "user-agent": "okaneland-mcp/0.1 (+https://okaneland.com)" },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`price index returned HTTP ${res.status}`);
  const data = (await res.json()) as Index;

  let tools = data.tools ?? [];
  if (opts.id) {
    const id = opts.id.toLowerCase();
    tools = tools.filter((t) => t.id.toLowerCase() === id);
  }
  if (opts.category) {
    const cat = opts.category.toLowerCase();
    tools = tools.filter((t) => (t.category || "").toLowerCase() === cat);
  }
  if (opts.query) {
    const q = opts.query.toLowerCase();
    tools = tools.filter((t) =>
      `${t.id} ${t.name} ${t.what} ${t.category}`.toLowerCase().includes(q),
    );
  }

  const matched = tools.length;
  if (opts.limit && opts.limit > 0) tools = tools.slice(0, opts.limit);

  return {
    updated: data.updated,
    method: data.method,
    page: data.page,
    matched,
    returned: tools.length,
    tools,
  };
}
