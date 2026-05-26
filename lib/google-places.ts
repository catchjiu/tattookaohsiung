import { unstable_cache } from "next/cache";
import {
  STUDIO_GOOGLE_REVIEWS_URL,
  STUDIO_MAP_OPEN_URL,
} from "./studio-location";

export type GoogleReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  relativeTime?: string;
  authorPhotoUrl?: string;
};

export type GooglePlaceReviewsResult = {
  reviews: GoogleReview[];
  rating: number | null;
  reviewCount: number | null;
  googleMapsUri: string;
  placeName: string | null;
};

const PLACES_BASE = "https://places.googleapis.com/v1";

function getApiKey(): string | null {
  return process.env.GOOGLE_PLACES_API_KEY?.trim() || null;
}

function getPlaceId(): string | null {
  return process.env.GOOGLE_PLACE_ID?.trim() || null;
}

function getPlaceQuery(): string {
  return (
    process.env.GOOGLE_PLACE_QUERY?.trim() ||
    "Casper Tattoo Kaohsiung 高雄刺青 左營 實踐路"
  );
}

function languageCode(locale: "en" | "zh-TW"): string {
  return locale === "zh-TW" ? "zh-TW" : "en";
}

type PlacesReview = {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text?: string };
  authorAttribution?: {
    displayName?: string;
    photoUri?: string;
  };
};

type PlacePayload = {
  id?: string;
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesReview[];
};

async function placesFetch<T>(
  path: string,
  options: RequestInit & { fieldMask: string }
): Promise<T | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const { fieldMask, ...init } = options;
  const res = await fetch(`${PLACES_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": fieldMask,
      ...(init.headers as Record<string, string> | undefined),
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[Google Places] ${res.status} ${path}:`, body.slice(0, 400));
    return null;
  }

  return res.json() as Promise<T>;
}

async function resolvePlaceId(lang: string): Promise<string | null> {
  const configured = getPlaceId();
  if (configured) return configured;

  const data = await placesFetch<{ places?: { id?: string }[] }>(
    "/places:searchText",
    {
      method: "POST",
      fieldMask: "places.id",
      body: JSON.stringify({
        textQuery: getPlaceQuery(),
        languageCode: lang,
        maxResultCount: 1,
      }),
    }
  );

  const id = data?.places?.[0]?.id;
  return id ?? null;
}

function normalizeReviews(reviews: PlacesReview[] | undefined): GoogleReview[] {
  if (!reviews?.length) return [];

  const normalized: GoogleReview[] = [];
  reviews.forEach((r, i) => {
    const text = r.text?.text?.trim() ?? "";
    if (!text) return;
    normalized.push({
      id: r.name ?? `review-${i}`,
      author: r.authorAttribution?.displayName?.trim() || "Google user",
      rating: Math.min(5, Math.max(1, Math.round(r.rating ?? 5))),
      text,
      relativeTime: r.relativePublishTimeDescription,
      authorPhotoUrl: r.authorAttribution?.photoUri,
    });
  });
  return normalized;
}

async function fetchPlaceReviewsUncached(
  locale: "en" | "zh-TW"
): Promise<GooglePlaceReviewsResult | null> {
  const lang = languageCode(locale);
  const placeId = await resolvePlaceId(lang);
  if (!placeId) return null;

  const resourceId = placeId.startsWith("places/") ? placeId : `places/${placeId}`;

  const place = await placesFetch<PlacePayload>(`/${resourceId}`, {
    method: "GET",
    fieldMask:
      "displayName,rating,userRatingCount,reviews,googleMapsUri",
  });

  if (!place) return null;

  return {
    reviews: normalizeReviews(place.reviews),
    rating: place.rating ?? null,
    reviewCount: place.userRatingCount ?? null,
    googleMapsUri: place.googleMapsUri ?? STUDIO_MAP_OPEN_URL,
    placeName: place.displayName?.text ?? null,
  };
}

const cachedFetchEn = unstable_cache(
  () => fetchPlaceReviewsUncached("en"),
  ["google-place-reviews", "en"],
  { revalidate: 3600, tags: ["google-reviews"] }
);

const cachedFetchZh = unstable_cache(
  () => fetchPlaceReviewsUncached("zh-TW"),
  ["google-place-reviews", "zh-TW"],
  { revalidate: 3600, tags: ["google-reviews"] }
);

export async function getGooglePlaceReviews(
  locale: "en" | "zh-TW"
): Promise<GooglePlaceReviewsResult | null> {
  if (!getApiKey()) return null;
  return locale === "zh-TW" ? cachedFetchZh() : cachedFetchEn();
}

export function isGooglePlacesConfigured(): boolean {
  return Boolean(getApiKey());
}

export function getGoogleReviewsUrl(
  data: GooglePlaceReviewsResult | null
): string {
  return data?.googleMapsUri ?? STUDIO_GOOGLE_REVIEWS_URL;
}
