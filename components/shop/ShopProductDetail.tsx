"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { normalizeCartSize } from "@/lib/cart-storage";
import {
  stockCeilingForLine,
  type SizeStockRow,
} from "@/lib/shop-stock";

type Props = {
  productId: string;
  name: string;
  description: string;
  priceLabel: string | null;
  priceTwd: number | null;
  imageUrl: string | null;
  /** Normalized on the server; still defensively handled here */
  sizeOptions?: string[] | null;
  /** Single-SKU stock (ignored when product has sizes) */
  stockQuantity?: number | null;
  /** Rows only for sizes with tracked inventory */
  sizeStocks?: SizeStockRow[];
};

export function ShopProductDetail({
  productId,
  name,
  description,
  priceLabel,
  priceTwd,
  imageUrl,
  sizeOptions = [],
  stockQuantity = null,
  sizeStocks = [],
}: Props) {
  const { t, locale } = useLanguage();
  const { addItem, lines } = useCart();
  const base = locale === "zh-TW" ? "/zh-TW/shop" : "/shop";

  const sortedSizes = useMemo(
    () => [...(sizeOptions ?? [])].map((s) => s.trim()).filter(Boolean),
    [sizeOptions]
  );
  const needsSize = sortedSizes.length > 0;
  const [selectedSize, setSelectedSize] = useState("");

  const cartSizeNorm = useMemo(
    () => (needsSize ? normalizeCartSize(selectedSize) : null),
    [needsSize, selectedSize]
  );

  const ceiling = useMemo(() => {
    return stockCeilingForLine({
      sizeOptions,
      stockQuantity,
      sizeStocks,
      cartSize: cartSizeNorm,
    });
  }, [sizeOptions, stockQuantity, sizeStocks, cartSizeNorm]);

  const qtyThisVariant = useMemo(() => {
    if (!needsSize) {
      return lines
        .filter((l) => l.productId === productId)
        .reduce((s, l) => s + l.quantity, 0);
    }
    if (!cartSizeNorm) return 0;
    return lines
      .filter(
        (l) =>
          l.productId === productId &&
          normalizeCartSize(l.size) === cartSizeNorm
      )
      .reduce((s, l) => s + l.quantity, 0);
  }, [lines, productId, needsSize, cartSizeNorm]);

  const finiteStock = ceiling !== null;
  const soldOut = finiteStock && ceiling <= 0;
  const slack = finiteStock ? Math.max(0, ceiling - qtyThisVariant) : Infinity;

  const addDisabled = needsSize && !cartSizeNorm;
  const atCap = finiteStock && slack <= 0 && !soldOut;
  const btnDisabled = addDisabled || soldOut || atCap;

  let buttonLabel = t("shop.addToCart");
  if (soldOut) buttonLabel = t("shop.outOfStock");
  else if (atCap) buttonLabel = t("shop.maxInCart");

  function optionSoldOut(sizeLabel: string): boolean {
    const cap = stockCeilingForLine({
      sizeOptions,
      stockQuantity,
      sizeStocks,
      cartSize: sizeLabel,
    });
    return cap !== null && cap <= 0;
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-24 md:py-32">
      <Link
        href={base}
        className="text-[13px] font-medium tracking-wide text-accent hover:underline"
      >
        ← {t("shop.backToShop")}
      </Link>

      <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden border border-border bg-charcoal">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-foreground-subtle">
              {t("shop.noImage")}
            </div>
          )}
        </div>
        <div>
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
            {t("shop.label")}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
            {name}
          </h1>
          {priceLabel && (
            <p className="mt-4 text-lg font-medium text-accent">{priceLabel}</p>
          )}
          {priceTwd != null && !priceLabel ? (
            <p className="mt-2 text-lg font-medium text-accent">NT$ {priceTwd}</p>
          ) : null}
          <div className="prose-shop mt-8 whitespace-pre-wrap text-[17px] leading-relaxed text-foreground-muted">
            {description}
          </div>

          {needsSize ? (
            <div className="mt-10">
              <label
                htmlFor="shop-size"
                className="text-[12px] font-medium tracking-[0.15em] uppercase text-foreground-muted"
              >
                {t("shop.selectSize")}
              </label>
              <select
                id="shop-size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="mt-2 w-full max-w-xs rounded-md border-2 border-border bg-background px-3 py-3 text-foreground"
              >
                <option value="">{t("shop.sizePlaceholder")}</option>
                {sortedSizes.map((s) => {
                  const oos = optionSoldOut(s);
                  return (
                    <option key={s} value={s} disabled={oos}>
                      {oos ? `${s} (${t("shop.outOfStock")})` : s}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : null}

          {finiteStock && !soldOut && slack > 0 && slack !== Infinity ? (
            <p className="mt-6 text-sm text-foreground-muted">
              {t("shop.stockRemaining").replace("{count}", String(slack))}
            </p>
          ) : null}

          <div className="mt-10">
            <button
              type="button"
              disabled={btnDisabled}
              onClick={() =>
                addItem(
                  productId,
                  1,
                  needsSize ? selectedSize : null
                )
              }
              className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-accent bg-accent-muted py-3.5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-45 touch-manipulation"
            >
              <Plus size={18} strokeWidth={2} />
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
