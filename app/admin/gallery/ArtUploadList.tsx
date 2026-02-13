"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { ArtUpload } from "@/types/database";
import type { Artist } from "@/types/database";
import { ArtUploadForm } from "./ArtUploadForm";
import { deleteArtUpload } from "./actions";

type Props = {
  artUploads: (ArtUpload & { artists?: { name: string } | null })[];
  artists: Artist[];
};

function getArtistName(item: ArtUpload & { artists?: { name: string } | null }) {
  return item.artists?.name ?? "—";
}

export function ArtUploadList({ artUploads, artists }: Props) {
  const router = useRouter();
  const [editingItem, setEditingItem] = useState<ArtUpload | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this artwork? This cannot be undone.")) return;
    setDeletingId(id);
    await deleteArtUpload(id);
    setDeletingId(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[var(--muted)]">
          {artUploads.length} piece{artUploads.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-md bg-[var(--accent-gold)] px-4 py-2 text-sm font-medium text-[#121212] hover:bg-[#d4af37]"
        >
          <Plus size={18} strokeWidth={1.5} />
          Add Artwork
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {artUploads.length === 0 ? (
          <div className="col-span-full rounded-md border border-dashed border-[var(--border)] py-16 text-center text-[var(--muted)]">
            No artwork yet. Click &quot;Add Artwork&quot; to upload.
          </div>
        ) : (
          artUploads.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-md border border-[var(--border)] bg-[var(--card)]"
            >
              <div className="relative aspect-[2/3] overflow-hidden bg-[var(--border)]">
                <img
                  src={item.image_url}
                  alt={item.title || "Artwork"}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                {item.is_featured && (
                  <span className="absolute left-2 top-2 rounded bg-[var(--accent-gold)] px-2 py-0.5 text-xs font-medium text-[#121212]">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="font-medium truncate">{item.title || "Untitled"}</div>
                <div className="text-xs text-[var(--muted)]">
                  {getArtistName(item)}
                </div>
                <div className="mt-2 flex justify-end gap-1">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="rounded p-1.5 text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
                    title="Edit"
                  >
                    <Pencil size={14} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="rounded p-1.5 text-[var(--muted)] hover:bg-[var(--accent-crimson-muted)] hover:text-[var(--accent-crimson)] disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showCreate && (
        <ArtUploadForm
          artUpload={null}
          artists={artists}
          onClose={() => setShowCreate(false)}
        />
      )}
      {editingItem && (
        <ArtUploadForm
          artUpload={editingItem}
          artists={artists}
          onClose={() => setEditingItem(null)}
        />
      )}
    </>
  );
}
