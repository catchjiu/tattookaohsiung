"use client";

import { useState } from "react";
import { Mail, Phone, Calendar, CalendarCheck, CheckCircle, Trash2 } from "lucide-react";
import { BookingModal, type Booking } from "./BookingModal";
import {
  deleteBooking as adminDeleteBooking,
  updateBookingStatus as adminUpdateBookingStatus,
} from "@/app/admin/bookings/actions";

type BookingsListProps = {
  bookings: Booking[];
  showArtistName?: boolean;
  updateBookingStatus?: typeof adminUpdateBookingStatus;
  deleteBooking?: typeof adminDeleteBooking;
};

export function BookingsList({
  bookings,
  showArtistName = true,
  updateBookingStatus = adminUpdateBookingStatus,
  deleteBooking = adminDeleteBooking,
}: BookingsListProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(
    id: string,
    action: "scheduled" | "complete" | "delete"
  ) {
    setError(null);
    setLoadingId(id);
    try {
      if (action === "delete") {
        const res = await deleteBooking(id);
        if (res.error) setError(res.error);
      } else {
        const status = action === "scheduled" ? "SCHEDULED" : "COMPLETED";
        const res = await updateBookingStatus(id, status);
        if (res.error) setError(res.error);
      }
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      <div className="mt-8 space-y-4">
        {error && (
          <div className="rounded-md border border-[var(--accent-crimson)] bg-[var(--accent-crimson-muted)] px-4 py-2 text-sm text-[var(--accent-crimson)]">
            {error}
          </div>
        )}
        {(bookings ?? []).length === 0 ? (
          <div className="rounded-md border border-dashed border-[var(--border)] py-16 text-center text-[var(--muted)]">
            No bookings yet.
          </div>
        ) : (
          bookings.map((b) => (
            <div
              key={b.id}
              className={`rounded-md border p-6 ${
                b.status === "pending"
                  ? "border-[var(--accent-gold)] bg-[var(--accent-gold-muted)]"
                  : b.status === "scheduled"
                    ? "border-blue-500/30 bg-blue-500/5"
                    : b.status === "completed"
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-[var(--border)] bg-[var(--card)]"
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedBooking(b)}
                className="w-full text-left transition hover:opacity-90"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-serif text-xl font-medium text-[var(--foreground)]">
                        {b.name}
                      </h2>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          b.status === "pending"
                            ? "bg-[var(--accent-gold)]/30 text-[var(--accent-gold)]"
                            : b.status === "scheduled"
                              ? "bg-blue-500/20 text-blue-400"
                              : b.status === "completed"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-[var(--border)] text-[var(--muted)]"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--muted)]">
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} strokeWidth={1.5} />
                        {b.email}
                      </span>
                      {b.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone size={14} strokeWidth={1.5} />
                          {b.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} strokeWidth={1.5} />
                        {new Date(b.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                      {b.style && (
                        <span className="rounded bg-[var(--border)] px-2 py-0.5">{b.style}</span>
                      )}
                      {b.placement && (
                        <span className="rounded bg-[var(--border)] px-2 py-0.5">{b.placement}</span>
                      )}
                      {b.size && (
                        <span className="rounded bg-[var(--border)] px-2 py-0.5">{b.size}</span>
                      )}
                      {showArtistName && b.artists?.name && (
                        <span className="rounded bg-[var(--accent-gold-muted)] px-2 py-0.5 text-[var(--accent-gold)]">
                          {b.artists.name}
                        </span>
                      )}
                    </div>
                    {b.description && (
                      <p className="mt-3 max-w-2xl truncate text-sm text-[var(--muted)]">
                        {b.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>

              <div
                className="mt-4 flex flex-wrap gap-2 border-t border-[var(--border)] pt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => handleAction(b.id, "scheduled")}
                  disabled={loadingId === b.id || b.status === "scheduled"}
                  className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm text-[var(--foreground)] transition hover:bg-[var(--border)] disabled:opacity-50"
                >
                  <CalendarCheck size={14} strokeWidth={1.5} />
                  Scheduled
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(b.id, "complete")}
                  disabled={loadingId === b.id || b.status === "completed"}
                  className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm text-[var(--foreground)] transition hover:bg-[var(--border)] disabled:opacity-50"
                >
                  <CheckCircle size={14} strokeWidth={1.5} />
                  Complete
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(b.id, "delete")}
                  disabled={loadingId === b.id}
                  className="flex items-center gap-1.5 rounded-md border border-[var(--accent-crimson)]/50 bg-transparent px-3 py-1.5 text-sm text-[var(--accent-crimson)] transition hover:bg-[var(--accent-crimson-muted)] disabled:opacity-50"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </>
  );
}
