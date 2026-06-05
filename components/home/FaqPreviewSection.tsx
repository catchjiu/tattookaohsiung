"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { getHomepageFaqItems } from "@/lib/faq";

export function FaqPreviewSection() {
  const { t, locale } = useLanguage();
  const items = getHomepageFaqItems(locale);
  const faqHref = locale === "zh-TW" ? "/zh-TW/faq" : "/faq";

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
            {t("faq.label")}
          </p>
          <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            {t("faq.title")}
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-foreground-muted">
            {t("faq.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <FaqAccordion items={items} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <Link
            href={faqHref}
            className="inline-flex items-center justify-center border border-border px-10 py-4 text-[13px] font-medium tracking-[0.15em] uppercase text-foreground-muted transition-colors hover:border-accent hover:text-accent"
          >
            {t("faq.viewMore")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
