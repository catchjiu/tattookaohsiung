"use client";

import { ReviewsCarousel } from "./ReviewsCarousel";
import { StudioMapEmbed } from "./StudioMapEmbed";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { GoogleReview, GoogleReviewsLoadStatus } from "@/lib/google-places";

type Props = {
  reviews: GoogleReview[];
  rating: number | null;
  reviewCount: number | null;
  googleReviewsUrl: string;
  loadStatus: GoogleReviewsLoadStatus;
  showApiHint: boolean;
};

export function ReviewsAndLocationClient({
  reviews,
  rating,
  reviewCount,
  googleReviewsUrl,
  loadStatus,
  showApiHint,
}: Props) {
  const { t } = useLanguage();

  const statusMessageKey =
    loadStatus === "invalid_place_id"
      ? "testimonials.errorInvalidPlaceId"
      : loadStatus === "place_not_found"
        ? "testimonials.errorPlaceNotFound"
        : loadStatus === "api_error"
          ? "testimonials.errorApi"
          : loadStatus === "no_key"
            ? "testimonials.noReviews"
            : loadStatus === "no_reviews"
              ? "testimonials.errorNoReviews"
              : null;

  return (
    <section className="overflow-x-hidden border-t border-border bg-background py-32 md:py-40">
      <div className="mx-auto w-full max-w-6xl px-8">
        <div className="mb-16 max-w-2xl">
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-foreground-muted">
            {t("testimonials.label")}
          </p>
          <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            {t("testimonials.title")}
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-foreground-muted">
            {t("testimonials.description")}
          </p>
          {showApiHint && (
            <p className="mt-4 text-sm text-foreground-muted/80">
              {t("testimonials.apiHint")}
            </p>
          )}
        </div>

        <div className="grid w-full min-w-0 gap-16 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
            <h3 className="mb-6 text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
              {t("testimonials.googleReviews")}
            </h3>
            <ReviewsCarousel
              reviews={reviews}
              googleReviewsUrl={googleReviewsUrl}
              rating={rating}
              reviewCount={reviewCount}
              statusMessage={
                statusMessageKey && reviews.length === 0
                  ? t(statusMessageKey)
                  : undefined
              }
            />
          </div>

          <div className="min-w-0">
            <h3 className="mb-6 text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
              {t("testimonials.locationTitle")}
            </h3>
            <StudioMapEmbed />
          </div>
        </div>
      </div>
    </section>
  );
}
