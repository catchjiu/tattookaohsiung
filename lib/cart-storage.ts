export const CART_STORAGE_KEY = "kh-tattoo-cart-v1";

export type CartLine = {
  productId: string;
  quantity: number;
  /** When product has size options, must match one of them */
  size?: string | null;
};

export function normalizeCartSize(size: string | null | undefined): string | null {
  const s = (size ?? "").trim();
  if (!s) return null;
  return s.slice(0, 64);
}

export function cartLineKey(line: Pick<CartLine, "productId" | "size">): string {
  const sz = normalizeCartSize(line.size);
  return `${line.productId}::${sz ?? ""}`;
}

export function parseCartJson(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const out: CartLine[] = [];
  for (const row of raw) {
    if (
      row &&
      typeof row === "object" &&
      "productId" in row &&
      "quantity" in row &&
      typeof (row as CartLine).productId === "string" &&
      typeof (row as CartLine).quantity === "number"
    ) {
      const q = Math.floor(
        Math.max(1, Math.min(99, (row as CartLine).quantity))
      );
      let size: string | null = null;
      if (
        "size" in row &&
        (row as { size?: unknown }).size != null &&
        typeof (row as { size?: unknown }).size === "string"
      ) {
        size = normalizeCartSize((row as { size: string }).size);
      }
      out.push({ productId: (row as CartLine).productId, quantity: q, size });
    }
  }
  return out;
}
