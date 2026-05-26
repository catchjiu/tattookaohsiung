"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Quote, Star } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { GoogleReview } from "@/lib/google-places";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          strokeWidth={1.5}
          className={i < rating ? "fill-accent text-accent" : "text-foreground-muted/40"}
        />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  sourceLabel,
}: {
  review: GoogleReview;
  sourceLabel: string;
}) {
  const initial = review.author.trim().charAt(0).toUpperCase() || "?";

  return (
    <article className="flex h-full min-w-0 flex-col border border-border bg-background p-6 transition-colors hover:border-accent/30 sm:p-7">
      <Quote size={24} strokeWidth={1.25} className="text-accent/50" aria-hidden />
      <StarRating rating={review.rating} />
      <blockquote className="mt-4 flex-1 break-words text-[15px] leading-relaxed text-foreground">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <footer className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        {review.authorPhotoUrl ? (
          <Image
            src={review.authorPhotoUrl}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-sm font-medium text-accent"
            aria-hidden
          >
            {initial}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-foreground">{review.author}</p>
          {review.relativeTime ? (
            <p className="text-[12px] text-foreground-muted">{review.relativeTime}</p>
          ) : null}
        </div>
      </footer>
      <p className="mt-3 text-[11px] tracking-wide text-foreground-muted/70">
        {sourceLabel}
      </p>
    </article>
  );
}

type Props = {
  reviews: GoogleReview[];
  googleReviewsUrl: string;
  rating: number | null;
  reviewCount: number | null;
  statusMessage?: string;
};

export function ReviewsCarousel({
  reviews,
  googleReviewsUrl,
  rating,
  reviewCount,
  statusMessage,
}: Props) {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    function updateSlidesPerView() {
      const width = window.innerWidth;
      if (width >= 1024) setSlidesPerView(Math.min(2, reviews.length));
      else setSlidesPerView(1);
    }
    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, [reviews.length]);

  const pageCount = Math.max(1, Math.ceil(reviews.length / slidesPerView));

  const scrollToPage = useCallback(
    (page: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(page, pageCount - 1));
      const card = el.querySelector<HTMLElement>("[data-review-card]");
      const gap = 20;
      const cardWidth = card?.offsetWidth ?? el.clientWidth;
      el.scrollTo({
        left: clamped * (cardWidth + gap) * slidesPerView,
        behavior: "smooth",
      });
      setActiveIndex(clamped);
    },
    [pageCount, slidesPerView]
  );

  if (reviews.length === 0) {
    return (
      <div className="w-full border border-border bg-card p-6 text-center sm:p-8">
        <p className="text-foreground-muted">
          {statusMessage ?? t("testimonials.noReviews")}
        </p>
        <Link
          href={googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.1em] uppercase text-accent hover:underline"
        >
          {t("testimonials.viewAllGoogle")}
          <ExternalLink size={14} strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full">
      {(rating != null || reviewCount != null) && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {rating != null && (
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(rating)} />
              <span className="font-serif text-2xl font-medium text-foreground">
                {rating.toFixed(1)}
              </span>
            </div>
          )}
          {reviewCount != null && (
            <span className="text-sm text-foreground-muted">
              {t("testimonials.reviewCount").replace("{count}", String(reviewCount))}
            </span>
          )}
        </div>
      )}

      <div className="relative w-full min-w-0 max-w-full overflow-hidden">
        {pageCount > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollToPage(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border bg-card p-2 text-foreground-muted transition-colors hover:text-foreground disabled:opacity-30 lg:flex"
              aria-label={t("testimonials.previous")}
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollToPage(activeIndex + 1)}
              disabled={activeIndex >= pageCount - 1}
              className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border bg-card p-2 text-foreground-muted transition-colors hover:text-foreground disabled:opacity-30 lg:flex"
              aria-label={t("testimonials.next")}
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className="flex w-full max-w-full snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={() => {
            const el = scrollRef.current;
            if (!el) return;
            const card = el.querySelector<HTMLElement>("[data-review-card]");
            const gap = 20;
            const cardWidth = card?.offsetWidth ?? el.clientWidth;
            const pageWidth = (cardWidth + gap) * slidesPerView;
            if (pageWidth <= 0) return;
            const page = Math.round(el.scrollLeft / pageWidth);
            if (page !== activeIndex) setActiveIndex(page);
          }}
        >
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              data-review-card
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="box-border w-full max-w-full shrink-0 grow-0 basis-full snap-start lg:basis-[calc(50%-0.625rem)] lg:max-w-[calc(50%-0.625rem)]"
            >
              <ReviewCard review={review} sourceLabel={t("testimonials.googleSource")} />
            </motion.div>
          ))}
        </div>

        {pageCount > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToPage(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex
                    ? "w-8 bg-accent"
                    : "w-1.5 bg-border hover:bg-foreground-muted"
                }`}
                aria-label={`${t("testimonials.page")} ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <Link
        href={googleReviewsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 border border-border px-6 py-3 text-[12px] font-medium tracking-[0.12em] uppercase text-foreground-muted transition-colors hover:border-accent hover:text-accent"
      >
        {t("testimonials.viewAllGoogle")}
        <ExternalLink size={14} strokeWidth={1.5} />
      </Link>
    </div>
  );
}
