import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const SITE_URL = getSiteUrl();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, isPublished: true, publishedAt: { not: null, lte: new Date() } },
    select: {
      title: true,
      titleZh: true,
      excerpt: true,
      excerptZh: true,
      coverImageUrl: true,
      publishedAt: true,
    },
  });
  if (!post) return {};
  const displayTitle = post.titleZh ?? post.title;
  const displayExcerpt = post.excerptZh ?? post.excerpt;
  return {
    title: displayTitle,
    description:
      displayExcerpt ??
      `閱讀 ${displayTitle} — Casper Tattoo 高雄刺青工作室部落格，術後照顧與工作室消息。`,
    alternates: {
      canonical: `/zh-TW/blog/${slug}`,
      languages: {
        en: `/blog/${slug}`,
        "zh-TW": `/zh-TW/blog/${slug}`,
        "x-default": `/blog/${slug}`,
      },
    },
    openGraph: {
      title: `${displayTitle} | Casper Tattoo Kaohsiung`,
      description: displayExcerpt ?? undefined,
      url: `${SITE_URL}/zh-TW/blog/${slug}`,
      locale: "zh_TW",
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImageUrl
        ? [{ url: post.coverImageUrl, alt: `${displayTitle} — Casper Tattoo Kaohsiung` }]
        : undefined,
    },
  };
}

function BlogArticleBody({ content }: { content: string }) {
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

export default async function ZhTWBlogPostPage({
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

  const title = post.titleZh ?? post.title;
  const category = post.categoryZh ?? post.category;
  const content = post.contentZh ?? post.content;

  return (
    <div className="mx-auto max-w-2xl px-8 py-24 md:py-32">
      <Link
        href="/zh-TW/blog"
        className="mb-12 inline-block text-[13px] font-medium tracking-[0.12em] uppercase text-foreground-muted transition-colors hover:text-foreground"
      >
        ← 返回部落格
      </Link>

      <article>
        {category && (
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-accent">
            {category}
          </span>
        )}
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {title}
        </h1>
        {post.publishedAt && (
          <time
            dateTime={post.publishedAt.toISOString()}
            className="mt-4 block text-[14px] text-foreground-muted"
          >
            {post.publishedAt.toLocaleDateString("zh-TW", {
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
              alt={title ? `${title} — Casper Tattoo Kaohsiung` : "Casper Tattoo Kaohsiung blog cover"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        )}

        <BlogArticleBody content={content} />
      </article>
    </div>
  );
}
