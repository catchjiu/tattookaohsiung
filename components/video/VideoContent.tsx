"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { youtubeThumbnailUrl } from "@/lib/youtube";

type VideoItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  youtubeId: string;
  publishedAt: string | null;
};

type Props = {
  videos: VideoItem[];
};

export function VideoContent({ videos }: Props) {
  const { t, locale } = useLanguage();
  const videoBase = locale === "zh-TW" ? "/zh-TW/video" : "/video";

  return (
    <div className="mx-auto max-w-2xl px-8 py-24 md:py-32">
      <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
        {t("video.label")}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
        {t("video.title")}
      </h1>
      <p className="mt-6 text-[17px] text-foreground-muted">
        {t("video.description")}
      </p>

      <div className="mt-20 space-y-16">
        {videos.length === 0 ? (
          <p className="py-20 text-center text-foreground-muted">
            {t("video.noVideos")}
          </p>
        ) : (
          videos.map((video) => (
            <article
              key={video.id}
              className="border-t border-border pt-12 first:mt-0"
            >
              <Link href={`${videoBase}/${video.slug}`} className="group block">
                <div className="relative aspect-video overflow-hidden bg-card-hover">
                  <img
                    src={youtubeThumbnailUrl(video.youtubeId)}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/90 text-charcoal shadow-lg">
                      <Play size={24} fill="currentColor" strokeWidth={0} />
                    </div>
                  </div>
                </div>
                <h2 className="mt-6 font-serif text-3xl font-medium tracking-tight text-foreground transition-colors group-hover:text-accent md:text-4xl">
                  {video.title}
                </h2>
                {video.excerpt && (
                  <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted line-clamp-3">
                    {video.excerpt}
                  </p>
                )}
                <span className="mt-4 inline-block text-[13px] font-medium tracking-wide text-accent group-hover:underline">
                  {t("video.watchVideo")}
                </span>
                {video.publishedAt && (
                  <time
                    dateTime={video.publishedAt}
                    className="mt-3 block text-[12px] text-foreground-subtle"
                  >
                    {new Date(video.publishedAt).toLocaleDateString(
                      locale === "zh-TW" ? "zh-TW" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </time>
                )}
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
