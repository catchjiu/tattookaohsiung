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
