import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { VideoContent } from "@/components/video/VideoContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio Videos — Process, Walkthroughs & Guides | Casper Tattoo Kaohsiung",
  description:
    "Watch studio videos from Casper Tattoo Kaohsiung — tattoo process, walkthroughs, and aftercare guides from Kaohsiung's professional tattoo artists.",
  alternates: {
    canonical: "/video",
    languages: { en: "/video", "zh-TW": "/zh-TW/video", "x-default": "/video" },
  },
  openGraph: {
    title: "Studio Videos | Casper Tattoo Kaohsiung",
    description:
      "Watch studio videos — tattoo process, walkthroughs, and guides from Casper Tattoo Kaohsiung.",
    url: "/video",
  },
};

export default async function VideoPage() {
  const h = await headers();
  const locale = h.get("x-locale") === "zh-TW" ? "zh-TW" : "en";

  const videos = await prisma.video.findMany({
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
      youtubeId: true,
      publishedAt: true,
    },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
  });

  return (
    <VideoContent
      videos={videos.map((v) => ({
        id: v.id,
        slug: v.slug,
        title: locale === "zh-TW" ? (v.titleZh ?? v.title) : v.title,
        excerpt: locale === "zh-TW" ? (v.excerptZh ?? v.excerpt) : v.excerpt,
        youtubeId: v.youtubeId,
        publishedAt: v.publishedAt?.toISOString() ?? null,
      }))}
    />
  );
}
