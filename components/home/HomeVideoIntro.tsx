"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { youtubeEmbedUrl } from "@/lib/youtube";

const INTRO_YOUTUBE_ID = "ECi4NS44Oco";

export function HomeVideoIntro() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-border bg-background py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-foreground-muted">
            {t("homeIntro.label")}
          </p>
          <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            {t("homeIntro.title")}
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-foreground-muted">
            {t("homeIntro.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative aspect-video overflow-hidden bg-card-hover"
        >
          <iframe
            src={youtubeEmbedUrl(INTRO_YOUTUBE_ID)}
            title={t("homeIntro.title")}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </motion.div>
      </div>
    </section>
  );
}
