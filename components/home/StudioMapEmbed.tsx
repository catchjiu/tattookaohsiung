"use client";

import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  STUDIO_ADDRESS_EN,
  STUDIO_ADDRESS_ZH,
  STUDIO_MAP_EMBED_URL,
  STUDIO_MAP_OPEN_URL,
} from "@/lib/studio-location";

export function StudioMapEmbed() {
  const { t, locale } = useLanguage();
  const address = locale === "zh-TW" ? STUDIO_ADDRESS_ZH : STUDIO_ADDRESS_EN;

  return (
    <div className="overflow-hidden border-2 border-border bg-card">
      <div className="relative aspect-[4/3] w-full min-h-[280px]">
        <iframe
          title={t("testimonials.mapTitle")}
          src={STUDIO_MAP_EMBED_URL}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="flex flex-col gap-4 border-t border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-sm leading-relaxed text-foreground-muted">
          <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-accent" />
          {address}
        </p>
        <Link
          href={STUDIO_MAP_OPEN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 border border-accent bg-accent-muted px-5 py-2.5 text-[12px] font-medium tracking-[0.1em] uppercase text-accent transition-colors hover:bg-accent hover:text-charcoal"
        >
          {t("testimonials.openInMaps")}
          <ExternalLink size={14} strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  );
}
