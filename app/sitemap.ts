import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [artists, posts, shopProducts] = await Promise.all([
    prisma.artist.findMany({
      where: { status: { not: "INACTIVE" } },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true, publishedAt: { not: null, lte: new Date() } },
      select: { slug: true, updatedAt: true },
    }),
    prisma.shopProduct.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    // ── English (canonical) ──────────────────────────────────────────────
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/artists`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.65,
    },
    {
      url: `${SITE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.35,
    },
    {
      url: `${SITE_URL}/checkout`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.35,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // ── Traditional Chinese (/zh-TW/*) ───────────────────────────────────
    {
      url: `${SITE_URL}/zh-TW`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/zh-TW/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/zh-TW/artists`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/zh-TW/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/zh-TW/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/zh-TW/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.65,
    },
    {
      url: `${SITE_URL}/zh-TW/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.35,
    },
    {
      url: `${SITE_URL}/zh-TW/checkout`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.35,
    },
  ];

  const artistRoutes: MetadataRoute.Sitemap = artists.flatMap((artist) => [
    {
      url: `${SITE_URL}/artists/${artist.slug}`,
      lastModified: artist.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/zh-TW/artists/${artist.slug}`,
      lastModified: artist.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]);

  const blogRoutes: MetadataRoute.Sitemap = posts.flatMap((post) => [
    {
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/zh-TW/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]);

  const shopRoutes: MetadataRoute.Sitemap = shopProducts.flatMap((product) => [
    {
      url: `${SITE_URL}/shop/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.55,
    },
    {
      url: `${SITE_URL}/zh-TW/shop/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.55,
    },
  ]);

  return [...staticRoutes, ...artistRoutes, ...blogRoutes, ...shopRoutes];
}
