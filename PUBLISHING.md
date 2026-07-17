# Publishing & submitting `@okaneland/mcp`

The package is built, tested, and already published to npm as `@okaneland/mcp@0.1.0`.
This is the runbook for re-publishing and for the outward-facing directory listings.

## 0. Prerequisites
- **npm account** (`akirasumi`), member of the `okaneland` org, logged in: `npm login`.
- Node 18+.

## 1. Pre-publish checks (run at the repo root)
```bash
npm ci                 # clean install
npm run build          # tsc -> dist/
npm test               # 5/5 must pass (margin math pinned to the web calculator)
npm run smoke          # all green (needs network; hits the live price API)
npm pack --dry-run     # inspect tarball: should contain dist/ + package.json + README only
```
Confirm the tarball ships `dist/` and not `src/` (that's what `"files": ["dist"]` does).
Bump the version before any re-publish: `npm version patch`.

## 2. Publish
```bash
npm publish --access public --otp=<code>   # scoped package: --access public + 2FA
```
Verify:
```bash
npm view @okaneland/mcp
npx -y @okaneland/mcp          # should start and wait on stdio; Ctrl-C to stop
```

## 3. Confirm it works in a real client
Add to Claude Desktop's config
(`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):
```json
{ "mcpServers": { "okaneland": { "command": "npx", "args": ["-y", "@okaneland/mcp"] } } }
```
Restart Claude Desktop → confirm the two tools appear → ask a pricing/margin question and
watch it call them. (Cursor, Windsurf, etc. use the same config shape.)

## 4. Official registry manifest
`server.json` at the repo root is ready. Namespace `io.github.thebaronofai/okaneland-mcp`
is provable via GitHub login; a brand namespace `com.okaneland/okaneland-mcp` is possible
via DNS verification of okaneland.com (adds a TXT-record step).

## 5. MCPB bundle (Smithery + one-click Claude Desktop install)
`manifest.json` (MCPB v0.2) describes the stdio server for Anthropic's MCPB format. Build a
lean, self-contained bundle (build → prune dev deps → pack → restore dev deps):
```bash
npm run bundle          # -> okaneland-mcp.mcpb (~2.6 MB, gitignored)
npx -y @anthropic-ai/mcpb@latest info okaneland-mcp.mcpb   # sanity check
```
The `.mcpb` is a build artifact (gitignored). Two uses:
- **Claude Desktop**: users can install the `.mcpb` directly (drag into Settings → Extensions).
- **Smithery**: a stdio server can't use Smithery's URL form; publish the bundle via CLI:
  ```bash
  npx -y @smithery/cli@latest auth login
  npx -y @smithery/cli@latest mcp publish ./okaneland-mcp.mcpb -n <namespace>/okaneland-mcp
  ```
Bump `version` in BOTH `package.json` and `manifest.json` together before re-bundling.

## 6. Submit to directories
See `SUBMISSIONS.md` for the exact copy-paste fields and per-site steps. Order:
1. **Official MCP Registry** (canonical; others ingest from it) — `mcp-publisher` + `server.json`.
2. **mcp.so** — DONE (free path, queued). **Smithery** — bundle built; run the publish command above.
3. **Glama** — auto-indexes npm/GitHub; may appear on its own.
4. **awesome-mcp-servers** — PR #10337 (Finance & Fintech).

## 7. Launch touch
One X post / thread and a newsletter line pointing the vibe-coder audience at it. That,
plus the directory backlinks, is the whole distribution play.

## Maintenance
- **No release when a price changes** — the server fetches the live index at call time.
- **Re-publish only** when adding/changing a tool or bumping the SDK.
- Keep `src/margin.test.ts` green whenever the web calculator's math changes (update both
  together; the source of truth is https://okaneland.com/palette/keep/).
