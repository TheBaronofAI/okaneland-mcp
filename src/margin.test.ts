import { test } from "node:test";
import assert from "node:assert/strict";
import { computeMargin } from "./margin.js";

// These pin the port to the web calculator's verified outputs. If the site's math
// changes, update both together and these assertions catch the drift.

test("default scenario: $20 x 500 on a Sonnet blend keeps $3,260 (33%)", () => {
  const r = computeMargin({
    pricePerMonth: 20,
    payingCustomers: 500,
    blendedTokenPricePerM: 5,
    tokensPerUserM: 2,
  });
  assert.equal(r.gross, 10000);
  assert.equal(r.tokenBill, 5000);
  assert.equal(r.cardFees, 540);
  assert.equal(r.failedPayments, 900);
  assert.equal(r.refunds, 300);
  assert.equal(r.keep, 3260);
  assert.equal(r.keepPct, 33);
  assert.ok(Math.abs((r.breakEvenPrice ?? 0) - 12.25) < 0.05, `break-even price ${r.breakEvenPrice}`);
  assert.ok(Math.abs((r.breakEvenTokensPerUserM ?? 0) - 3.3) < 0.05, `break-even tokens ${r.breakEvenTokensPerUserM}`);
  assert.equal(r.tokenCostExceedsPrice, false);
});

test("deep loss is unclamped and flagged (was hidden by the old -gross clamp)", () => {
  const r = computeMargin({
    pricePerMonth: 5,
    payingCustomers: 500,
    blendedTokenPricePerM: 5,
    tokensPerUserM: 10,
  });
  assert.ok(r.keep < -20000, `keep ${r.keep}`); // true loss ~ -23,047, not clamped -2,500
  assert.equal(r.tokenCostExceedsPrice, true);
  assert.ok((r.breakEvenPrice ?? 0) > 50, `break-even price ${r.breakEvenPrice}`); // ~ $59.81
});

test("self-host blend keeps far more of gross", () => {
  const r = computeMargin({
    pricePerMonth: 20,
    payingCustomers: 500,
    blendedTokenPricePerM: 0.1,
    tokensPerUserM: 2,
  });
  assert.ok(r.keepPct > 75, `keepPct ${r.keepPct}`); // ~82%
});

test("degenerate percentage costs -> no reachable break-even price", () => {
  const r = computeMargin({
    pricePerMonth: 20,
    payingCustomers: 500,
    blendedTokenPricePerM: 5,
    tokensPerUserM: 2,
    vatPct: 40,
    failedPaymentsPct: 40,
    refundsPct: 25,
  });
  assert.equal(r.breakEvenPrice, null);
});

test("empty inputs return a prompt, not NaN", () => {
  const r = computeMargin({ pricePerMonth: 0, payingCustomers: 0, blendedTokenPricePerM: 5, tokensPerUserM: 2 });
  assert.equal(r.gross, 0);
  assert.equal(r.keepPct, 0);
  assert.match(r.note, /Enter a price/);
});
