"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { BlogPost } from "@/types/database";
import { createBlogPost, updateBlogPost } from "./actions";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { BlogCoverUpload } from "@/components/admin/BlogCoverUpload";

type Props = {
  post?: BlogPost | null;
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

export function BlogPostForm({ post, onClose }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url ?? "");
  const isEditing = !!post;

  useEffect(() => {
    if (post?.content) setContent(post.content);
  }, [post?.content]);

  useEffect(() => {
    if (post?.cover_image_url) setCoverImageUrl(post.cover_image_url);
  }, [post?.cover_image_url]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = isEditing
      ? await updateBlogPost(post.id, formData)
      : await createBlogPost(formData);

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
            {isEditing ? "Edit Post" : "New Post"}
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
              Title *
            </label>
            <input
              name="title"
              required
              defaultValue={post?.title}
              onChange={(e) => {
                const slugInput = e.target.form?.querySelector('[name="slug"]') as HTMLInputElement;
                if (slugInput && !post) slugInput.value = slugify(e.target.value);
              }}
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
              defaultValue={post?.slug}
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
              defaultValue={post?.excerpt ?? ""}
              className="mt-1.5 w-full min-h-[60px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-muted">
              Content *
            </label>
            <p className="mt-1.5 mb-2 text-xs text-foreground-muted">
              Use the toolbar to format text, add images (upload or paste), and embed YouTube videos.
            </p>
            <RichTextEditor content={content} onChange={setContent} />
            <input type="hidden" name="content" value={content} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-muted">
              Cover Image
            </label>
            <p className="mt-1.5 mb-2 text-xs text-foreground-muted">
              Optional. 3:2 landscape for blog post headers.
            </p>
            <BlogCoverUpload
              value={coverImageUrl || null}
              onChange={(url) => setCoverImageUrl(url ?? "")}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground-muted">
                Category
              </label>
              <input
                name="category"
                defaultValue={post?.category ?? ""}
                placeholder="Studio News, Aftercare Tips"
                className="mt-1.5 w-full min-h-[44px] rounded-md border-2 border-border bg-card-hover px-3 py-3 text-base text-foreground placeholder:text-foreground-subtle"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                name="is_published"
                type="checkbox"
                defaultChecked={post?.is_published ?? false}
                className="h-4 w-4 rounded border-border bg-card-hover text-accent"
              />
              <label className="text-sm text-foreground-muted">Published</label>
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
