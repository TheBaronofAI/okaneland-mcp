#!/usr/bin/env bash
# Build the Smithery-ready MCPB bundle: okaneland-mcp.mcpb
#
# Why a plain `zip` instead of `mcpb pack`:
#   The MCPB manifest schema forbids per-tool `inputSchema`, but Smithery's release
#   API REQUIRES an `inputSchema` object on every tool (otherwise publish fails with
#   "Invalid input: expected object, received undefined"). So manifest.json carries
#   inputSchema and we zip it directly. `mcpb validate manifest.json` will flag those
#   keys as unrecognized -- that is expected and intended.
#
# The result is a plain zip with manifest.json at the root, which is what both
# Smithery and Claude Desktop consume.
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build
npm prune --omit=dev

rm -rf .bundle-stage okaneland-mcp.mcpb
mkdir -p .bundle-stage
cp manifest.json README.md LICENSE .bundle-stage/
cp -R dist node_modules .bundle-stage/
rm -f .bundle-stage/dist/*.test.js
( cd .bundle-stage && zip -rqX ../okaneland-mcp.mcpb . )
rm -rf .bundle-stage

# restore dev deps for local development
npm install --no-audit --no-fund >/dev/null 2>&1

echo "Built okaneland-mcp.mcpb ($(du -h okaneland-mcp.mcpb | cut -f1))"
echo "Publish to Smithery (namespace shown on smithery.ai/new):"
echo "  npx -y @smithery/cli@latest auth login"
echo "  npx -y @smithery/cli@latest mcp publish ./okaneland-mcp.mcpb -n <namespace>/okaneland-mcp"
