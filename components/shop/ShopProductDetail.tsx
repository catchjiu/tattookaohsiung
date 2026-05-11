"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

type Props = {
  productId: string;
  name: string;
  description: string;
  priceLabel: string | null;
  priceTwd: number | null;
  imageUrl: string | null;
};

export function ShopProductDetail({
  productId,
  name,
  description,
  priceLabel,
  priceTwd,
  imageUrl,
}: Props) {
  const { t, locale } = useLanguage();
  const base = locale === "zh-TW" ? "/zh-TW/shop" : "/shop";

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
          <div className="mt-10">
            <AddToCartButton productId={productId} />
          </div>
        </div>
      </div>
    </div>
  );
}
