import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";
import { BlogContent } from "@/components/blog/BlogContent";

export const dynamic = "force-dynamic";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "刺青部落格｜術後照顧與高雄刺青資訊 — Casper Tattoo 高雄刺青工作室",
  description:
    "高雄專業刺青術後照顧、風格靈感與工作室最新消息。由高雄寫實刺青、細線刺青師為您分享的實用指南。高雄刺青｜術後護理。",
  keywords: [
    "高雄刺青部落格",
    "刺青術後照顧",
    "高雄刺青護理",
    "寫實刺青高雄",
    "Casper Tattoo 部落格",
    "Kaohsiung tattoo blog",
  ],
  alternates: {
    canonical: "/zh-TW/blog",
    languages: { en: "/blog", "zh-TW": "/zh-TW/blog", "x-default": "/blog" },
  },
  openGraph: {
    title: "刺青部落格｜術後照顧 — Casper Tattoo 高雄刺青",
    description: "高雄刺青術後照顧、工作室消息與實用小知識。",
    url: `${SITE_URL}/zh-TW/blog`,
    locale: "zh_TW",
  },
};

export default async function ZhTWBlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      publishedAt: { not: null, lte: new Date() },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      titleZh: true,
      excerpt: true,
      excerptZh: true,
      category: true,
      categoryZh: true,
      coverImageUrl: true,
      publishedAt: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <BlogContent
      posts={posts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.titleZh ?? p.title,
        excerpt: p.excerptZh ?? p.excerpt,
        category: p.categoryZh ?? p.category,
        coverImageUrl: p.coverImageUrl,
        publishedAt: p.publishedAt?.toISOString() ?? null,
      }))}
    />
  );
}
