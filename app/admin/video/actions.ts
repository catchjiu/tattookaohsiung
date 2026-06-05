"use server";

import { prisma } from "@/lib/prisma";
import { extractYoutubeId } from "@/lib/youtube";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function parseYoutube(formData: FormData) {
  const youtubeUrl = (formData.get("youtube_url") as string)?.trim() || "";
  const youtubeId = extractYoutubeId(youtubeUrl);
  if (!youtubeUrl || !youtubeId) {
    return { error: "A valid YouTube URL is required" as const };
  }
  return { youtubeUrl, youtubeId };
}

export async function createVideo(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const slug = ((formData.get("slug") as string) || slugify(title || "")).trim() || slugify(title || "");
  const titleZh = (formData.get("title_zh") as string)?.trim() || null;
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const excerptZh = (formData.get("excerpt_zh") as string)?.trim() || null;
  const content = (formData.get("content") as string)?.trim() || "";
  const contentZh = (formData.get("content_zh") as string)?.trim() || null;
  const sortOrder = parseInt((formData.get("sort_order") as string) || "0", 10) || 0;
  const isPublished = formData.get("is_published") === "on";

  if (!title) return { error: "Title is required" };

  const youtube = parseYoutube(formData);
  if ("error" in youtube) return { error: youtube.error };

  const resolvedSlug = slug || slugify(title);

  try {
    await prisma.video.create({
      data: {
        title,
        titleZh,
        slug: resolvedSlug,
        excerpt,
        excerptZh,
        content,
        contentZh,
        youtubeUrl: youtube.youtubeUrl,
        youtubeId: youtube.youtubeId,
        sortOrder,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create video" };
  }

  revalidatePath("/admin/video");
  revalidatePath("/video");
  revalidatePath("/zh-TW/video");
  revalidatePath(`/video/${resolvedSlug}`);
  revalidatePath(`/zh-TW/video/${resolvedSlug}`);
  return { success: true };
}

export async function updateVideo(id: string, formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const titleZh = (formData.get("title_zh") as string)?.trim() || null;
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const excerptZh = (formData.get("excerpt_zh") as string)?.trim() || null;
  const content = (formData.get("content") as string)?.trim() || "";
  const contentZh = (formData.get("content_zh") as string)?.trim() || null;
  const sortOrder = parseInt((formData.get("sort_order") as string) || "0", 10) || 0;
  const isPublished = formData.get("is_published") === "on";

  if (!title || !slug) return { error: "Title and slug are required" };

  const youtube = parseYoutube(formData);
  if ("error" in youtube) return { error: youtube.error };

  const existing = await prisma.video.findUnique({
    where: { id },
    select: { publishedAt: true, slug: true },
  });

  const publishedAt = isPublished ? (existing?.publishedAt ?? new Date()) : null;
  const oldSlug = existing?.slug;

  try {
    await prisma.video.update({
      where: { id },
      data: {
        title,
        titleZh,
        slug,
        excerpt,
        excerptZh,
        content,
        contentZh,
        youtubeUrl: youtube.youtubeUrl,
        youtubeId: youtube.youtubeId,
        sortOrder,
        isPublished,
        publishedAt,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update video" };
  }

  revalidatePath("/admin/video");
  revalidatePath("/video");
  revalidatePath("/zh-TW/video");
  revalidatePath(`/video/${slug}`);
  revalidatePath(`/zh-TW/video/${slug}`);
  if (oldSlug && oldSlug !== slug) {
    revalidatePath(`/video/${oldSlug}`);
    revalidatePath(`/zh-TW/video/${oldSlug}`);
  }
  return { success: true };
}

export async function deleteVideo(id: string) {
  let resolvedSlug: string | null = null;
  try {
    const row = await prisma.video.findUnique({
      where: { id },
      select: { slug: true },
    });
    resolvedSlug = row?.slug ?? null;
    if (!resolvedSlug) return { error: "Not found" };

    await prisma.video.delete({ where: { id } });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete video" };
  }

  revalidatePath("/admin/video");
  revalidatePath("/video");
  revalidatePath("/zh-TW/video");
  revalidatePath(`/video/${resolvedSlug}`);
  revalidatePath(`/zh-TW/video/${resolvedSlug}`);
  return { success: true };
}
