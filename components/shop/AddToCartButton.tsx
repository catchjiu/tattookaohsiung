"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

type ProductCartInfo = {
  productId: string;
  variant?: "default" | "compact";
  /** Null = unlimited inventory */
  stockQuantity?: number | null;
};

export function AddToCartButton({
  productId,
  variant = "default",
  stockQuantity = null,
}: ProductCartInfo) {
  const { addItem, lines } = useCart();
  const { t } = useLanguage();

  const qtyInCart = useMemo(() => {
    return lines
      .filter((l) => l.productId === productId)
      .reduce((s, l) => s + l.quantity, 0);
  }, [lines, productId]);

  const tracked = stockQuantity != null;
  const soldOut = tracked && stockQuantity <= 0;
  const atCap = tracked && qtyInCart >= stockQuantity;
  const disabled = soldOut || atCap;

  const cls =
    variant === "compact"
      ? "inline-flex items-center gap-1.5 rounded-md border border-accent bg-accent-muted px-3 py-2 text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-45"
      : "flex w-full items-center justify-center gap-2 rounded-md border-2 border-accent bg-accent-muted py-3.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-charcoal touch-manipulation disabled:cursor-not-allowed disabled:opacity-45";

  let label = t("shop.addToCart");
  if (soldOut) label = t("shop.outOfStock");
  else if (atCap) label = t("shop.maxInCart");

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        addItem(productId, 1);
      }}
      className={cls}
    >
      <Plus size={variant === "compact" ? 14 : 18} strokeWidth={2} />
      {label}
    </button>
  );
}
