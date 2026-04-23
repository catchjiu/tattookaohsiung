"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Locale } from "@/lib/i18n";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitch = (newLocale: Locale) => {
    setLocale(newLocale);

    if (newLocale === "zh-TW" && !pathname.startsWith("/zh-TW")) {
      // Navigate to the /zh-TW equivalent of the current path
      const zhPath = pathname === "/" ? "/zh-TW" : `/zh-TW${pathname}`;
      router.push(zhPath);
    } else if (newLocale === "en" && pathname.startsWith("/zh-TW")) {
      // Strip the /zh-TW prefix to return to the English equivalent
      const enPath = pathname.replace(/^\/zh-TW/, "") || "/";
      router.push(enPath);
    }
  };

  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-card px-1 py-0.5">
      <button
        type="button"
        onClick={() => handleSwitch("zh-TW")}
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
        onClick={() => handleSwitch("en")}
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
