"use client";

import { useEffect, useState } from "react";
import { X, Mail, Phone, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  style: string | null;
  placement: string | null;
  size: string | null;
  description: string | null;
  reference_url: string | null;
  preferred_date: string | null;
  status: string;
  created_at: string;
  artists?: { name: string } | null;
};

type BookingModalProps = {
  booking: Booking | null;
  onClose: () => void;
};

export function BookingModal({ booking, onClose }: BookingModalProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxOpen) setLightboxOpen(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, lightboxOpen]);

  return (
    <AnimatePresence>
      {booking && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[90vh] overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-2xl font-medium text-[var(--foreground)]">
                    {booking.name}
                  </h2>
                  <span
                    className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      booking.status === "pending"
                        ? "bg-[var(--accent-gold)]/30 text-[var(--accent-gold)]"
                        : "bg-[var(--border)] text-[var(--muted)]"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-[var(--muted)] transition hover:bg-[var(--border)] hover:text-[var(--foreground)]"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-4 text-sm">
                  <a
                    href={`mailto:${booking.email}`}
                    className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent-gold)]"
                  >
                    <Mail size={16} />
                    {booking.email}
                  </a>
                  {booking.phone && (
                    <a
                      href={`tel:${booking.phone}`}
                      className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent-gold)]"
                    >
                      <Phone size={16} />
                      {booking.phone}
                    </a>
                  )}
                  <span className="flex items-center gap-2 text-[var(--muted)]">
                    <Calendar size={16} />
                    {new Date(booking.created_at).toLocaleString()}
                  </span>
                </div>

                {booking.preferred_date && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                      Preferred date
                    </p>
                    <p className="mt-1 text-[var(--foreground)]">{booking.preferred_date}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {booking.style && (
                    <span className="rounded bg-[var(--border)] px-2 py-1 text-sm">
                      {booking.style}
                    </span>
                  )}
                  {booking.placement && (
                    <span className="rounded bg-[var(--border)] px-2 py-1 text-sm">
                      {booking.placement}
                    </span>
                  )}
                  {booking.size && (
                    <span className="rounded bg-[var(--border)] px-2 py-1 text-sm">
                      {booking.size}
                    </span>
                  )}
                  {booking.artists?.name && (
                    <span className="rounded bg-[var(--accent-gold-muted)] px-2 py-1 text-sm text-[var(--accent-gold)]">
                      {booking.artists.name}
                    </span>
                  )}
                </div>

                {booking.description && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                      Description / Vision
                    </p>
                    <p className="mt-1 text-[var(--foreground)]">{booking.description}</p>
                  </div>
                )}

                {booking.reference_url && (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                      Reference image
                    </p>
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="block rounded-md border border-[var(--border)] overflow-hidden hover:border-[var(--accent-gold)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
                    >
                      <img
                        src={booking.reference_url}
                        alt="Reference"
                        className="h-24 w-auto max-w-40 object-cover"
                      />
                    </button>
                  </div>
                )}

                {lightboxOpen && booking.reference_url && (
                  <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setLightboxOpen(false)}
                    role="presentation"
                  >
                    <button
                      onClick={() => setLightboxOpen(false)}
                      className="absolute right-4 top-4 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
                      aria-label="Close"
                    >
                      <X size={24} />
                    </button>
                    <img
                      src={booking.reference_url}
                      alt="Reference"
                      className="max-h-[90vh] max-w-full object-contain"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
