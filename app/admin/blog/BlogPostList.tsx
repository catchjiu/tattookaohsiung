"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { BlogPost } from "@/types/database";
import { BlogPostForm } from "./BlogPostForm";
import { deleteBlogPost } from "./actions";

type Props = {
  posts: BlogPost[];
};

export function BlogPostList({ posts }: Props) {
  const router = useRouter();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeletingId(id);
    await deleteBlogPost(id);
    setDeletingId(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[var(--muted)]">
          {posts.length} post{posts.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-md bg-[var(--accent-gold)] px-4 py-2 text-sm font-medium text-[#121212] hover:bg-[#d4af37]"
        >
          <Plus size={18} strokeWidth={1.5} />
          New Post
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-md border border-[var(--border)]">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--card)]">
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--muted)]">
                Category
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
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-[var(--muted)]"
                >
                  No posts yet. Click &quot;New Post&quot; to create one.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-[var(--border)] hover:bg-[var(--card)]/50"
                >
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-xs text-[var(--muted)]">
                        /{post.slug}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--muted)]">
                    {post.category || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        post.is_published
                          ? "bg-green-500/20 text-green-400"
                          : "bg-[var(--border)] text-[var(--muted)]"
                      }`}
                    >
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingPost(post)}
                        className="rounded p-2 text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
                        title="Edit"
                      >
                        <Pencil size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
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
        <BlogPostForm post={null} onClose={() => setShowCreate(false)} />
      )}
      {editingPost && (
        <BlogPostForm
          post={editingPost}
          onClose={() => setEditingPost(null)}
        />
      )}
    </>
  );
}
