import { ReviewsAndLocationClient } from "./ReviewsAndLocationClient";
import {
  getGooglePlaceReviews,
  getGoogleReviewsUrl,
  isGooglePlacesConfigured,
} from "@/lib/google-places";

type Props = {
  locale: "en" | "zh-TW";
};

export async function ReviewsAndLocationSection({ locale }: Props) {
  const { data: placeData, status } = await getGooglePlaceReviews(locale);
  const googleReviewsUrl = getGoogleReviewsUrl(placeData);

  return (
    <ReviewsAndLocationClient
      reviews={placeData?.reviews ?? []}
      rating={placeData?.rating ?? null}
      reviewCount={placeData?.reviewCount ?? null}
      googleReviewsUrl={googleReviewsUrl}
      loadStatus={status}
      showApiHint={
        !isGooglePlacesConfigured() && process.env.NODE_ENV === "development"
      }
    />
  );
}
