"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PermanentMakeupBookingForm } from "./PermanentMakeupBookingForm";
import { useLanguage } from "@/components/providers/LanguageProvider";

type Props = {
  open: boolean;
  onClose: () => void;
  artists: { id: string; name: string }[];
};

export function PermanentMakeupBookingModal({ open, onClose, artists }: Props) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-[61] max-h-[90dvh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative border-2 border-border bg-card p-8 md:p-10">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 p-2 text-foreground-muted transition-colors hover:text-foreground"
                aria-label={t("pmuBooking.close")}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
              <PermanentMakeupBookingForm artists={artists} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
