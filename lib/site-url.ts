const DEFAULT_SITE_URL = "https://tattookaohsiung.com";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  const withoutWww = raw.replace("://www.", "://");
  return withoutWww.endsWith("/") ? withoutWww.slice(0, -1) : withoutWww;
}
