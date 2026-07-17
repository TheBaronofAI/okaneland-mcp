// The Okane Land AI margin math, ported verbatim from the /palette/keep/ calculator
// (src/pages/palette/keep.astro, function recalc + the break-even block). A metered
// token bill is owed past revenue, so `keep` is NOT floored at -gross. The card fee is
// 2.9% + $0.30 domestic, 5.4% + $0.30 on the international share, plus a conversion
// slice folded into the 5.4%. margin.test.ts pins the known-good outputs so this copy
// cannot silently drift from the web tool.

export interface MarginInput {
  pricePerMonth: number;
  payingCustomers: number;
  /** Blended model price in USD per million tokens. */
  blendedTokenPricePerM: number;
  /** Millions of tokens an average user burns per month. */
  tokensPerUserM: number;
  monthlyChurnPct?: number; // default 6.1
  intlCardPct?: number; // default 40
  vatPct?: number; // default 0
  failedPaymentsPct?: number; // default 9
  refundsPct?: number; // default 3
}

export interface MarginResult {
  currency: "USD";
  gross: number;
  tokenBill: number;
  cardFees: number;
  failedPayments: number;
  refunds: number;
  tax: number;
  keep: number;
  keepPct: number;
  perCustomerKeep: number;
  customersReplacedMonthly: number;
  /** Price that lands keep at zero at the current usage, or null if unreachable. */
  breakEvenPrice: number | null;
  /** Tokens/user (millions) that lands keep at zero at the current price, or null. */
  breakEvenTokensPerUserM: number | null;
  /** True when a single average user's token cost already exceeds their price. */
  tokenCostExceedsPrice: boolean;
  note: string;
  source: string;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function computeMargin(input: MarginInput): MarginResult {
  const price = Math.max(0, input.pricePerMonth || 0);
  const users = Math.max(0, input.payingCustomers || 0);
  const tokenPrice = Math.max(0, input.blendedTokenPricePerM || 0);
  const tokensM = Math.max(0, input.tokensPerUserM || 0);
  const churn = Math.max(0, input.monthlyChurnPct ?? 6.1) / 100;
  const intl = Math.min(1, Math.max(0, input.intlCardPct ?? 40) / 100);
  const vat = Math.max(0, input.vatPct ?? 0) / 100;
  const failedPct = Math.max(0, input.failedPaymentsPct ?? 9) / 100;
  const refundPct = Math.max(0, input.refundsPct ?? 3) / 100;

  const gross = price * users;
  const tokenBill = tokensM * tokenPrice * users;
  const domShare = 1 - intl;
  const feeDom = price * 0.029 + 0.3;
  const feeIntl = price * 0.044 + 0.3 + price * 0.01;
  const cardFees = users * (domShare * feeDom + intl * feeIntl);
  const failed = gross * failedPct;
  const refunds = gross * refundPct;
  const tax = gross * vat;
  const keep = gross - tokenBill - cardFees - failed - refunds - tax;
  const keepPct = gross > 0 ? Math.round((keep / gross) * 100) : 0;
  const perCust = users > 0 ? keep / users : 0;
  const replace = Math.round(users * churn);

  // Break-even levers: solve keep = 0 for price (holding usage) and for tokens
  // (holding price). cardFee = price * feeRate + $0.30/user; failed/refunds/tax
  // scale with gross.
  const feeRate = domShare * 0.029 + intl * 0.054;
  const pctSum = failedPct + refundPct + vat;
  const denom = users * (1 - feeRate - pctSum);
  const bePrice = users > 0 && denom > 0 ? (tokenBill + 0.3 * users) / denom : null;
  const budget = gross - cardFees - failed - refunds - tax; // dollars left for tokens at this price
  const beTokens = tokenPrice > 0 && users > 0 && budget > 0 ? budget / (tokenPrice * users) : null;

  const tokenPerUser = tokensM * tokenPrice;

  let note: string;
  if (gross <= 0) {
    note = "Enter a price and paying customers to get a result.";
  } else if (keep < 0) {
    const p = bePrice === null ? "no reachable price" : `a $${r2(bePrice)} price`;
    const t = beTokens === null ? "no reachable usage" : `${r2(beTokens)} M tokens per user`;
    note = `This model loses money. Break even by charging ${p}, or by holding usage to ${t}. Directional, not financial advice.`;
  } else {
    const p = bePrice === null ? "any price clears it" : `down to a $${r2(bePrice)} price`;
    const t = beTokens === null ? "any usage" : `up to ${r2(beTokens)} M tokens per user`;
    note = `You keep ${keepPct}% of gross. You stay profitable ${p}, or ${t}. Directional, not financial advice.`;
  }

  return {
    currency: "USD",
    gross: r2(gross),
    tokenBill: r2(tokenBill),
    cardFees: r2(cardFees),
    failedPayments: r2(failed),
    refunds: r2(refunds),
    tax: r2(tax),
    keep: r2(keep),
    keepPct,
    perCustomerKeep: r2(perCust),
    customersReplacedMonthly: replace,
    breakEvenPrice: bePrice === null ? null : r2(bePrice),
    breakEvenTokensPerUserM: beTokens === null ? null : r2(beTokens),
    tokenCostExceedsPrice: price > 0 && tokenPerUser > price,
    note,
    source: "https://okaneland.com/palette/keep/",
  };
}
