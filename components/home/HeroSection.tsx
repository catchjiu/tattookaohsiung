"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { HeroSlider } from "./HeroSlider";

const CYAN = "#00e5ff";

type Props = {
  /** Gallery image URLs for hero background carousel */
  imageUrls?: string[];
};

export function HeroSection({ imageUrls = [] }: Props) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-charcoal">
      <HeroSlider imageUrls={imageUrls} intervalMs={5000} />

      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-8 pb-24 pt-32 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl font-bold leading-[1.08] tracking-tight text-ivory sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Tattoo
            <br />
            <span style={{ color: CYAN }}>Kaohsiung</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-10 max-w-md text-[17px] leading-relaxed text-ivory/80"
          >
            {t("hero.tagline")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-none border-2 px-10 py-4 text-[13px] font-semibold tracking-[0.15em] uppercase transition-colors"
              style={{
                borderColor: CYAN,
                backgroundColor: CYAN,
                color: "#0a0a0a",
              }}
            >
              {t("hero.bookSession").toUpperCase()}
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded-none border-2 border-ivory/40 px-10 py-4 text-[13px] font-semibold tracking-[0.15em] uppercase text-ivory/90 transition-colors hover:border-ivory/60 hover:bg-ivory/5 hover:text-ivory"
            >
              {t("hero.viewGallery").toUpperCase()}
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 h-px w-8 -translate-x-1/2 bg-ivory/30"
      />
    </section>
  );
}
