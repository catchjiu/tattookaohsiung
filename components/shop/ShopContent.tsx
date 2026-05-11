"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

export type ShopProductCard = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceLabel: string | null;
  priceTwd: number | null;
  imageUrl: string | null;
};

type Props = {
  products: ShopProductCard[];
};

export function ShopContent({ products }: Props) {
  const { t, locale } = useLanguage();
  const base = locale === "zh-TW" ? "/zh-TW/shop" : "/shop";

  return (
    <div className="mx-auto max-w-6xl px-8 py-24 md:py-32">
      <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
        {t("shop.label")}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
        {t("shop.title")}
      </h1>
      <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-foreground-muted">
        {t("shop.description")}
      </p>

      <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="col-span-full py-16 text-center text-foreground-muted">
            {t("shop.noProducts")}
          </p>
        ) : (
          products.map((p) => (
            <article
              key={p.id}
              className="flex flex-col border border-border bg-card transition-colors hover:border-accent hover:bg-card-hover"
            >
              <Link
                href={`${base}/${p.slug}`}
                className="group block flex-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-foreground-subtle">
                      {t("shop.noImage")}
                    </div>
                  )}
                </div>
                <div className="border-t border-border p-6">
                  <h2 className="font-serif text-xl font-medium text-foreground transition-colors group-hover:text-accent">
                    {p.name}
                  </h2>
                  {p.priceLabel && (
                    <p className="mt-2 text-sm font-medium tracking-wide text-accent">
                      {p.priceLabel}
                    </p>
                  )}
                  {p.priceTwd != null && !p.priceLabel ? (
                    <p className="mt-1 text-sm font-medium tracking-wide text-accent">
                      NT$ {p.priceTwd}
                    </p>
                  ) : null}
                  <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-foreground-muted">
                    {p.description}
                  </p>
                  <span className="mt-4 inline-block text-[13px] font-medium tracking-wide text-accent group-hover:underline">
                    {t("shop.viewDetails")} →
                  </span>
                </div>
              </Link>
              <div className="border-t border-border p-4 pt-0">
                <AddToCartButton productId={p.id} variant="compact" />
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
