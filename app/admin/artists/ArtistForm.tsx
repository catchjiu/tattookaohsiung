"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { Artist } from "@/types/database";
import { createArtist, updateArtist } from "./actions";
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(artist?.avatar_url ?? null);
  const isEditing = !!artist;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-md border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium">
            {isEditing ? "Edit Artist" : "Add Artist"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-[var(--accent-crimson)] bg-[var(--accent-crimson-muted)] px-4 py-2 text-sm text-[var(--accent-crimson)]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--muted)]">
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
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[#121212] px-3 py-2 text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--muted)]">
              Slug *
            </label>
            <input
              name="slug"
              required
              defaultValue={artist?.slug}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[#121212] px-3 py-2 text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--muted)]">
              Bio
            </label>
            <textarea
              name="bio"
              rows={3}
              defaultValue={artist?.bio ?? ""}
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[#121212] px-3 py-2 text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--muted)]">
              Specialty
            </label>
            <input
              name="specialty"
              defaultValue={artist?.specialty ?? ""}
              placeholder="e.g. Traditional, Fine-line, Realism"
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[#121212] px-3 py-2 text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--muted)]">
              Instagram Handle
            </label>
            <input
              name="ig_handle"
              defaultValue={artist?.ig_handle ?? ""}
              placeholder="username (without @)"
              className="mt-1 w-full rounded-md border border-[var(--border)] bg-[#121212] px-3 py-2 text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--muted)]">
              Avatar Photo
            </label>
            <div className="mt-2">
              <AvatarUpload value={avatarUrl} onChange={setAvatarUrl} />
            </div>
            <input type="hidden" name="avatar_url" value={avatarUrl ?? ""} />
          </div>

          <div className="flex gap-6">
            <div>
              <label className="block text-sm font-medium text-[var(--muted)]">
                Display Order
              </label>
              <input
                name="display_order"
                type="number"
                defaultValue={artist?.display_order ?? 0}
                className="mt-1 w-24 rounded-md border border-[var(--border)] bg-[#121212] px-3 py-2 text-[var(--foreground)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={artist?.is_active ?? true}
                className="h-4 w-4 rounded border-[var(--border)]"
              />
              <label className="text-sm text-[var(--muted)]">Active</label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--border)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-[var(--accent-gold)] px-4 py-2 text-sm font-medium text-[#121212] hover:bg-[#d4af37]"
            >
              {isEditing ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
