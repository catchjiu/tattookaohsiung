/** Studio address — used for map embed and Google Maps links (no API key required). */

export const STUDIO_ADDRESS_EN =
  "No. 18, Shijian Rd, Zuoying District, Kaohsiung City, 813, Taiwan";

export const STUDIO_ADDRESS_ZH = "813高雄市左營區實踐路18號";

export const STUDIO_MAP_QUERY =
  "18+Shijian+Rd,+Zuoying+District,+Kaohsiung+City,+813+Taiwan";

export const STUDIO_MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  "18 Shijian Rd, Zuoying District, Kaohsiung City, 813, Taiwan"
)}&output=embed`;

export const STUDIO_MAP_OPEN_URL = `https://www.google.com/maps/search/?api=1&query=${STUDIO_MAP_QUERY}`;

/** Fallback when Places API does not return a reviews URI */
export const STUDIO_GOOGLE_REVIEWS_URL = STUDIO_MAP_OPEN_URL;
