import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShopProductDetail } from "@/components/shop/ShopProductDetail";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.shopProduct.findFirst({
    where: { slug, isPublished: true },
    select: { name: true, nameZh: true, description: true },
  });
  if (!product) return { title: "商品" };
  const title = product.nameZh ?? product.name;
  return {
    title: `${title} — 商店 | Casper Tattoo`,
    description: (product.description ?? "").slice(0, 160),
    alternates: {
      languages: {
        en: `/shop/${slug}`,
        "zh-TW": `/zh-TW/shop/${slug}`,
        "x-default": `/shop/${slug}`,
      },
    },
  };
}

export default async function ShopProductPageZhTW({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.shopProduct.findFirst({
    where: { slug, isPublished: true },
  });
  if (!product) notFound();

  const name = product.nameZh ?? product.name;
  const description = product.descriptionZh ?? product.description;

  return (
    <ShopProductDetail
      productId={product.id}
      name={name}
      description={description}
      priceLabel={product.priceLabel}
      priceTwd={product.priceTwd}
      imageUrl={product.imageUrl}
    />
  );
}
