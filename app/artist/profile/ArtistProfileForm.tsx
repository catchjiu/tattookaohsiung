"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateArtistAvailability } from "./actions";
import { bookedUntilInputValue } from "@/lib/artist-availability";

type Props = {
  bookedUntil: string | null;
};

export function ArtistProfileForm({ bookedUntil }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [clearBooked, setClearBooked] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    if (clearBooked) {
      formData.set("clear_booked_until", "on");
    }

    const result = await updateArtistAvailability(formData);
    setSaving(false);

    if (result && "error" in result && result.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  const inputValue = bookedUntil ? bookedUntilInputValue(new Date(bookedUntil)) : "";

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-6">
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-md border border-border bg-card p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Availability</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Let clients know when your books are full. This appears on your public profile.
          </p>
        </div>

        <div>
          <label
            htmlFor="booked_until"
            className="block text-sm font-medium text-foreground-muted"
          >
            Booked until
          </label>
          <input
            id="booked_until"
            name="booked_until"
            type="date"
            defaultValue={inputValue}
            disabled={clearBooked}
            className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground disabled:opacity-50"
          />
          <p className="mt-1.5 text-xs text-foreground-subtle">
            Leave blank or clear to show as available for new bookings.
          </p>
        </div>

        {inputValue && (
          <label className="flex items-center gap-2 text-sm text-foreground-muted">
            <input
              type="checkbox"
              checked={clearBooked}
              onChange={(e) => setClearBooked(e.target.checked)}
              className="h-4 w-4 rounded border-border bg-card-hover text-accent"
            />
            Clear booked until date (show as available)
          </label>
        )}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-md border-2 border-accent bg-accent-muted px-5 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-charcoal disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save availability"}
      </button>
    </form>
  );
}
