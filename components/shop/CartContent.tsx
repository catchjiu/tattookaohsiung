"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  getShopCartPreview,
  type CartPreviewLine,
} from "@/app/shop/order-actions";

export function CartContent() {
  const { t, locale } = useLanguage();
  const { lines, setQuantity, removeLine, ready } = useCart();
  const router = useRouter();
  const [rows, setRows] = useState<CartPreviewLine[]>([]);
  const [loading, setLoading] = useState(true);

  const base = locale === "zh-TW" ? "/zh-TW" : "";

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await getShopCartPreview(lines);
      if (!cancelled) {
        setRows(data);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lines, ready]);

  const totalTwd =
    rows.length > 0
      ? rows.reduce((sum, line) => {
          if (line.priceTwd == null) return null;
          if (sum === null) return null;
          return sum + line.priceTwd * line.quantity;
        }, 0 as number | null)
      : 0;

  const checkoutBlocked = rows.some((r) => r.exceedsStock);

  if (!ready || loading) {
    return (
      <div className="mx-auto max-w-2xl px-8 py-24 text-foreground-muted">
        {t("shop.loadingCart")}
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="mx-auto max-w-2xl px-8 py-24 md:py-32">
        <h1 className="font-serif text-3xl font-medium text-foreground">
          {t("shop.cartTitle")}
        </h1>
        <p className="mt-6 text-foreground-muted">{t("shop.cartEmpty")}</p>
        <Link
          href={`${base}/shop`}
          className="mt-8 inline-block text-sm font-medium text-accent hover:underline"
        >
          {t("shop.continueShopping")} →
        </Link>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="mx-auto max-w-2xl px-8 py-24 md:py-32">
        <h1 className="font-serif text-3xl font-medium text-foreground">
          {t("shop.cartTitle")}
        </h1>
        <p className="mt-6 text-foreground-muted">{t("shop.cartStale")}</p>
        <Link
          href={`${base}/shop`}
          className="mt-8 inline-block text-sm font-medium text-accent hover:underline"
        >
          {t("shop.continueShopping")} →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-24 md:py-32">
      <h1 className="font-serif text-3xl font-medium text-foreground">
        {t("shop.cartTitle")}
      </h1>

      <ul className="mt-10 divide-y divide-border border-t border-border">
        {rows.map((p) => {
          const q = p.quantity;
          const lineTotal =
            p.priceTwd != null ? p.priceTwd * q : null;
          const name = locale === "zh-TW" ? (p.nameZh ?? p.name) : p.name;
          const othersQty = p.qtyForProductInCart - q;
          const maxQ =
            p.stockQuantity == null
              ? 99
              : Math.min(99, Math.max(1, p.stockQuantity - othersQty));
          return (
            <li
              key={p.lineKey}
              className="flex gap-4 py-8 first:pt-6"
            >
              <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-charcoal">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`${base}/shop/${p.slug}`}
                  className="font-medium text-foreground hover:text-accent"
                >
                  {name}
                </Link>
                {p.size ? (
                  <p className="mt-1 text-sm text-foreground-muted">
                    {t("shop.size")}: {p.size}
                  </p>
                ) : null}
                {p.priceLabel && (
                  <p className="mt-1 text-sm text-foreground-muted">
                    {p.priceLabel}
                  </p>
                )}
                {p.exceedsStock ? (
                  <p className="mt-2 text-sm text-red-400">
                    {t("shop.cartExceedsStock")}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-foreground-muted">
                    {t("shop.qty")}
                    <input
                      type="number"
                      min={1}
                      max={maxQ}
                      value={q}
                      onChange={(e) => {
                        const raw = Number(e.target.value) || 1;
                        const next = Math.min(maxQ, Math.max(1, Math.floor(raw)));
                        setQuantity(p.productId, next, p.size);
                      }}
                      className="w-16 rounded border border-border bg-background px-2 py-1 text-foreground"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeLine(p.productId, p.size)}
                    className="inline-flex items-center gap-1 text-sm text-red-400 hover:underline"
                  >
                    <Trash2 size={14} />
                    {t("shop.remove")}
                  </button>
                </div>
              </div>
              <div className="shrink-0 text-right text-sm text-foreground">
                {lineTotal != null ? (
                  <>NT$ {lineTotal}</>
                ) : (
                  <span className="text-foreground-muted">—</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 border-t border-border pt-8">
        {totalTwd != null ? (
          <p className="text-lg font-medium text-foreground">
            {t("shop.subtotal")}{" "}
            <span className="text-accent">NT$ {totalTwd}</span>
          </p>
        ) : (
          <p className="text-foreground-muted">{t("shop.totalPending")}</p>
        )}
        {checkoutBlocked ? (
          <p className="mt-4 text-sm text-red-400">{t("shop.cartExceedsStock")}</p>
        ) : null}
        <button
          type="button"
          disabled={checkoutBlocked}
          onClick={() => router.push(`${base}/checkout`)}
          className="mt-6 w-full rounded-md bg-accent py-4 text-sm font-semibold text-charcoal transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto sm:px-10"
        >
          {t("shop.checkout")}
        </button>
        <Link
          href={`${base}/shop`}
          className="mt-4 block text-sm text-accent hover:underline"
        >
          ← {t("shop.continueShopping")}
        </Link>
      </div>
    </div>
  );
}
