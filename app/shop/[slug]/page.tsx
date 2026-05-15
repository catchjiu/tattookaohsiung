import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { ShopProductDetail } from "@/components/shop/ShopProductDetail";
import { coerceSizeOptions } from "@/lib/shop-size-options";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.shopProduct.findFirst({
    where: { slug, isPublished: true },
    select: { name: true, nameZh: true, description: true, descriptionZh: true },
  });
  if (!product) return { title: "Product" };
  return {
    title: `${product.name} — Shop | Casper Tattoo`,
    description: product.description.slice(0, 160),
    alternates: {
      languages: {
        en: `/shop/${slug}`,
        "zh-TW": `/zh-TW/shop/${slug}`,
        "x-default": `/shop/${slug}`,
      },
    },
  };
}

export default async function ShopProductPage({ params }: Props) {
  const { slug } = await params;
  const h = await headers();
  const locale = h.get("x-locale") === "zh-TW" ? "zh-TW" : "en";

  const product = await prisma.shopProduct.findFirst({
    where: { slug, isPublished: true },
    include: {
      sizeStockRows: { select: { size: true, quantity: true } },
    },
  });
  if (!product) notFound();

  const name = locale === "zh-TW" ? (product.nameZh ?? product.name) : product.name;
  const description =
    locale === "zh-TW"
      ? (product.descriptionZh ?? product.description)
      : product.description;

  return (
    <ShopProductDetail
      productId={product.id}
      name={name}
      description={description}
      priceLabel={product.priceLabel}
      priceTwd={product.priceTwd}
      imageUrl={product.imageUrl}
      sizeOptions={coerceSizeOptions(product.sizeOptions as unknown)}
      stockQuantity={product.stockQuantity}
      sizeStocks={product.sizeStockRows.map((r) => ({
        size: r.size,
        quantity: r.quantity,
      }))}
    />
  );
}
