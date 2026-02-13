"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Artist } from "@/types/database";
import { ArtistForm } from "./ArtistForm";
import { deleteArtist } from "./actions";

type Props = {
  artists: Artist[];
};

export function ArtistList({ artists }: Props) {
  const router = useRouter();
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this artist? This cannot be undone.")) return;
    setDeletingId(id);
    await deleteArtist(id);
    setDeletingId(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[var(--muted)]">
          {artists.length} artist{artists.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-md bg-[var(--accent-gold)] px-4 py-2 text-sm font-medium text-[#121212] hover:bg-[#d4af37]"
        >
          <Plus size={18} strokeWidth={1.5} />
          Add Artist
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-md border border-[var(--border)]">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--card)]">
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">
                Artist
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">
                Specialty
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">
                IG
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[var(--muted)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {artists.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-[var(--muted)]"
                >
                  No artists yet. Click &quot;Add Artist&quot; to create one.
                </td>
              </tr>
            ) : (
              artists.map((artist) => (
                <tr
                  key={artist.id}
                  className="border-b border-[var(--border)] hover:bg-[var(--card)]/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {artist.avatar_url ? (
                        <img
                          src={artist.avatar_url}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-gold-muted)] font-serif text-sm text-[var(--accent-gold)]">
                          {artist.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{artist.name}</div>
                        <div className="text-xs text-[var(--muted)]">
                          /{artist.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted)]">
                    {artist.specialty || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {artist.ig_handle ? (
                      <a
                        href={`https://instagram.com/${artist.ig_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent-gold)] hover:underline"
                      >
                        @{artist.ig_handle}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        artist.is_active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-[var(--border)] text-[var(--muted)]"
                      }`}
                    >
                      {artist.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingArtist(artist)}
                        className="rounded p-2 text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
                        title="Edit"
                      >
                        <Pencil size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleDelete(artist.id)}
                        disabled={deletingId === artist.id}
                        className="rounded p-2 text-[var(--muted)] hover:bg-[var(--accent-crimson-muted)] hover:text-[var(--accent-crimson)] disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <ArtistForm artist={null} onClose={() => setShowCreate(false)} />
      )}
      {editingArtist && (
        <ArtistForm
          artist={editingArtist}
          onClose={() => setEditingArtist(null)}
        />
      )}
    </>
  );
}
