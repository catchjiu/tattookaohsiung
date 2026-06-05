"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { useLanguage } from "@/components/providers/LanguageProvider";

type GalleryPreviewArtwork = {
  id: string;
  title: string | null;
  image_url: string;
  image_urls?: string[];
  tags: string[] | null;
  artists?: { name: string; specialty?: string | null };
};

type Props = {
  artworks: GalleryPreviewArtwork[];
};

export function HomeGalleryPreview({ artworks }: Props) {
  const { t, locale } = useLanguage();
  const galleryHref = locale === "zh-TW" ? "/zh-TW/gallery" : "/gallery";

  if (!artworks.length) return null;

  return (
    <section className="border-t border-border bg-background py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-foreground-muted">
            {t("homeGallery.label")}
          </p>
          <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t("homeGallery.title")}
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-foreground-muted">
            {t("homeGallery.description")}
          </p>
        </motion.div>

        <GalleryGrid artworks={artworks} className="mt-0" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            href={galleryHref}
            className="inline-block border-b border-accent pb-1 text-[13px] font-medium tracking-[0.15em] uppercase text-accent transition-colors hover:text-foreground"
          >
            {t("homeGallery.showMore")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
