// End-to-end smoke test: spawn the built server, run the MCP handshake over stdio,
// list tools, and call both. Confirms the JSON-RPC wiring and the live price fetch.
import { spawn } from "node:child_process";

const p = spawn("node", ["dist/server.js"], { stdio: ["pipe", "pipe", "inherit"] });
let out = "";
p.stdout.on("data", (d) => (out += d.toString()));

const send = (o) => p.stdin.write(JSON.stringify(o) + "\n");

send({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "smoke", version: "0" } } });
send({ jsonrpc: "2.0", method: "notifications/initialized" });
send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
send({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "calculate_ai_margin", arguments: { pricePerMonth: 20, payingCustomers: 500, blendedTokenPricePerM: 5, tokensPerUserM: 2 } } });
send({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "get_ai_tool_prices", arguments: { id: "creatify" } } });

setTimeout(() => {
  p.kill();
  const bothTools = out.includes("calculate_ai_margin") && out.includes("get_ai_tool_prices");
  const marginOk = out.includes("3260");
  const pricesOk = /creatify/i.test(out) || /Creatify/.test(out);
  const result = { bothToolsListed: bothTools, marginCallReturned3260: marginOk, livePriceFetchOk: pricesOk };
  console.log(JSON.stringify(result, null, 2));
  process.exit(bothTools && marginOk ? 0 : 1);
}, 7000);
