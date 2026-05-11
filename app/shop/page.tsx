import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { ShopContent } from "@/components/shop/ShopContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop — Casper Tattoo Kaohsiung",
  description:
    "Studio products and merchandise from Casper Tattoo Kaohsiung. 高雄刺青工作室精選商品。",
  alternates: {
    canonical: "/shop",
    languages: { en: "/shop", "zh-TW": "/zh-TW/shop", "x-default": "/shop" },
  },
  openGraph: {
    title: "Shop | Casper Tattoo Kaohsiung",
    url: "/shop",
  },
};

export default async function ShopPage() {
  const h = await headers();
  const locale = h.get("x-locale") === "zh-TW" ? "zh-TW" : "en";

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
    },
  });

  const products = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: locale === "zh-TW" ? (p.nameZh ?? p.name) : p.name,
    description:
      locale === "zh-TW"
        ? (p.descriptionZh ?? p.description)
        : p.description,
    priceLabel: p.priceLabel,
    priceTwd: p.priceTwd,
    imageUrl: p.imageUrl,
  }));

  return <ShopContent products={products} />;
}
