"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Distraction-free lightbox for gallery images.
 * Rendered via portal to avoid parent overflow/transform issues.
 * Click outside or press Escape to close.
 */
export function Lightbox({ src, alt, isOpen, onClose }: Props) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleEscape]);

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

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="relative mx-4 flex max-h-[90vh] max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-h-[85vh] max-w-full object-contain"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
