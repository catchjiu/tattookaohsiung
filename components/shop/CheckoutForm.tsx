"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { submitShopOrder } from "@/app/shop/order-actions";
import { SHOP_BANK_TRANSFER_DISPLAY } from "@/lib/shop-bank-transfer";

export function CheckoutForm() {
  const { t, locale } = useLanguage();
  const { lines, clearCart, ready } = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const base = locale === "zh-TW" ? "/zh-TW" : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!lines.length) {
      setError(t("shop.cartEmpty"));
      return;
    }
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("cart_json", JSON.stringify(lines));

    const result = await submitShopOrder(formData);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.success && result.orderId) {
      clearCart();
      router.push(`${base}/checkout/success?order=${encodeURIComponent(result.orderId)}`);
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-lg px-8 py-24 text-foreground-muted">
        {t("shop.loadingCart")}
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="mx-auto max-w-lg px-8 py-24">
        <p className="text-foreground-muted">{t("shop.cartEmpty")}</p>
        <Link href={`${base}/shop`} className="mt-4 inline-block text-accent hover:underline">
          {t("shop.continueShopping")} →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-8 py-24 md:py-32">
      <h1 className="font-serif text-3xl font-medium text-foreground">
        {t("shop.checkoutTitle")}
      </h1>
      <p className="mt-4 text-foreground-muted">{t("shop.checkoutBlurb")}</p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-foreground-muted">
            {t("shop.checkoutName")} *
          </label>
          <input
            name="customer_name"
            required
            autoComplete="name"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-muted">
            {t("shop.checkoutEmail")} *
          </label>
          <input
            name="customer_email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-muted">
            {t("shop.checkoutPhone")}
          </label>
          <input
            name="customer_phone"
            type="tel"
            autoComplete="tel"
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-muted">
            {t("shop.checkoutAddress")}
          </label>
          <textarea
            name="shipping_address"
            rows={3}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-foreground"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground-muted">
            {t("shop.checkoutNotes")}
          </label>
          <textarea
            name="notes"
            rows={2}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2.5 text-foreground"
          />
        </div>

        <div className="rounded-md border border-border bg-card/40 px-4 py-5">
          <h2 className="text-sm font-semibold text-foreground">
            {t("shop.checkoutPaymentTitle")}
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            {t("shop.checkoutBankTransferIntro")}
          </p>
          <div className="mt-4 rounded-md border border-border bg-background px-3 py-3 font-mono text-sm text-foreground">
            <span className="text-foreground-muted">
              {t("shop.checkoutBankAccountLabel")}:{" "}
            </span>
            {SHOP_BANK_TRANSFER_DISPLAY}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-foreground-muted">
              {t("shop.checkoutTransferLastFive")} *
            </label>
            <input
              name="transfer_sender_last_five"
              required
              inputMode="numeric"
              autoComplete="off"
              pattern="\d{5}"
              maxLength={5}
              minLength={5}
              placeholder="12345"
              title={t("shop.checkoutTransferLastFiveHint")}
              className="mt-1 w-full max-w-[12rem] rounded-md border border-border bg-background px-3 py-2.5 font-mono text-foreground tracking-widest"
            />
            <p className="mt-1 text-xs text-foreground-subtle">
              {t("shop.checkoutTransferLastFiveHint")}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-accent px-8 py-3.5 text-sm font-semibold text-charcoal transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? t("shop.submitting") : t("shop.placeOrder")}
          </button>
          <Link
            href={`${base}/cart`}
            className="text-center text-sm text-accent hover:underline sm:text-left"
          >
            ← {t("shop.backToCart")}
          </Link>
        </div>
      </form>
    </div>
  );
}
