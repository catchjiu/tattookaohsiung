/** Format amounts in New Taiwan Dollar (TWD) for display across the site. */
export function formatTwd(amount: number): string {
  return `NT$ ${amount.toLocaleString("zh-TW")}`;
}

export function formatTwdOrDash(amount: number | null | undefined): string {
  if (amount == null || !Number.isFinite(amount)) return "—";
  return formatTwd(amount);
}

/**
 * Prefer numeric TWD from the database; fall back to a stored label only when
 * no TWD amount exists (e.g. quote-on-request items).
 */
export function formatProductPrice(
  priceTwd: number | null | undefined,
  priceLabel?: string | null
): string | null {
  if (priceTwd != null && Number.isFinite(priceTwd)) {
    return formatTwd(priceTwd);
  }
  const label = priceLabel?.trim();
  return label || null;
}

/** Unit price for order line items / emails. */
export function formatOrderUnitPrice(
  unitPriceTwd: number | null | undefined,
  priceLabelSnapshot: string | null | undefined,
  quantity: number
): string {
  if (unitPriceTwd != null && Number.isFinite(unitPriceTwd)) {
    return formatTwd(unitPriceTwd);
  }
  if (priceLabelSnapshot?.trim()) {
    return priceLabelSnapshot.trim();
  }
  return "—";
}
