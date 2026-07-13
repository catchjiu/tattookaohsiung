"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  getShopCartPreview,
  type CartPreviewLine,
} from "@/app/shop/order-actions";
import { formatProductPrice, formatTwd } from "@/lib/format-price";

export function CartDrawer() {
  const { t, locale } = useLanguage();
  const { lines, setQuantity, removeLine, ready, isOpen, closeCart } =
    useCart();
  const router = useRouter();
  const [rows, setRows] = useState<CartPreviewLine[]>([]);
  const [loading, setLoading] = useState(true);

  const base = locale === "zh-TW" ? "/zh-TW" : "";

  useEffect(() => {
    if (!ready || !isOpen) return;
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
  }, [lines, ready, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, closeCart]);

  const totalTwd =
    rows.length > 0
      ? rows.reduce((sum, line) => {
          if (line.priceTwd == null) return null;
          if (sum === null) return null;
          return sum + line.priceTwd * line.quantity;
        }, 0 as number | null)
      : 0;

  const checkoutBlocked = rows.some((r) => r.exceedsStock);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label={t("shop.closeCart")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-[2px]"
            onClick={closeCart}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t("shop.cartTitle")}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl shadow-black/50"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-serif text-xl font-medium text-foreground">
                {t("shop.cartTitle")}
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-md p-2 text-foreground-muted transition-colors hover:bg-card hover:text-foreground"
                aria-label={t("shop.closeCart")}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {!ready || loading ? (
                <p className="text-sm text-foreground-muted">
                  {t("shop.loadingCart")}
                </p>
              ) : !lines.length ? (
                <div>
                  <p className="text-foreground-muted">{t("shop.cartEmpty")}</p>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-6 text-sm font-medium text-accent hover:underline"
                  >
                    {t("shop.continueShopping")} →
                  </button>
                </div>
              ) : !rows.length ? (
                <div>
                  <p className="text-foreground-muted">{t("shop.cartStale")}</p>
                  <Link
                    href={`${base}/shop`}
                    onClick={closeCart}
                    className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
                  >
                    {t("shop.continueShopping")} →
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {rows.map((p) => {
                    const q = p.quantity;
                    const lineTotal =
                      p.priceTwd != null ? p.priceTwd * q : null;
                    const name =
                      locale === "zh-TW" ? (p.nameZh ?? p.name) : p.name;
                    const othersQty = p.qtyForVariantInCart - q;
                    const maxQ =
                      p.stockQuantity == null
                        ? 99
                        : Math.min(99, Math.max(1, p.stockQuantity - othersQty));
                    return (
                      <li key={p.lineKey} className="flex gap-3 py-5 first:pt-1">
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-charcoal">
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
                            onClick={closeCart}
                            className="text-sm font-medium text-foreground hover:text-accent"
                          >
                            {name}
                          </Link>
                          {p.size ? (
                            <p className="mt-0.5 text-xs text-foreground-muted">
                              {t("shop.size")}: {p.size}
                            </p>
                          ) : null}
                          {formatProductPrice(p.priceTwd, p.priceLabel) ? (
                            <p className="mt-0.5 text-xs text-foreground-muted">
                              {formatProductPrice(p.priceTwd, p.priceLabel)}
                              {p.quantity > 1 ? ` × ${p.quantity}` : ""}
                            </p>
                          ) : null}
                          {p.exceedsStock ? (
                            <p className="mt-1 text-xs text-red-400">
                              {t("shop.cartExceedsStock")}
                            </p>
                          ) : null}
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <label className="flex items-center gap-1.5 text-xs text-foreground-muted">
                              {t("shop.qty")}
                              <input
                                type="number"
                                min={1}
                                max={maxQ}
                                value={q}
                                onChange={(e) => {
                                  const raw = Number(e.target.value) || 1;
                                  const next = Math.min(
                                    maxQ,
                                    Math.max(1, Math.floor(raw))
                                  );
                                  setQuantity(p.productId, next, p.size);
                                }}
                                className="w-14 rounded border border-border bg-background px-1.5 py-1 text-foreground"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => removeLine(p.productId, p.size)}
                              className="inline-flex items-center gap-1 text-xs text-red-400 hover:underline"
                            >
                              <Trash2 size={12} />
                              {t("shop.remove")}
                            </button>
                          </div>
                        </div>
                        <div className="shrink-0 text-right text-sm text-foreground">
                          {lineTotal != null ? (
                            <>{formatTwd(lineTotal)}</>
                          ) : (
                            <span className="text-foreground-muted">—</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {ready && !loading && lines.length > 0 && rows.length > 0 ? (
              <div className="border-t border-border px-5 py-5">
                {totalTwd != null ? (
                  <p className="text-base font-medium text-foreground">
                    {t("shop.subtotal")}{" "}
                    <span className="text-accent">{formatTwd(totalTwd)}</span>
                  </p>
                ) : (
                  <p className="text-sm text-foreground-muted">
                    {t("shop.totalPending")}
                  </p>
                )}
                {checkoutBlocked ? (
                  <p className="mt-3 text-sm text-red-400">
                    {t("shop.cartExceedsStock")}
                  </p>
                ) : null}
                <button
                  type="button"
                  disabled={checkoutBlocked}
                  onClick={() => {
                    closeCart();
                    router.push(`${base}/checkout`);
                  }}
                  className="mt-4 w-full rounded-md bg-accent py-3.5 text-sm font-semibold text-charcoal transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {t("shop.checkout")}
                </button>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-3 w-full text-center text-sm text-accent hover:underline"
                >
                  {t("shop.continueShopping")}
                </button>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
