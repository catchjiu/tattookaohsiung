"use client";

import { CalendarClock, MessageCircle, Wallet } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { artistNameForLocale } from "@/lib/artist-display";
import {
  formatBookedUntil,
  getArtistAvailability,
} from "@/lib/artist-availability";
import type { BookingArtistOption } from "./booking-artist";

type Props = {
  artist: BookingArtistOption;
};

function fill(template: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
}

export function ArtistBookingNotice({ artist }: Props) {
  const { t, locale } = useLanguage();
  const name = artistNameForLocale(artist, locale);
  const availability = getArtistAvailability(artist);
  const dateLabel = availability.bookedUntil
    ? formatBookedUntil(availability.bookedUntil, locale)
    : "";

  const availabilityKey =
    dateLabel && availability.kind !== "booked"
      ? `booking.availability.${availability.kind}WithDate`
      : `booking.availability.${availability.kind}`;
  const availabilityText = fill(t(availabilityKey), { name, date: dateLabel });

  return (
    <div
      className="space-y-4 overflow-hidden rounded-sm border-2 border-border bg-card-hover/40 p-5"
      role="region"
      aria-live="polite"
      aria-label={t("booking.artistNoticeLabel")}
    >
      <section>
        <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-foreground-muted">
          <CalendarClock size={14} strokeWidth={1.75} aria-hidden />
          {t("booking.availabilityTitle")}
        </p>
        <p
          className={`mt-2 text-[15px] leading-relaxed ${
            availability.kind === "available"
              ? "text-foreground-muted"
              : "text-amber-200"
          }`}
        >
          {availabilityText}
        </p>
      </section>

      <section className="border-t border-border pt-4">
        <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-foreground-muted">
          <MessageCircle size={14} strokeWidth={1.75} aria-hidden />
          {t("booking.consultationTitle")}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-foreground-muted">
          {t("booking.consultationBody")}
        </p>
        <ul className="mt-3 space-y-1.5 text-[14px] leading-relaxed text-foreground-muted">
          <li className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
            {t("booking.consultationPoint1")}
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
            {t("booking.consultationPoint2")}
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
            {t("booking.consultationPoint3")}
          </li>
        </ul>
      </section>

      <section className="border-t border-amber-500/30 bg-amber-500/10 -mx-5 -mb-5 mt-4 px-5 py-4">
        <p className="flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-amber-200">
          <Wallet size={14} strokeWidth={1.75} aria-hidden />
          {t("booking.depositTitle")}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-amber-100/90">
          {t("booking.depositBody")}
        </p>
      </section>
    </div>
  );
}
