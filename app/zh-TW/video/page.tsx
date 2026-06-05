import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { VideoContent } from "@/components/video/VideoContent";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "工作室影片 — 刺青過程與保養指南 | Casper Tattoo 高雄刺青",
  description:
    "觀看 Casper Tattoo 高雄刺青工作室影片 — 刺青過程、工作室導覽與術後保養指南。",
  alternates: {
    canonical: "/zh-TW/video",
    languages: { en: "/video", "zh-TW": "/zh-TW/video", "x-default": "/video" },
  },
  openGraph: {
    title: "工作室影片 | Casper Tattoo 高雄刺青",
    description:
      "觀看工作室影片 — 刺青過程、導覽與保養指南。",
    url: `${SITE_URL}/zh-TW/video`,
  },
};

export default async function VideoPageZhTW() {
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
        title: v.titleZh ?? v.title,
        excerpt: v.excerptZh ?? v.excerpt,
        youtubeId: v.youtubeId,
        publishedAt: v.publishedAt?.toISOString() ?? null,
      }))}
    />
  );
}
