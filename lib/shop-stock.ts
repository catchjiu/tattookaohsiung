import { coerceSizeOptions } from "@/lib/shop-size-options";

export type SizeStockRow = { size: string; quantity: number };

/**
 * Stock ceiling for one cart line. Null = unlimited (no DB row for sized products,
 * or parent stockQuantity null for single-SKU products).
 */
export function stockCeilingForLine(args: {
  sizeOptions: unknown;
  stockQuantity: number | null;
  sizeStocks: SizeStockRow[];
  cartSize: string | null;
}): number | null {
  const sizes = coerceSizeOptions(args.sizeOptions);
  if (sizes.length === 0) {
    return args.stockQuantity;
  }
  if (!args.cartSize) return null;
  const row = args.sizeStocks.find((r) => r.size === args.cartSize);
  if (!row) return null;
  return row.quantity;
}
