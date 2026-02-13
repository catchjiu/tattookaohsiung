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
    <div className="mx-auto max-w-2xl px-8 py-24 md:py-32">
      <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
        Studio
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
        Blog
      </h1>
      <p className="mt-6 text-[17px] text-foreground-muted">
        Studio news and aftercare tips.
      </p>

      <div className="mt-20 space-y-16">
        {posts.length === 0 ? (
          <p className="py-20 text-center text-foreground-muted">
            No posts yet. Check back soon.
          </p>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="border-t border-border pt-12 first:mt-0"
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                {post.coverImageUrl && (
                  <div className="aspect-[3/2] overflow-hidden bg-card-hover">
                    <img
                      src={post.coverImageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  </div>
                )}
                {post.category && (
                  <span className="mt-6 block text-[11px] font-medium tracking-[0.2em] uppercase text-accent">
                    {post.category}
                  </span>
                )}
                <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-foreground transition-colors group-hover:text-accent md:text-4xl">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-4 inline-block text-[13px] font-medium tracking-wide text-accent group-hover:underline">
                  Read more →
                </span>
                {post.publishedAt && (
                  <time
                    dateTime={post.publishedAt.toISOString()}
                    className="mt-3 block text-[12px] text-foreground-subtle"
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
