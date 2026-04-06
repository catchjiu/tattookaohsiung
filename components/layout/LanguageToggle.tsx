"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-card px-1 py-0.5">
      <button
        type="button"
        onClick={() => setLocale("zh-TW")}
        className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
          locale === "zh-TW"
            ? "bg-accent text-ivory"
            : "text-foreground-muted hover:text-foreground"
        }`}
      >
        中文
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
          locale === "en"
            ? "bg-accent text-ivory"
            : "text-foreground-muted hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}
