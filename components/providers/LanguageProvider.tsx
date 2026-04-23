"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getStoredLocale, getBrowserLocale, setStoredLocale, type Locale } from "@/lib/i18n";

import en from "@/locales/en.json";
import zhTW from "@/locales/zh-TW.json";

const translations: Record<Locale, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  "zh-TW": zhTW as Record<string, unknown>,
};

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : undefined;
}

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

type Props = {
  children: ReactNode;
  /**
   * Server-determined locale passed from the root layout (read from the
   * x-locale header set by middleware). Using this as the useState initial
   * value ensures SSR and the first client render both use the same locale,
   * which means Chinese pages are crawlable from the very first HTML byte.
   */
  initialLocale?: Locale;
};

export function LanguageProvider({ children, initialLocale = "en" }: Props) {
  // initialLocale drives SSR — both server and first client render agree,
  // so there is no hydration mismatch.
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    // After mount the URL path is authoritative: if the user is browsing
    // /zh-TW/* pages they stay in zh-TW regardless of stored preference.
    const isZhPath = window.location.pathname.startsWith("/zh-TW");
    if (isZhPath) {
      setLocaleState("zh-TW");
    } else {
      setLocaleState(getStoredLocale() ?? getBrowserLocale());
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh-TW" ? "zh-TW" : "en";
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setStoredLocale(newLocale);
  }, []);

  // No !mounted guard needed: because useState(initialLocale) matches the
  // server render, there is no hydration mismatch and we can safely use
  // `locale` directly for all lookups.
  const t = useCallback(
    (key: string): string => {
      const dict = translations[locale];
      const value = getNested(dict as Record<string, unknown>, key);
      if (value) return value;
      return getNested(translations.en as Record<string, unknown>, key) ?? key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
