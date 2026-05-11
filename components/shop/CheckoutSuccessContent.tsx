"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

type Props = {
  orderId: string | null;
};

export function CheckoutSuccessContent({ orderId }: Props) {
  const { t, locale } = useLanguage();
  const base = locale === "zh-TW" ? "/zh-TW" : "";

  return (
    <div className="mx-auto max-w-lg px-8 py-24 md:py-32">
      <h1 className="font-serif text-3xl font-medium text-foreground">
        {t("shop.orderSuccessTitle")}
      </h1>
      <p className="mt-6 text-foreground-muted">{t("shop.orderSuccessBody")}</p>
      {orderId ? (
        <p className="mt-6 rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground-muted">
          <span className="font-medium text-foreground">
            {t("shop.orderReference")}:{" "}
          </span>
          <code className="break-all text-accent">{orderId}</code>
        </p>
      ) : null}
      <Link
        href={`${base}/shop`}
        className="mt-10 inline-block text-sm font-medium text-accent hover:underline"
      >
        {t("shop.backToShopFromSuccess")} →
      </Link>
    </div>
  );
}
