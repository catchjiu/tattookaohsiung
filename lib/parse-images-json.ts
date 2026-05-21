/** Parse ordered image URLs from admin form hidden field. */
export function parseImagesJson(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((v): v is string => typeof v === "string")
      .map((u) => u.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

/** Primary cover URL for listings/cart — first image or legacy fallback. */
export function primaryImageUrl(
  images: string[],
  legacyUrl?: string | null
): string | null {
  if (images.length > 0) return images[0];
  return legacyUrl?.trim() || null;
}
