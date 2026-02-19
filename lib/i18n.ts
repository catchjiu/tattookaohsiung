export type Locale = "en" | "zh-TW";

const STORAGE_KEY = "tattookaohsiung-locale";

/**
 * Detect preferred locale from browser.
 * zh, zh-TW, zh-HK -> zh-TW; else en
 */
export function getBrowserLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const lang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || "";
  if (lang.startsWith("zh")) return "zh-TW";
  return "en";
}

export function getStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "zh-TW") return stored;
  return null;
}

export function setStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, locale);
}

export function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  return getStoredLocale() ?? getBrowserLocale();
}
