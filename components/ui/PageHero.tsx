"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeroSlider } from "@/components/home/HeroSlider";
import { useLanguage } from "@/components/providers/LanguageProvider";

const CYAN = "#00e5ff";

type Props = {
  imageUrls: string[];
  labelKey: string;
  titleKey: string;
  descriptionKey?: string;
  bookNow?: boolean;
};

export function PageHero({
  imageUrls,
  labelKey,
  titleKey,
  descriptionKey,
  bookNow = false,
}: Props) {
  const { t, locale } = useLanguage();
  const contactHref = locale === "zh-TW" ? "/zh-TW/contact" : "/contact";

  return (
    <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-charcoal pb-16 pt-20">
      <HeroSlider imageUrls={imageUrls} intervalMs={5000} />

      <div className="relative z-10 w-full px-8 md:px-16 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[11px] font-medium tracking-[0.3em] uppercase text-ivory/50"
          >
            {t(labelKey)}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 font-display text-5xl font-bold tracking-tight text-ivory md:text-6xl lg:text-7xl"
          >
            {t(titleKey)}
          </motion.h1>

          {descriptionKey && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 max-w-xl text-[17px] leading-relaxed text-ivory/70"
            >
              {t(descriptionKey)}
            </motion.p>
          )}

          {bookNow && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-10"
            >
              <Link
                href={contactHref}
                className="inline-flex items-center justify-center rounded-none border-2 px-10 py-4 text-[13px] font-semibold tracking-[0.15em] uppercase transition-colors hover:opacity-90"
                style={{
                  borderColor: CYAN,
                  backgroundColor: CYAN,
                  color: "#0a0a0a",
                }}
              >
                {t("common.bookNow")}
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
