"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { formatProductPrice } from "@/lib/format-price";
import type { ShopProductCard } from "@/components/shop/ShopContent";

type Props = {
  products: ShopProductCard[];
};

export function HomeShopPreview({ products }: Props) {
  const { t, locale } = useLanguage();
  const shopBase = locale === "zh-TW" ? "/zh-TW/shop" : "/shop";

  if (!products.length) return null;

  return (
    <section className="border-t border-border bg-background py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-foreground-muted">
            {t("homeShop.label")}
          </p>
          <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t("homeShop.title")}
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-foreground-muted">
            {t("homeShop.description")}
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => {
              const priceDisplay = formatProductPrice(
                product.priceTwd,
                product.priceLabel
              );
              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group flex flex-col border border-border bg-card transition-colors hover:border-accent hover:bg-card-hover"
                >
                  <Link
                    href={`${shopBase}/${product.slug}`}
                    className="block flex-1"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-foreground-subtle">
                          {t("shop.noImage")}
                        </div>
                      )}
                    </div>
                    <div className="border-t border-border bg-background p-5 transition-colors group-hover:bg-card-hover">
                      <h3 className="font-serif text-lg font-medium tracking-tight text-foreground">
                        {product.name}
                      </h3>
                      {priceDisplay ? (
                        <p className="mt-1 text-[13px] tracking-wide text-accent">
                          {priceDisplay}
                        </p>
                      ) : null}
                      <span className="mt-4 inline-block text-[12px] font-medium tracking-[0.15em] uppercase text-foreground-muted transition-colors group-hover:text-accent">
                        {t("shop.viewDetails")}
                      </span>
                    </div>
                  </Link>
                </motion.article>
              );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            href={shopBase}
            className="inline-block border-b border-accent pb-1 text-[13px] font-medium tracking-[0.15em] uppercase text-accent transition-colors hover:text-foreground"
          >
            {t("homeShop.showMore")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
