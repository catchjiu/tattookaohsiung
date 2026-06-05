import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { RichHtmlBody } from "@/components/shared/RichHtmlBody";
import { youtubeEmbedUrl } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const h = await headers();
  const locale = h.get("x-locale") === "zh-TW" ? "zh-TW" : "en";
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
  const displayTitle = locale === "zh-TW" ? (video.titleZh ?? video.title) : video.title;
  const displayExcerpt = locale === "zh-TW" ? (video.excerptZh ?? video.excerpt) : video.excerpt;
  return {
    title: displayTitle,
    description:
      displayExcerpt ??
      `Watch ${displayTitle} on the Casper Tattoo Kaohsiung video page.`,
    alternates: {
      canonical: `/video/${slug}`,
      languages: {
        en: `/video/${slug}`,
        "zh-TW": `/zh-TW/video/${slug}`,
        "x-default": `/video/${slug}`,
      },
    },
    openGraph: {
      title: `${displayTitle} | Casper Tattoo Kaohsiung`,
      description: displayExcerpt ?? undefined,
      url: `/video/${slug}`,
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

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const h = await headers();
  const locale = h.get("x-locale") === "zh-TW" ? "zh-TW" : "en";

  const video = await prisma.video.findFirst({
    where: {
      slug,
      isPublished: true,
      publishedAt: { not: null, lte: new Date() },
    },
  });

  if (!video) notFound();

  const title = locale === "zh-TW" ? (video.titleZh ?? video.title) : video.title;
  const content = locale === "zh-TW" ? (video.contentZh ?? video.content) : video.content;
  const backHref = locale === "zh-TW" ? "/zh-TW/video" : "/video";
  const backLabel = locale === "zh-TW" ? "← 返回影片" : "← Back to Videos";

  return (
    <div className="mx-auto max-w-2xl px-8 py-24 md:py-32">
      <Link
        href={backHref}
        className="mb-12 inline-block text-[13px] font-medium tracking-[0.12em] uppercase text-foreground-muted transition-colors hover:text-foreground"
      >
        {backLabel}
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
            {video.publishedAt.toLocaleDateString(locale === "zh-TW" ? "zh-TW" : "en-US", {
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
