import type { Locale } from "@/lib/i18n";

type LocalizedArtistFields = {
  name: string;
  nameZh?: string | null;
  bio?: string | null;
  bioZh?: string | null;
  specialty?: string | null;
  specialtyZh?: string | null;
};

export function artistNameForLocale(
  artist: Pick<LocalizedArtistFields, "name" | "nameZh">,
  locale: Locale
): string {
  if (locale === "zh-TW" && artist.nameZh) return artist.nameZh;
  return artist.name;
}

export function artistBioForLocale(
  artist: Pick<LocalizedArtistFields, "bio" | "bioZh">,
  locale: Locale
): string | null {
  if (locale === "zh-TW" && artist.bioZh) return artist.bioZh;
  return artist.bio ?? null;
}

export function artistSpecialtyForLocale(
  artist: Pick<LocalizedArtistFields, "specialty" | "specialtyZh">,
  locale: Locale
): string | null {
  if (locale === "zh-TW" && artist.specialtyZh) return artist.specialtyZh;
  return artist.specialty ?? null;
}
