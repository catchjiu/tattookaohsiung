import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogPostList } from "./BlogPostList";

export default async function AdminBlogPage() {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  const rows = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  const posts = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    cover_image_url: p.coverImageUrl,
    category: p.category,
    author_id: null,
    is_published: p.isPublished,
    published_at: p.publishedAt?.toISOString() ?? null,
    created_at: p.createdAt.toISOString(),
    updated_at: p.updatedAt.toISOString(),
  }));

  return (
    <div className="p-4 pb-8 sm:p-6 md:p-8">
      <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
        Blog
      </h1>
      <p className="mt-2 text-foreground-muted">
        Manage studio news and aftercare tips. Markdown supported.
      </p>
      <div className="mt-8">
        <BlogPostList posts={posts} />
      </div>
    </div>
  );
}
