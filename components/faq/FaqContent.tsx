"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { getFaqItems } from "@/lib/faq";

export function FaqContent() {
  const { t, locale } = useLanguage();
  const items = getFaqItems(locale);
  const contactHref = locale === "zh-TW" ? "/zh-TW/contact" : "/contact";

  return (
    <div className="mx-auto max-w-3xl px-8 py-24 md:py-32">
      <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
        {t("faq.label")}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
        {t("faq.pageTitle")}
      </h1>
      <p className="mt-6 text-[17px] leading-relaxed text-foreground-muted">
        {t("faq.pageDescription")}
      </p>

      <div className="mt-16">
        <FaqAccordion items={items} />
      </div>

      <div className="mt-20 border-t border-border pt-12 text-center">
        <p className="text-[15px] text-foreground-muted">{t("faq.stillHaveQuestions")}</p>
        <Link
          href={contactHref}
          className="mt-6 inline-flex items-center justify-center border border-accent bg-accent-muted px-10 py-4 text-[13px] font-medium tracking-[0.15em] uppercase text-accent transition-colors hover:bg-accent hover:text-ivory"
        >
          {t("faq.bookConsultation")}
        </Link>
      </div>
    </div>
  );
}
