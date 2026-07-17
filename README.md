# @okaneland/mcp

A small [Model Context Protocol](https://modelcontextprotocol.io) server that gives AI agents two things from [Okane Land](https://okaneland.com):

| Tool | What it does |
| --- | --- |
| `get_ai_tool_prices` | Current, human-verified pricing for 100+ AI tools solo builders use, with what's free, what a real month costs, the gotcha, and the last-verified date. Fetched live from the maintained price index. |
| `calculate_ai_margin` | Turns an AI product's MRR into what you actually keep after the token bill, card fees, failed payments, refunds, and tax, plus the break-even price and usage cap. |

It runs on the user's machine over stdio, so there is nothing to host. `get_ai_tool_prices` fetches the public [`/api/v1/prices.json`](https://okaneland.com/api/v1/prices.json) at call time, so the data is always as fresh as the site's monthly re-verification.

## Install

Add it to your MCP client's config (Claude Desktop, Cursor, Windsurf, and others use the same shape):

```json
{
  "mcpServers": {
    "okaneland": {
      "command": "npx",
      "args": ["-y", "@okaneland/mcp"]
    }
  }
}
```

Restart the client. The two tools appear in any agent you run there.

## Example

> **You:** I want a $20/mo AI writing tool on Claude Sonnet. What do similar tools charge, and would $20 keep money at 500 users?

The agent calls `get_ai_tool_prices` and `calculate_ai_margin`, then answers from real data: comparable tools charge more, and at 500 users on a Sonnet-class blend you keep about **$3,260/mo (33%)**, staying profitable down to a **$12.25** price or up to **3.3M** tokens per user.

## Tool reference

### `get_ai_tool_prices`
Inputs (all optional): `category`, `query`, `id`, `limit`. Returns the matching tool rows plus the index's `updated` date, `method`, and source `page`.

### `calculate_ai_margin`
Inputs: `pricePerMonth`, `payingCustomers`, `blendedTokenPricePerM`, `tokensPerUserM`, and optional `monthlyChurnPct` (6.1), `intlCardPct` (40), `vatPct` (0), `failedPaymentsPct` (9), `refundsPct` (3). Returns `gross`, `tokenBill`, `cardFees`, `failedPayments`, `refunds`, `tax`, `keep`, `keepPct`, `perCustomerKeep`, `customersReplacedMonthly`, `breakEvenPrice`, `breakEvenTokensPerUserM`, and `tokenCostExceedsPrice`.

## Privacy

The server fetches only the public price index over HTTPS and sends nothing about you. The margin calculation runs entirely locally.

## Develop

```bash
npm install
npm run build     # tsc -> dist/
npm test          # unit tests pin the margin math to the web calculator
npm run smoke     # spins up the server, runs the MCP handshake, calls both tools
```

The margin math in `src/margin.ts` is a port of Okane Land's [margin calculator](https://okaneland.com/palette/keep/); `src/margin.test.ts` pins its known-good outputs so the two cannot silently drift.

## Disclaimer

Numbers are directional, not financial advice.

## License

MIT
