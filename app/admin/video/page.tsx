import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { VideoList } from "./VideoList";

export default async function AdminVideoPage() {
  await requireAdmin();

  const rows = await prisma.video.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const videos = rows.map((v) => ({
    id: v.id,
    slug: v.slug,
    title: v.title,
    title_zh: v.titleZh,
    excerpt: v.excerpt,
    excerpt_zh: v.excerptZh,
    content: v.content,
    content_zh: v.contentZh,
    youtube_url: v.youtubeUrl,
    youtube_id: v.youtubeId,
    sort_order: v.sortOrder,
    is_published: v.isPublished,
    published_at: v.publishedAt?.toISOString() ?? null,
    created_at: v.createdAt.toISOString(),
    updated_at: v.updatedAt.toISOString(),
  }));

  return (
    <div className="p-4 pb-8 sm:p-6 md:p-8">
      <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
        Videos
      </h1>
      <p className="mt-2 text-foreground-muted">
        Upload YouTube videos with rich text descriptions for the public Video page.
      </p>
      <div className="mt-8">
        <VideoList videos={videos} />
      </div>
    </div>
  );
}
