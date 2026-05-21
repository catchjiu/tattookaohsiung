"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  alt?: string;
  /** Tailwind aspect ratio class, e.g. aspect-[4/5] */
  aspectClass?: string;
  className?: string;
  emptyLabel?: string;
};

export function SwipeGallery({
  images,
  alt = "",
  aspectClass = "aspect-[4/5]",
  className = "",
  emptyLabel = "No image",
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el || images.length === 0) return;
    const clamped = Math.max(0, Math.min(index, images.length - 1));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    setActiveIndex(clamped);
  }, [images.length]);

  useEffect(() => {
    setActiveIndex(0);
    scrollRef.current?.scrollTo({ left: 0 });
  }, [images.join("|")]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== activeIndex) setActiveIndex(index);
  }

  if (images.length === 0) {
    return (
      <div
        className={`relative overflow-hidden border border-border bg-charcoal ${aspectClass} ${className}`}
      >
        <div className="flex h-full items-center justify-center text-foreground-subtle">
          {emptyLabel}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative overflow-hidden border border-border bg-charcoal ${aspectClass}`}
      >
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ touchAction: "pan-x pinch-zoom" }}
        >
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="h-full w-full shrink-0 snap-center snap-always"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt ? `${alt} (${i + 1} of ${images.length})` : ""}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-charcoal/70 p-2 text-white/90 backdrop-blur-sm transition hover:bg-charcoal/90 disabled:pointer-events-none disabled:opacity-0 md:flex"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === images.length - 1}
              className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-charcoal/70 p-2 text-white/90 backdrop-blur-sm transition hover:bg-charcoal/90 disabled:pointer-events-none disabled:opacity-0 md:flex"
              aria-label="Next image"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex
                  ? "w-5 bg-accent"
                  : "w-1.5 bg-foreground-muted/40 hover:bg-foreground-muted/70"
              }`}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
