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

## 2. Smithery — smithery.ai
Sign in with GitHub → *Add / Deploy server* → point it at the repo. Smithery favors a
config file for hosted deploys; for a local stdio npm server, submit the GitHub repo and
it detects `@okaneland/mcp`. Use the fields above.

## 3. mcp.so — mcp.so
*Submit* → GitHub sign-in or the submission form. Paste the fields above; repo + npm
package + description.

## 4. PulseMCP — pulsemcp.com
Use their submit form. Paste name, description, repo, npm command, category.

## 5. Glama — glama.ai/mcp/servers
Glama auto-indexes npm/GitHub MCP servers, so `@okaneland/mcp` may appear on its own
(with a score badge). To claim/speed it, sign in with GitHub and add the server.

## 6. awesome-mcp-servers (GitHub PR)
Add this line under **### Developer Tools** (keep the section's ordering), then open a PR:
```
- [okaneland/mcp](https://github.com/TheBaronofAI/okaneland-mcp) 📇 🏠 - Verified AI-tool prices (100+ tools) and AI product margin + break-even math. `npx -y @okaneland/mcp`
```
(📇 = TypeScript, 🏠 = local/stdio.)

## Launch touch
One X post + a newsletter line pointing your audience at it. That, plus the backlinks
above, is the whole distribution play.
