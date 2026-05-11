"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
};

type Props = {
  posts: Post[];
};

export function BlogContent({ posts }: Props) {
  const { t, locale } = useLanguage();
  const blogBase = locale === "zh-TW" ? "/zh-TW/blog" : "/blog";

  return (
    <div className="mx-auto max-w-2xl px-8 py-24 md:py-32">
      <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
        {t("blog.label")}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
        {t("blog.title")}
      </h1>
      <p className="mt-6 text-[17px] text-foreground-muted">
        {t("blog.description")}
      </p>

      <div className="mt-20 space-y-16">
        {posts.length === 0 ? (
          <p className="py-20 text-center text-foreground-muted">
            {t("blog.noPosts")}
          </p>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="border-t border-border pt-12 first:mt-0"
            >
              <Link href={`${blogBase}/${post.slug}`} className="group block">
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
                  {t("blog.readMore")}
                </span>
                {post.publishedAt && (
                  <time
                    dateTime={post.publishedAt}
                    className="mt-3 block text-[12px] text-foreground-subtle"
                  >
                    {new Date(post.publishedAt).toLocaleDateString(
                      locale === "zh-TW" ? "zh-TW" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
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
