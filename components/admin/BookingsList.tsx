"use client";

import { useState } from "react";
import { Mail, Phone, Calendar } from "lucide-react";
import { BookingModal, type Booking } from "./BookingModal";

type BookingsListProps = {
  bookings: Booking[];
};

export function BookingsList({ bookings }: BookingsListProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  return (
    <>
      <div className="mt-8 space-y-4">
        {(bookings ?? []).length === 0 ? (
          <div className="rounded-md border border-dashed border-[var(--border)] py-16 text-center text-[var(--muted)]">
            No bookings yet.
          </div>
        ) : (
          bookings.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBooking(b)}
              className={`w-full rounded-md border p-6 text-left transition hover:opacity-90 ${
                b.status === "pending"
                  ? "border-[var(--accent-gold)] bg-[var(--accent-gold-muted)]"
                  : "border-[var(--border)] bg-[var(--card)]"
              }`}
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
                    {b.artists?.name && (
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
          ))
        )}
      </div>

      <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </>
  );
}
