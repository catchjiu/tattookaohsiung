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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-foreground-muted">
          {posts.length} post{posts.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setShowCreate(true)}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border-2 border-accent bg-accent-muted px-5 py-3.5 text-base font-semibold text-accent transition-colors hover:bg-accent hover:text-charcoal touch-manipulation"
        >
          <Plus size={20} strokeWidth={1.5} />
          New Post
        </button>
      </div>

      {/* Mobile: card layout */}
      <div className="mt-6 flex flex-col gap-4 md:hidden">
        {posts.length === 0 ? (
          <div className="rounded-md border border-border bg-card px-6 py-12 text-center text-foreground-muted">
            No posts yet. Tap &quot;New Post&quot; to create one.
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col gap-3 rounded-md border-2 border-border bg-card p-4"
            >
              <div>
                <div className="font-display font-semibold text-foreground">{post.title}</div>
                <div className="text-sm text-foreground-muted">/{post.slug}</div>
                {post.category && (
                  <div className="mt-1 text-sm text-foreground-muted">{post.category}</div>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    post.is_published
                      ? "bg-green-500/20 text-green-400"
                      : "bg-border text-foreground-muted"
                  }`}
                >
                  {post.is_published ? "Published" : "Draft"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="flex items-center gap-2 rounded-md border-2 border-border px-4 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-border hover:text-foreground touch-manipulation"
                  >
                    <Pencil size={16} strokeWidth={1.5} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
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

      {/* Desktop: table */}
      <div className="mt-6 hidden overflow-x-auto rounded-md border border-border md:block">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground-muted">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground-muted">
                Category
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
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-foreground-muted"
                >
                  No posts yet. Click &quot;New Post&quot; to create one.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-border bg-card hover:bg-card-hover"
                >
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-foreground">{post.title}</div>
                      <div className="text-xs text-foreground-muted">
                        /{post.slug}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground-muted">
                    {post.category || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        post.is_published
                          ? "bg-green-500/20 text-green-400"
                          : "bg-border text-foreground-muted"
                      }`}
                    >
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingPost(post)}
                        className="rounded p-2 text-foreground-muted transition-colors hover:bg-border hover:text-foreground"
                        title="Edit"
                      >
                        <Pencil size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
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
