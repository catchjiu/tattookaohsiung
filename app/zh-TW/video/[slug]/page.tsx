import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RichHtmlBody } from "@/components/shared/RichHtmlBody";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

const SITE_URL = getSiteUrl();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = await prisma.video.findFirst({
    where: { slug, isPublished: true, publishedAt: { not: null, lte: new Date() } },
    select: {
      title: true,
      titleZh: true,
      excerpt: true,
      excerptZh: true,
      youtubeId: true,
      publishedAt: true,
    },
  });
  if (!video) return {};
  const displayTitle = video.titleZh ?? video.title;
  const displayExcerpt = video.excerptZh ?? video.excerpt;
  return {
    title: displayTitle,
    description:
      displayExcerpt ??
      `觀看 ${displayTitle} — Casper Tattoo 高雄刺青工作室影片。`,
    alternates: {
      canonical: `/zh-TW/video/${slug}`,
      languages: {
        en: `/video/${slug}`,
        "zh-TW": `/zh-TW/video/${slug}`,
        "x-default": `/video/${slug}`,
      },
    },
    openGraph: {
      title: `${displayTitle} | Casper Tattoo 高雄刺青`,
      description: displayExcerpt ?? undefined,
      url: `${SITE_URL}/zh-TW/video/${slug}`,
      type: "video.other",
      images: [
        {
          url: `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
          alt: displayTitle,
        },
      ],
    },
  };
}

export default async function VideoDetailPageZhTW({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const video = await prisma.video.findFirst({
    where: {
      slug,
      isPublished: true,
      publishedAt: { not: null, lte: new Date() },
    },
  });

  if (!video) notFound();

  const title = video.titleZh ?? video.title;
  const content = video.contentZh ?? video.content;

  return (
    <div className="mx-auto max-w-2xl px-8 py-24 md:py-32">
      <Link
        href="/zh-TW/video"
        className="mb-12 inline-block text-[13px] font-medium tracking-[0.12em] uppercase text-foreground-muted transition-colors hover:text-foreground"
      >
        ← 返回影片
      </Link>

      <article>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        {video.publishedAt && (
          <time
            dateTime={video.publishedAt.toISOString()}
            className="mt-4 block text-[14px] text-foreground-muted"
          >
            {video.publishedAt.toLocaleDateString("zh-TW", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}

        <div className="relative mt-10 aspect-video overflow-hidden bg-card-hover">
          <iframe
            src={youtubeEmbedUrl(video.youtubeId)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>

        <RichHtmlBody content={content} className="mt-10" />
      </article>
    </div>
  );
}
