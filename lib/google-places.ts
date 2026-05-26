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

export type GoogleReviewsLoadStatus =
  | "ok"
  | "no_key"
  | "invalid_place_id"
  | "place_not_found"
  | "api_error"
  | "no_reviews";

export type GooglePlaceReviewsResponse = {
  data: GooglePlaceReviewsResult | null;
  status: GoogleReviewsLoadStatus;
};

const PLACES_BASE = "https://places.googleapis.com/v1";

function getApiKey(): string | null {
  return process.env.GOOGLE_PLACES_API_KEY?.trim() || null;
}

function getPlaceIdRaw(): string | null {
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

/** Business Place IDs usually start with ChIJ. Review link IDs often start with ChZD. */
export function normalizePlaceId(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const fromResource = trimmed.match(/places\/(ChIJ[\w-]+)/i);
  if (fromResource) return fromResource[1];

  const chij = trimmed.match(/(ChIJ[\w-]+)/i);
  if (chij) return chij[1];

  if (trimmed.startsWith("places/")) return trimmed.replace(/^places\//, "");

  return trimmed;
}

export function isLikelyReviewId(placeId: string): boolean {
  return /^ChZD/i.test(placeId) || placeId.includes("data=!") || placeId.length > 80;
}

function toResourceName(placeId: string): string {
  return placeId.startsWith("places/") ? placeId : `places/${placeId}`;
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

type FetchResult<T> = { data: T | null; status: number; error?: string };

async function placesFetch<T>(
  path: string,
  options: RequestInit & { fieldMask: string }
): Promise<FetchResult<T>> {
  const apiKey = getApiKey();
  if (!apiKey) return { data: null, status: 0, error: "no_key" };

  const { fieldMask, ...init } = options;
  const res = await fetch(`${PLACES_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": fieldMask,
      ...(init.headers as Record<string, string> | undefined),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[Google Places] ${res.status} ${path}:`, body.slice(0, 500));
    return { data: null, status: res.status, error: body.slice(0, 200) };
  }

  return { data: (await res.json()) as T, status: res.status };
}

async function searchPlaceId(lang: string): Promise<string | null> {
  const result = await placesFetch<{ places?: { id?: string }[] }>(
    "/places:searchText",
    {
      method: "POST",
      fieldMask: "places.id,places.displayName",
      body: JSON.stringify({
        textQuery: getPlaceQuery(),
        languageCode: lang,
        maxResultCount: 1,
      }),
    }
  );

  const id = result.data?.places?.[0]?.id;
  if (!id) return null;
  return normalizePlaceId(id);
}

async function fetchPlaceDetails(
  placeId: string,
  lang: string
): Promise<FetchResult<PlacePayload>> {
  const normalized = normalizePlaceId(placeId);
  if (!normalized) {
    return { data: null, status: 0, error: "invalid_place_id" };
  }

  return placesFetch<PlacePayload>(
    `/${toResourceName(normalized)}?languageCode=${encodeURIComponent(lang)}`,
    {
      method: "GET",
      fieldMask:
        "displayName,rating,userRatingCount,reviews,googleMapsUri",
    }
  );
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
): Promise<GooglePlaceReviewsResponse> {
  if (!getApiKey()) {
    return { data: null, status: "no_key" };
  }

  const lang = languageCode(locale);
  const configured = getPlaceIdRaw();
  let placeId: string | null = null;

  if (configured) {
    const normalized = normalizePlaceId(configured);
    if (!normalized || isLikelyReviewId(normalized)) {
      console.error(
        "[Google Places] GOOGLE_PLACE_ID looks like a review URL/ID, not a business Place ID (should start with ChIJ). Falling back to text search."
      );
      placeId = await searchPlaceId(lang);
      if (!placeId) {
        return { data: null, status: "invalid_place_id" };
      }
    } else {
      placeId = normalized;
    }
  } else {
    placeId = await searchPlaceId(lang);
    if (!placeId) {
      return { data: null, status: "place_not_found" };
    }
  }

  let details = await fetchPlaceDetails(placeId, lang);

  if (!details.data && configured) {
    const fallbackId = await searchPlaceId(lang);
    if (fallbackId && fallbackId !== placeId) {
      details = await fetchPlaceDetails(fallbackId, lang);
      placeId = fallbackId;
    }
  }

  if (!details.data) {
    return {
      data: null,
      status: details.status === 403 || details.status === 401 ? "api_error" : "place_not_found",
    };
  }

  const reviews = normalizeReviews(details.data.reviews);
  const result: GooglePlaceReviewsResult = {
    reviews,
    rating: details.data.rating ?? null,
    reviewCount: details.data.userRatingCount ?? null,
    googleMapsUri: details.data.googleMapsUri ?? STUDIO_MAP_OPEN_URL,
    placeName: details.data.displayName?.text ?? null,
  };

  if (reviews.length === 0) {
    return { data: result, status: "no_reviews" };
  }

  return { data: result, status: "ok" };
}

const cachedFetchEn = unstable_cache(
  () => fetchPlaceReviewsUncached("en"),
  ["google-place-reviews-v2", "en", getPlaceIdRaw() ?? "", getPlaceQuery()],
  { revalidate: 600, tags: ["google-reviews"] }
);

const cachedFetchZh = unstable_cache(
  () => fetchPlaceReviewsUncached("zh-TW"),
  ["google-place-reviews-v2", "zh-TW", getPlaceIdRaw() ?? "", getPlaceQuery()],
  { revalidate: 600, tags: ["google-reviews"] }
);

export async function getGooglePlaceReviews(
  locale: "en" | "zh-TW"
): Promise<GooglePlaceReviewsResponse> {
  if (!getApiKey()) {
    return { data: null, status: "no_key" };
  }
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
