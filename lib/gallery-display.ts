import type { PortfolioImage } from "@prisma/client";

type PortfolioLocaleFields = Pick<
  PortfolioImage,
  "title" | "titleZh" | "altText" | "altTextZh" | "tags" | "tagsZh"
>;

export type GalleryLocale = "en" | "zh-TW";

export function galleryTitleForLocale(
  img: PortfolioLocaleFields,
  locale: GalleryLocale
): string | null {
  if (locale === "zh-TW") {
    const zh = img.titleZh?.trim() || img.altTextZh?.trim();
    if (zh) return zh;
  }
  return img.title?.trim() || img.altText?.trim() || null;
}

export function galleryTagsForLocale(
  img: PortfolioLocaleFields,
  locale: GalleryLocale
): string[] {
  if (locale === "zh-TW" && img.tagsZh.length > 0) {
    return img.tagsZh;
  }
  return img.tags;
}
