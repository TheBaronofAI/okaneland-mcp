#!/usr/bin/env node
// Okane Land MCP server (stdio). Exposes two tools to any MCP client:
//   get_ai_tool_prices  - the live, human-verified AI-tool price index
//   calculate_ai_margin - what an AI product actually keeps, plus break-even
// No console.log anywhere: stdout is the JSON-RPC transport. Errors go to stderr.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { computeMargin } from "./margin.js";
import { getPrices } from "./prices.js";

const server = new McpServer({ name: "okaneland", version: "0.1.0" });

server.tool(
  "get_ai_tool_prices",
  "Current, human-verified pricing for 100+ AI tools that solo builders use (coding agents, editors and assistants, app and UI builders, frameworks and APIs, local models, marketing and content, sales and automation, search and research, review/test/secure, workflow and ops). For each tool it returns: what is free, the entry paid plan, what a real working month actually costs, per-unit costs, the gotcha to watch, and the date the row was last verified. Source: Okane Land's maintained price index (okaneland.com). Filter by category, a free-text query, or an exact tool id. Valid categories: 'Agents & terminal', 'App & UI builders', 'Editors & assistants', 'Frameworks & APIs', 'Local models', 'Marketing & content', 'Review, test & secure', 'Sales & automation', 'Search & research', 'Workflow & ops'.",
  {
    category: z.string().optional().describe("Exact category name to filter by (see the list in this tool's description)."),
    query: z.string().optional().describe("Free-text match against a tool's name, description, id, or category."),
    id: z.string().optional().describe("Exact tool id, e.g. 'creatify' or 'cursor'."),
    limit: z.number().int().positive().optional().describe("Maximum number of tools to return."),
  },
  async (args) => {
    try {
      const data = await getPrices(args);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Could not reach the Okane Land price index: ${(err as Error).message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "calculate_ai_margin",
  "Turn an AI product's MRR into what the builder actually keeps after the token bill, card processing fees, failed payments, refunds, and sales tax. Also returns the break-even price and the break-even usage cap (tokens per user), the per-customer margin, and a flag when a flat price sits below its own token cost. A metered token bill is owed even past revenue, so a loss is unbounded (not floored at the gross). All monetary values are USD per month. Mirrors Okane Land's margin calculator; directional, not financial advice.",
  {
    pricePerMonth: z.number().describe("What one customer pays per month, in USD."),
    payingCustomers: z.number().int().describe("Number of paying customers right now."),
    blendedTokenPricePerM: z.number().describe("Blended model token price in USD per million tokens (e.g. ~0.5 for Haiku/GPT-mini, ~5 for a Sonnet/GPT-class blend, ~20 for a frontier blend, ~0.1 self-hosted)."),
    tokensPerUserM: z.number().describe("Millions of tokens an average user burns per month."),
    monthlyChurnPct: z.number().optional().describe("Monthly churn as a percent (default 6.1)."),
    intlCardPct: z.number().optional().describe("Percent of sales on international cards, which carry higher fees (default 40)."),
    vatPct: z.number().optional().describe("Sales tax / VAT percent you remit (default 0)."),
    failedPaymentsPct: z.number().optional().describe("Percent of gross lost to failed and declined cards (default 9)."),
    refundsPct: z.number().optional().describe("Percent of gross lost to refunds and disputes (default 3)."),
  },
  async (args) => {
    const result = computeMargin(args);
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
