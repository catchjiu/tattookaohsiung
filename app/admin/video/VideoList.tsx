"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Video } from "@/types/database";
import { VideoForm } from "./VideoForm";
import { deleteVideo } from "./actions";

type Props = {
  videos: Video[];
};

export function VideoList({ videos }: Props) {
  const router = useRouter();
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this video? This cannot be undone.")) return;
    setDeletingId(id);
    await deleteVideo(id);
    setDeletingId(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-foreground-muted">
          {videos.length} video{videos.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setShowCreate(true)}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border-2 border-accent bg-accent-muted px-5 py-3.5 text-base font-semibold text-accent transition-colors hover:bg-accent hover:text-charcoal touch-manipulation"
        >
          <Plus size={20} strokeWidth={1.5} />
          New Video
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:hidden">
        {videos.length === 0 ? (
          <div className="rounded-md border border-border bg-card px-6 py-12 text-center text-foreground-muted">
            No videos yet. Tap &quot;New Video&quot; to create one.
          </div>
        ) : (
          videos.map((video) => (
            <div
              key={video.id}
              className="flex flex-col gap-3 rounded-md border-2 border-border bg-card p-4"
            >
              <div>
                <div className="font-display font-semibold text-foreground">{video.title}</div>
                <div className="text-sm text-foreground-muted">/{video.slug}</div>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    video.is_published
                      ? "bg-green-500/20 text-green-400"
                      : "bg-border text-foreground-muted"
                  }`}
                >
                  {video.is_published ? "Published" : "Draft"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingVideo(video)}
                    className="flex items-center gap-2 rounded-md border-2 border-border px-4 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-border hover:text-foreground touch-manipulation"
                  >
                    <Pencil size={16} strokeWidth={1.5} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    disabled={deletingId === video.id}
                    className="flex items-center gap-2 rounded-md border-2 border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50 touch-manipulation"
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 hidden overflow-x-auto rounded-md border border-border md:block">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground-muted">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground-muted">
                Order
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground-muted">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-foreground-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {videos.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-foreground-muted">
                  No videos yet. Click &quot;New Video&quot; to create one.
                </td>
              </tr>
            ) : (
              videos.map((video) => (
                <tr
                  key={video.id}
                  className="border-b border-border bg-card hover:bg-card-hover"
                >
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-foreground">{video.title}</div>
                      <div className="text-xs text-foreground-muted">/{video.slug}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground-muted">
                    {video.sort_order}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        video.is_published
                          ? "bg-green-500/20 text-green-400"
                          : "bg-border text-foreground-muted"
                      }`}
                    >
                      {video.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingVideo(video)}
                        className="rounded p-2 text-foreground-muted transition-colors hover:bg-border hover:text-foreground"
                        title="Edit"
                      >
                        <Pencil size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        disabled={deletingId === video.id}
                        className="rounded p-2 text-foreground-muted transition-colors hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50"
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

      {showCreate && <VideoForm video={null} onClose={() => setShowCreate(false)} />}
      {editingVideo && (
        <VideoForm video={editingVideo} onClose={() => setEditingVideo(null)} />
      )}
    </>
  );
}
