import en from "@/locales/en.json";
import zhTW from "@/locales/zh-TW.json";
import type { Locale } from "@/lib/i18n";

export type FaqItem = {
  question: string;
  answer: string;
};

/** Top 5 FAQ indices shown on the homepage (0-based). */
export const HOMEPAGE_FAQ_INDICES = [0, 1, 2, 4, 5] as const;

const localeData: Record<Locale, { items: FaqItem[] }> = {
  en: en.faq as { items: FaqItem[] },
  "zh-TW": zhTW.faq as { items: FaqItem[] },
};

export function getFaqItems(locale: Locale): FaqItem[] {
  return localeData[locale]?.items ?? localeData.en.items;
}

export function getHomepageFaqItems(locale: Locale): FaqItem[] {
  const items = getFaqItems(locale);
  return HOMEPAGE_FAQ_INDICES.map((i) => items[i]).filter(Boolean);
}
