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

## 1. Official MCP Registry — registry.modelcontextprotocol.io — DONE ✅
Live: `io.github.TheBaronofAI/okaneland-mcp` v0.1.1, status active (npm `@okaneland/mcp`).
The registry proves npm ownership via the `mcpName` field in package.json (matches the
server name); npm versions are immutable, so adding it required the 0.1.1 republish.
`server.json` uses the current 2025-12-11 schema and validates (`mcp-publisher validate`).
To publish a NEW version: bump everywhere, `npm publish --access public --otp=<code>`, then
`mcp-publisher publish` (re-auth with `mcp-publisher login github` if needed).

## 2. Smithery — smithery.ai — DONE ✅
Live at https://smithery.ai/servers/hi-10f9/okaneland-mcp (namespace `hi-10f9`, Local,
listed, both tools shown). Published via the MCPB bundle over the CLI (the web form only
takes hosted HTTPS servers). To re-publish after a change:
```bash
npm run bundle                                   # scripts/pack.sh -> okaneland-mcp.mcpb
npx -y @smithery/cli@latest auth login           # if not already authed
npx -y @smithery/cli@latest mcp publish ./okaneland-mcp.mcpb -n hi-10f9/okaneland-mcp
```
Note: the bundle must carry per-tool `inputSchema` (Smithery requires it, MCPB forbids it),
so the build uses a plain zip, not `mcpb pack`. See PUBLISHING.md §5.

## 3. mcp.so — mcp.so — DONE ✅
Submitted via the free path (queued for review): category Finance & Commerce, tags set,
overview rewritten to describe both tools. Manage at mcp.so → My submissions.

## 4. PulseMCP — pulsemcp.com — AUTO (via the registry) ✅
No manual submit. Their submit page: "We ingest entries from the Official MCP Registry
daily and process them weekly." Since #1 is published, okaneland-mcp will appear on its
own within ~a week. Only if it hasn't after a week: email hello@pulsemcp.com.

## 5. Glama — glama.ai/mcp/servers — INDEXED, CLAIM PENDING (owner action)
Auto-indexed at https://glama.ai/mcp/servers/TheBaronofAI/okaneland-mcp (2026-07).
Status 2026-07-19: unclaimed; scores show "not tested"; Glama's crawl says
"README.md not found" (stale — README.md exists on main; claiming triggers re-index).
OWNER TODO: open the server page → "Claim" → sign in with GitHub (TheBaronofAI).
Claiming unlocks the admin panel and kicks off the quality-score evaluation, which the
awesome-mcp-servers reviewer requires (see #6).

## 6. awesome-mcp-servers (GitHub PR) — DONE ✅ (badge added 2026-07-19)
Submitted: https://github.com/punkpeye/awesome-mcp-servers/pull/10337 (Finance & Fintech,
fast-track `🤖🤖🤖` agent PR). Reviewer asked for a Glama claim + score badge; the badge
(`.../badges/score.svg`, the list's convention — the email's `status.svg` pattern 404s)
was added to the entry and pushed to the PR branch 2026-07-19. It renders live and will
show the score automatically once #5 is claimed and evaluated. Entry line submitted:
```
- [TheBaronofAI/okaneland-mcp](https://github.com/TheBaronofAI/okaneland-mcp) 📇 🏠 ☁️ - Two tools for building and pricing AI products: `get_ai_tool_prices` returns human-verified pricing for 100+ AI tools (what is free, monthly cost, the gotcha, last-verified date) from okaneland.com, and `calculate_ai_margin` turns an AI product's MRR into what is kept after token costs, card fees, failed payments, refunds and tax, plus break-even price and usage cap. `npx -y @okaneland/mcp`
```
(📇 = TypeScript, 🏠 = local/stdio, ☁️ = talks to a remote API.)

## Launch touch
One X post + a newsletter line pointing your audience at it. That, plus the backlinks
above, is the whole distribution play.
