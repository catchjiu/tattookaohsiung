import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, isPublished: true, publishedAt: { not: null, lte: new Date() } },
    select: { title: true, excerpt: true, coverImageUrl: true, publishedAt: true },
  });
  if (!post) return {};
  return {
    title: post.title,
    description:
      post.excerpt ??
      `Read about ${post.title} on the Tattoo Kaohsiung blog — tips, aftercare, and studio news.`,
    alternates: {
      canonical: `/blog/${slug}`,
      languages: {
        en: `/blog/${slug}`,
        "zh-TW": `/blog/${slug}`,
        "x-default": `/blog/${slug}`,
      },
    },
    openGraph: {
      title: `${post.title} | Tattoo Kaohsiung`,
      description: post.excerpt ?? undefined,
      url: `/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImageUrl
        ? [{ url: post.coverImageUrl, alt: `${post.title} — Tattoo Kaohsiung` }]
        : undefined,
    },
  };
}

function BlogContent({ content }: { content: string }) {
  const isHtml = /<[a-z][\s\S]*>/i.test(content);
  const html = isHtml
    ? content
    : content
        .replace(/\n/g, "<br />")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(
          /^### (.*$)/gm,
          "<h3 class='font-display text-xl font-semibold mt-8 mb-3 text-foreground'>$1</h3>"
        )
        .replace(
          /^## (.*$)/gm,
          "<h2 class='font-display text-2xl font-semibold mt-10 mb-3 text-foreground'>$1</h2>"
        )
        .replace(
          /^# (.*$)/gm,
          "<h1 class='font-display text-3xl font-semibold mt-10 mb-3 text-foreground'>$1</h1>"
        );
  return (
    <div
      className="prose prose-invert mt-10 max-w-none text-foreground [&_img]:rounded [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:max-w-2xl [&_p]:text-[17px] [&_p]:leading-relaxed [&_p]:text-foreground-muted"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      isPublished: true,
      publishedAt: { not: null, lte: new Date() },
    },
  });

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-2xl px-8 py-24 md:py-32">
      <Link
        href="/blog"
        className="mb-12 inline-block text-[13px] font-medium tracking-[0.12em] uppercase text-foreground-muted transition-colors hover:text-foreground"
      >
        ← Back to Blog
      </Link>

      <article>
        {post.category && (
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-accent">
            {post.category}
          </span>
        )}
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {post.title}
        </h1>
        {post.publishedAt && (
          <time
            dateTime={post.publishedAt.toISOString()}
            className="mt-4 block text-[14px] text-foreground-muted"
          >
            {post.publishedAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}

        {post.coverImageUrl && (
          <div className="relative mt-10 aspect-[3/2] overflow-hidden bg-card-hover">
            <Image
              src={post.coverImageUrl}
              alt={post.title ? `${post.title} — Tattoo Kaohsiung` : "Tattoo Kaohsiung blog cover"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        )}

        <BlogContent content={post.content} />
      </article>
    </div>
  );
}
