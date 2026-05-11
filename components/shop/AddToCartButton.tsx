"use client";

import { Plus } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

type ProductCartInfo = {
  productId: string;
  variant?: "default" | "compact";
};

export function AddToCartButton({
  productId,
  variant = "default",
}: ProductCartInfo) {
  const { addItem } = useCart();
  const { t } = useLanguage();

  const cls =
    variant === "compact"
      ? "inline-flex items-center gap-1.5 rounded-md border border-accent bg-accent-muted px-3 py-2 text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent hover:text-charcoal"
      : "flex w-full items-center justify-center gap-2 rounded-md border-2 border-accent bg-accent-muted py-3.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-charcoal touch-manipulation";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(productId, 1);
      }}
      className={cls}
    >
      <Plus size={variant === "compact" ? 14 : 18} strokeWidth={2} />
      {t("shop.addToCart")}
    </button>
  );
}
