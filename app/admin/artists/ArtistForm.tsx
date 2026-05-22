"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { Artist } from "@/types/database";
import {
  assignArtistDashboard,
  createArtist,
  revokeArtistDashboard,
  updateArtist,
} from "./actions";
import { ARTIST_JOBS, artistJobLabel } from "@/lib/artist-job";
import { AvatarUpload } from "./AvatarUpload";

type Props = {
  artist?: Artist | null;
  onClose: () => void;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function ArtistForm({ artist, onClose }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(artist?.avatar_url ?? null);
  const [dashboardEmail, setDashboardEmail] = useState(artist?.dashboard_email ?? "");
  const [dashboardPassword, setDashboardPassword] = useState("");
  const isEditing = !!artist;
  const hasDashboard = !!artist?.dashboard_email;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("avatar_url", avatarUrl ?? "");

    const result = isEditing
      ? await updateArtist(artist.id, formData)
      : await createArtist(formData);

    if (result?.error) {
      setError(result.error);
      return;
    }
    router.refresh();
    onClose();
  }

  async function handleAssignDashboard() {
    if (!artist) return;
    setDashboardError(null);
    setDashboardLoading(true);
    const result = await assignArtistDashboard(
      artist.id,
      dashboardEmail,
      dashboardPassword
    );
    setDashboardLoading(false);
    if (result && "error" in result && result.error) {
      setDashboardError(result.error);
      return;
    }
    setDashboardPassword("");
    router.refresh();
  }

  async function handleRevokeDashboard() {
    if (!artist) return;
    if (!confirm("Revoke dashboard access? The artist will no longer be able to sign in.")) {
      return;
    }
    setDashboardError(null);
    setDashboardLoading(true);
    const result = await revokeArtistDashboard(artist.id);
    setDashboardLoading(false);
    if (result && "error" in result && result.error) {
      setDashboardError(result.error);
      return;
    }
    setDashboardEmail("");
    setDashboardPassword("");
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-lg max-h-[90dvh] sm:max-h-[85vh] flex-col rounded-t-xl sm:rounded-md border border-border border-b-0 sm:border-b bg-card shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4 sm:px-6">
          <h2 className="font-display text-lg font-semibold sm:text-xl">
            {isEditing ? "Edit Artist" : "Add Artist"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 rounded-full p-2.5 text-foreground-muted transition-colors hover:bg-border hover:text-foreground touch-manipulation"
            aria-label="Close"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-4">
            <div className="space-y-4">
          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground-muted">
              Name *
            </label>
            <input
              name="name"
              required
              defaultValue={artist?.name}
              onChange={(e) => {
                const slugInput = e.target.form?.querySelector('[name="slug"]') as HTMLInputElement;
                if (slugInput && !artist) slugInput.value = slugify(e.target.value);
              }}
              className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-muted">
              Name (中文)
            </label>
            <input
              name="name_zh"
              defaultValue={artist?.name_zh ?? ""}
              placeholder="例如：卡斯柏"
              className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-muted">
              Slug *
            </label>
            <input
              name="slug"
              required
              defaultValue={artist?.slug}
              className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-muted">
              Bio
            </label>
            <textarea
              name="bio"
              rows={3}
              defaultValue={artist?.bio ?? ""}
              className="mt-1.5 w-full min-h-[88px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-muted">
              Bio (中文)
            </label>
            <textarea
              name="bio_zh"
              rows={3}
              defaultValue={artist?.bio_zh ?? ""}
              className="mt-1.5 w-full min-h-[88px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-muted">
              Specialty
            </label>
            <input
              name="specialty"
              defaultValue={artist?.specialty ?? ""}
              placeholder="e.g. Traditional, Fine-line, Realism"
              className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-muted">
              Specialty (中文)
            </label>
            <input
              name="specialty_zh"
              defaultValue={artist?.specialty_zh ?? ""}
              placeholder="例如：寫實、細線、傳統"
              className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-muted">
              Job *
            </label>
            <select
              name="job"
              defaultValue={artist?.job ?? "TATTOO_ARTIST"}
              className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground"
            >
              {ARTIST_JOBS.map((job) => (
                <option key={job} value={job}>
                  {artistJobLabel(job)}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-foreground-subtle">
              Permanent makeup artists appear on the dedicated PMU page and are excluded from the tattoo gallery.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-muted">
              Instagram Handle
            </label>
            <input
              name="ig_handle"
              defaultValue={artist?.ig_handle ?? ""}
              placeholder="username (without @)"
              className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-muted">
              Booking notification email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={artist?.email ?? ""}
              placeholder="artist@example.com"
              autoComplete="email"
              className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle"
            />
            <p className="mt-1.5 text-xs text-foreground-subtle">
              Internal only — used to notify this artist of new bookings. Not shown on the public site.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-muted">
              Avatar Photo
            </label>
            <div className="mt-2">
              <AvatarUpload value={avatarUrl} onChange={setAvatarUrl} />
            </div>
            <input type="hidden" name="avatar_url" value={avatarUrl ?? ""} />
          </div>

          {isEditing && (
            <div className="rounded-md border border-border bg-card-hover/50 p-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Artist dashboard</h3>
                <p className="mt-1 text-xs text-foreground-subtle">
                  Lets this artist sign in to view their bookings and manage their portfolio.
                </p>
              </div>
              {dashboardError && (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                  {dashboardError}
                </div>
              )}
              {hasDashboard ? (
                <div className="flex items-center justify-between gap-3 rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2">
                  <span className="text-sm text-green-400">
                    Dashboard active — {artist.dashboard_email}
                  </span>
                  <button
                    type="button"
                    onClick={handleRevokeDashboard}
                    disabled={dashboardLoading}
                    className="shrink-0 rounded-md border border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    Revoke
                  </button>
                </div>
              ) : (
                <p className="text-sm text-foreground-muted">No dashboard access yet.</p>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  Login email
                </label>
                <input
                  type="email"
                  value={dashboardEmail}
                  onChange={(e) => setDashboardEmail(e.target.value)}
                  placeholder="artist@example.com"
                  autoComplete="off"
                  className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  {hasDashboard ? "New password (optional)" : "Password *"}
                </label>
                <input
                  type="password"
                  value={dashboardPassword}
                  onChange={(e) => setDashboardPassword(e.target.value)}
                  placeholder={hasDashboard ? "Leave blank to keep current" : "Min. 8 characters"}
                  autoComplete="new-password"
                  className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground"
                />
              </div>
              <button
                type="button"
                onClick={handleAssignDashboard}
                disabled={
                  dashboardLoading ||
                  !dashboardEmail.trim() ||
                  (!hasDashboard && dashboardPassword.length < 8) ||
                  (hasDashboard &&
                    dashboardPassword.length > 0 &&
                    dashboardPassword.length < 8)
                }
                className="w-full rounded-md border-2 border-accent bg-accent-muted px-4 py-2.5 text-sm font-semibold text-accent hover:bg-accent hover:text-charcoal disabled:opacity-50"
              >
                {dashboardLoading
                  ? "Saving..."
                  : hasDashboard
                    ? "Update dashboard login"
                    : "Assign dashboard"}
              </button>
            </div>
          )}

          <div className="flex gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground-muted">
                Display Order
              </label>
              <input
                name="display_order"
                type="number"
                defaultValue={artist?.display_order ?? 0}
                className="mt-1 w-24 rounded-md border border-border bg-card-hover px-3 py-2 text-foreground"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={artist?.is_active ?? true}
                className="h-4 w-4 rounded border-border bg-card-hover text-accent"
              />
              <label className="text-sm text-foreground-muted">Active</label>
            </div>
          </div>
            </div>
          </div>

          {/* Sticky save bar - always visible, safe-area padding for mobile browser chrome */}
          <div className="shrink-0 border-t border-border bg-card px-4 py-4 sm:px-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none rounded-md border-2 border-border px-5 py-3 text-sm font-medium text-foreground-muted transition-colors hover:bg-border hover:text-foreground touch-manipulation"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none rounded-md border-2 border-accent bg-accent-muted px-5 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-charcoal touch-manipulation"
              >
                {isEditing ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
