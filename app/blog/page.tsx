import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      publishedAt: { not: null, lte: new Date() },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      coverImageUrl: true,
      publishedAt: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-4xl font-medium">Blog</h1>
      <p className="mt-4 text-[var(--muted)]">
        Studio news and aftercare tips.
      </p>

      <div className="mt-16 space-y-8">
        {posts.length === 0 ? (
          <p className="text-center text-[var(--muted)]">
            No posts yet. Check back soon.
          </p>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="border-b border-[var(--border)] pb-8 last:border-0"
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                {post.coverImageUrl && (
                  <div className="aspect-[3/2] overflow-hidden rounded-sm">
                    <img
                      src={post.coverImageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                )}
                {post.category && (
                  <span className="mt-4 block text-xs uppercase tracking-wider text-[var(--accent-gold)]">
                    {post.category}
                  </span>
                )}
                <h2 className="mt-2 font-serif text-3xl font-medium group-hover:text-[var(--accent-gold)] sm:text-4xl">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-3 text-sm text-[var(--muted)] line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-3 inline-block text-sm font-medium text-[var(--accent-gold)] group-hover:underline">
                  Read more →
                </span>
                {post.publishedAt && (
                  <time
                    dateTime={post.publishedAt.toISOString()}
                    className="mt-2 block text-xs text-[var(--muted-foreground)]"
                  >
                    {post.publishedAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
