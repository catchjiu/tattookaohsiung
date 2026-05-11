export const CART_STORAGE_KEY = "kh-tattoo-cart-v1";

export type CartLine = {
  productId: string;
  quantity: number;
};

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
      const q = Math.floor(Math.max(1, Math.min(99, (row as CartLine).quantity)));
      out.push({ productId: (row as CartLine).productId, quantity: q });
    }
  }
  return out;
}
