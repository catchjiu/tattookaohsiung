"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { Video } from "@/types/database";
import { createVideo, updateVideo } from "./actions";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type Props = {
  video?: Video | null;
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

export function VideoForm({ video, onClose }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState(video?.content ?? "");
  const [contentZh, setContentZh] = useState(video?.content_zh ?? "");
  const isEditing = !!video;

  useEffect(() => {
    if (video?.content) setContent(video.content);
  }, [video?.content]);

  useEffect(() => {
    if (video?.content_zh) setContentZh(video.content_zh);
  }, [video?.content_zh]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = isEditing
      ? await updateVideo(video.id, formData)
      : await createVideo(formData);

    if (result?.error) {
      setError(result.error);
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl max-h-[90dvh] sm:max-h-[85vh] flex-col rounded-t-xl sm:rounded-md border border-border border-b-0 sm:border-b bg-card shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4 sm:px-6">
          <h2 className="font-display text-lg font-semibold sm:text-xl">
            {isEditing ? "Edit Video" : "New Video"}
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
                  YouTube URL *
                </label>
                <input
                  name="youtube_url"
                  required
                  type="url"
                  defaultValue={video?.youtube_url ?? ""}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle"
                />
                <p className="mt-1.5 text-xs text-foreground-muted">
                  Paste a YouTube watch, youtu.be, or shorts link.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  Title *
                </label>
                <input
                  name="title"
                  required
                  defaultValue={video?.title}
                  onChange={(e) => {
                    const slugInput = e.target.form?.querySelector('[name="slug"]') as HTMLInputElement;
                    if (slugInput && !video) slugInput.value = slugify(e.target.value);
                  }}
                  className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  Title (中文)
                </label>
                <input
                  name="title_zh"
                  defaultValue={video?.title_zh ?? ""}
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
                  defaultValue={video?.slug}
                  className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  rows={2}
                  defaultValue={video?.excerpt ?? ""}
                  placeholder="Short description shown on the video listing"
                  className="mt-1.5 w-full min-h-[60px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  Excerpt (中文)
                </label>
                <textarea
                  name="excerpt_zh"
                  rows={2}
                  defaultValue={video?.excerpt_zh ?? ""}
                  className="mt-1.5 w-full min-h-[60px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  Description
                </label>
                <p className="mt-1.5 mb-2 text-xs text-foreground-muted">
                  Optional rich text shown below the video on the public page.
                </p>
                <RichTextEditor content={content} onChange={setContent} />
                <input type="hidden" name="content" value={content} />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  Description (中文)
                </label>
                <p className="mt-1.5 mb-2 text-xs text-foreground-muted">
                  中文說明（可留空，前台會以英文顯示作為備用）。
                </p>
                <RichTextEditor content={contentZh} onChange={setContentZh} />
                <input type="hidden" name="content_zh" value={contentZh} />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground-muted">
                    Sort order
                  </label>
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={video?.sort_order ?? 0}
                    className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    name="is_published"
                    type="checkbox"
                    defaultChecked={video?.is_published ?? false}
                    className="h-4 w-4 rounded border-border bg-card-hover text-accent"
                  />
                  <label className="text-sm text-foreground-muted">Published</label>
                </div>
              </div>
            </div>
          </div>

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
