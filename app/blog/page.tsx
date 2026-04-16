import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { BlogContent } from "@/components/blog/BlogContent";

export const metadata: Metadata = {
  title: "Tattoo Blog — Aftercare, Styles & Studio News",
  description:
    "Expert tattoo aftercare guides, style inspiration, and studio news from Casper Tattoo Kaohsiung. Tips from Kaohsiung's leading realism and fine-line artists.",
  alternates: {
    canonical: "/blog",
    languages: { en: "/blog", "zh-TW": "/blog", "x-default": "/blog" },
  },
  openGraph: {
    title: "Tattoo Blog | Casper Tattoo Kaohsiung",
    description:
      "Tattoo aftercare guides, style tips, and studio news from Kaohsiung's premier tattoo studio.",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      publishedAt: { not: null, lte: new Date() },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
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
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        coverImageUrl: p.coverImageUrl,
        publishedAt: p.publishedAt?.toISOString() ?? null,
      }))}
    />
  );
}
