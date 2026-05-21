"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  /** When set, enables swipe-style prev/next navigation in the lightbox. */
  images?: string[];
  initialIndex?: number;
};

/**
 * Distraction-free lightbox for gallery images.
 * Rendered via portal to avoid parent overflow/transform issues.
 * Click outside or press Escape to close.
 */
export function Lightbox({
  src,
  alt,
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: Props) {
  const gallery = images && images.length > 0 ? images : [src];
  const [index, setIndex] = useState(initialIndex);
  const hasMultiple = gallery.length > 1;
  const currentSrc = gallery[index] ?? src;
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) setIndex(initialIndex);
  }, [isOpen, initialIndex, src]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + gallery.length) % gallery.length);
  }, [gallery.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % gallery.length);
  }, [gallery.length]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || !hasMultiple) return;
    const endX = e.changedTouches[0]?.clientX;
    if (endX == null) return;
    const diff = endX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!hasMultiple) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    },
    [onClose, hasMultiple, goPrev, goNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-charcoal/95 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:right-8 md:top-8"
            aria-label="Close"
          >
            <X size={24} strokeWidth={1.5} />
          </button>

          {hasMultiple ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:left-6"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:right-6"
                aria-label="Next image"
              >
                <ChevronRight size={28} strokeWidth={1.5} />
              </button>
            </>
          ) : null}

          <motion.div
            key={currentSrc}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative mx-4 flex max-h-[90vh] max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={currentSrc}
              alt={alt}
              className="max-h-[85vh] max-w-full object-contain"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </motion.div>

          {hasMultiple ? (
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-5 bg-accent"
                      : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                />
              ))}
            </div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
