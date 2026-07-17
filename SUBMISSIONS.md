# Directory submission kit for @okaneland/mcp

Copy-paste values so each listing is a 2-minute job. You do the sign-in on each site;
this file just removes the thinking.

## Reusable fields (paste into any form)
- **Server name:** Okane Land
- **npm package:** `@okaneland/mcp`
- **Run command:** `npx -y @okaneland/mcp`
- **Short description:** Verified AI-tool prices and AI product margin math for agents.
- **Long description:** Two tools for AI builders. `get_ai_tool_prices` returns live, human-verified pricing for 100+ AI tools (what's free, what a real month costs, the gotcha, the verified date). `calculate_ai_margin` turns MRR into what you actually keep after the token bill, card fees, failed payments, refunds, and tax, plus the break-even price and usage cap. Stdio, runs locally, no hosting.
- **Repository:** https://github.com/TheBaronofAI/okaneland-mcp
- **Homepage / website:** https://okaneland.com/palette/keep/
- **Category:** Developer Tools (or Finance)
- **Tags:** ai, pricing, margin, saas, calculator, developer-tools
- **License:** MIT
- **Transport:** stdio (local)
- **Tools:** `get_ai_tool_prices`, `calculate_ai_margin`

## 1. Official MCP Registry — registry.modelcontextprotocol.io
`server.json` is at the repo root. Then, at the repo root:
```bash
# install the publisher CLI (check current docs; the registry is new and moving)
# then authenticate the namespace as its owner and publish:
mcp-publisher login github     # device flow; sign in as TheBaronofAI (owns io.github.thebaronofai/*)
mcp-publisher publish          # reads ./server.json
```
Namespace `io.github.thebaronofai/okaneland-mcp` is provable via your GitHub login. A
cleaner brand namespace `com.okaneland/okaneland-mcp` is possible via DNS verification of
okaneland.com if you'd rather (adds a TXT record step).

## 2. Smithery — smithery.ai (needs the MCPB bundle; ONE command left for you)
Smithery's web form only takes hosted HTTPS servers (Streamable HTTP). A local stdio
server like this one must be published as a prebuilt MCPB bundle via the CLI. The bundle
is already built (`npm run bundle` → `okaneland-mcp.mcpb`, manifest at `manifest.json`).
Run, from the repo root:
```bash
npx -y @smithery/cli@latest auth login          # authorize in the browser (one time)
npx -y @smithery/cli@latest mcp publish ./okaneland-mcp.mcpb -n <namespace>/okaneland-mcp
```
`<namespace>` is your Smithery namespace shown on smithery.ai/new (currently `hi-10f9`),
or a branded one you create. No config schema is needed (the server takes no settings).

## 3. mcp.so — mcp.so — DONE ✅
Submitted via the free path (queued for review): category Finance & Commerce, tags set,
overview rewritten to describe both tools. Manage at mcp.so → My submissions.

## 4. PulseMCP — pulsemcp.com
Use their submit form. Paste name, description, repo, npm command, category.

## 5. Glama — glama.ai/mcp/servers
Glama auto-indexes npm/GitHub MCP servers, so `@okaneland/mcp` may appear on its own
(with a score badge). To claim/speed it, sign in with GitHub and add the server.

## 6. awesome-mcp-servers (GitHub PR) — DONE ✅
Submitted: https://github.com/punkpeye/awesome-mcp-servers/pull/10337 (Finance & Fintech,
fast-track `🤖🤖🤖` agent PR). Entry line submitted:
```
- [TheBaronofAI/okaneland-mcp](https://github.com/TheBaronofAI/okaneland-mcp) 📇 🏠 ☁️ - Two tools for building and pricing AI products: `get_ai_tool_prices` returns human-verified pricing for 100+ AI tools (what is free, monthly cost, the gotcha, last-verified date) from okaneland.com, and `calculate_ai_margin` turns an AI product's MRR into what is kept after token costs, card fees, failed payments, refunds and tax, plus break-even price and usage cap. `npx -y @okaneland/mcp`
```
(📇 = TypeScript, 🏠 = local/stdio, ☁️ = talks to a remote API.)

## Launch touch
One X post + a newsletter line pointing your audience at it. That, plus the backlinks
above, is the whole distribution play.
