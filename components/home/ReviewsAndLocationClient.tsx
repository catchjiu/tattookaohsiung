"use client";

import { ReviewsCarousel } from "./ReviewsCarousel";
import { StudioMapEmbed } from "./StudioMapEmbed";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { GoogleReview } from "@/lib/google-places";

type Props = {
  reviews: GoogleReview[];
  rating: number | null;
  reviewCount: number | null;
  googleReviewsUrl: string;
  showApiHint: boolean;
};

export function ReviewsAndLocationClient({
  reviews,
  rating,
  reviewCount,
  googleReviewsUrl,
  showApiHint,
}: Props) {
  const { t } = useLanguage();

  return (
    <section className="border-t border-border bg-background py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-8">
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

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
          <div>
            <h3 className="mb-6 text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
              {t("testimonials.googleReviews")}
            </h3>
            <ReviewsCarousel
              reviews={reviews}
              googleReviewsUrl={googleReviewsUrl}
              rating={rating}
              reviewCount={reviewCount}
            />
          </div>

          <div>
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
