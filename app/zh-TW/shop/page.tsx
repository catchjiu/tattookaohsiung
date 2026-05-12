import type { Metadata } from "next";
import { ShopContent } from "@/components/shop/ShopContent";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "商店 — Casper Tattoo 高雄刺青",
  description: "Casper Tattoo 高雄刺青工作室精選商品與周邊。",
  alternates: {
    canonical: "/zh-TW/shop",
    languages: { en: "/shop", "zh-TW": "/zh-TW/shop", "x-default": "/shop" },
  },
  openGraph: {
    title: "商店 | Casper Tattoo Kaohsiung",
    url: "/zh-TW/shop",
  },
};

export default async function ShopPageZhTW() {
  const rows = await prisma.shopProduct.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      nameZh: true,
      description: true,
      descriptionZh: true,
      priceLabel: true,
      priceTwd: true,
      imageUrl: true,
      sizeOptions: true,
    },
  });

  const products = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.nameZh ?? p.name,
    description: p.descriptionZh ?? p.description,
    priceLabel: p.priceLabel,
    priceTwd: p.priceTwd,
    imageUrl: p.imageUrl,
    sizeOptions: p.sizeOptions,
  }));

  return <ShopContent products={products} />;
}
