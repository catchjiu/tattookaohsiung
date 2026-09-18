export function parseBookedUntilInput(raw: string | null | undefined): Date | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  return new Date(`${trimmed}T00:00:00.000Z`);
}

export function bookedUntilInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function isCurrentlyBooked(bookedUntil: Date | null | undefined): boolean {
  if (!bookedUntil) return false;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const until = new Date(bookedUntil);
  until.setUTCHours(0, 0, 0, 0);
  return until >= today;
}

export function formatBookedUntil(
  bookedUntil: Date,
  locale: "en" | "zh-TW"
): string {
  return bookedUntil.toLocaleDateString(locale === "zh-TW" ? "zh-TW" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export type ArtistAvailabilityKind =
  | "available"
  | "booked"
  | "closed"
  | "waitlist";

export function getArtistAvailability(input: {
  bookedUntil?: Date | string | null;
  status?: string | null;
}): { kind: ArtistAvailabilityKind; bookedUntil: Date | null } {
  const bookedUntilDate = input.bookedUntil
    ? input.bookedUntil instanceof Date
      ? input.bookedUntil
      : new Date(input.bookedUntil)
    : null;
  const bookedDate = isCurrentlyBooked(bookedUntilDate) ? bookedUntilDate : null;

  if (input.status === "BOOKS_CLOSED") {
    return { kind: "closed", bookedUntil: bookedDate };
  }
  if (input.status === "WAITLIST_ONLY") {
    return { kind: "waitlist", bookedUntil: bookedDate };
  }
  if (bookedDate) {
    return { kind: "booked", bookedUntil: bookedDate };
  }
  return { kind: "available", bookedUntil: null };
}
