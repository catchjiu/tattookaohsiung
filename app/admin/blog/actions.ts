"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createBlogPost(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const slug = ((formData.get("slug") as string) || slugify(title || "")).trim() || slugify(title || "");
  const titleZh = (formData.get("title_zh") as string)?.trim() || null;
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const excerptZh = (formData.get("excerpt_zh") as string)?.trim() || null;
  const content = (formData.get("content") as string)?.trim() || "";
  const contentZh = (formData.get("content_zh") as string)?.trim() || null;
  const coverImageUrl = (formData.get("cover_image_url") as string)?.trim() || null;
  const category = (formData.get("category") as string)?.trim() || null;
  const categoryZh = (formData.get("category_zh") as string)?.trim() || null;
  const isPublished = formData.get("is_published") === "on";

  if (!title) return { error: "Title is required" };

  const resolvedSlug = slug || slugify(title);

  try {
    await prisma.blogPost.create({
      data: {
        title,
        titleZh,
        slug: resolvedSlug,
        excerpt,
        excerptZh,
        content,
        contentZh,
        coverImageUrl,
        category,
        categoryZh,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create post" };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/zh-TW/blog");
  revalidatePath(`/blog/${resolvedSlug}`);
  revalidatePath(`/zh-TW/blog/${resolvedSlug}`);
  return { success: true };
}

export async function updateBlogPost(id: string, formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const titleZh = (formData.get("title_zh") as string)?.trim() || null;
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const excerptZh = (formData.get("excerpt_zh") as string)?.trim() || null;
  const content = (formData.get("content") as string)?.trim() || "";
  const contentZh = (formData.get("content_zh") as string)?.trim() || null;
  const coverImageUrl = (formData.get("cover_image_url") as string)?.trim() || null;
  const category = (formData.get("category") as string)?.trim() || null;
  const categoryZh = (formData.get("category_zh") as string)?.trim() || null;
  const isPublished = formData.get("is_published") === "on";

  if (!title || !slug) return { error: "Title and slug are required" };

  const existing = await prisma.blogPost.findUnique({
    where: { id },
    select: { publishedAt: true, slug: true },
  });

  const publishedAt = isPublished
    ? (existing?.publishedAt ?? new Date())
    : null;

  const oldSlug = existing?.slug;

  try {
    await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        titleZh,
        slug,
        excerpt,
        excerptZh,
        content,
        contentZh,
        coverImageUrl,
        category,
        categoryZh,
        isPublished,
        publishedAt,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update post" };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/zh-TW/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath(`/zh-TW/blog/${slug}`);
  if (oldSlug && oldSlug !== slug) {
    revalidatePath(`/blog/${oldSlug}`);
    revalidatePath(`/zh-TW/blog/${oldSlug}`);
  }
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  let resolvedSlug: string | null = null;
  try {
    const row = await prisma.blogPost.findUnique({
      where: { id },
      select: { slug: true },
    });
    resolvedSlug = row?.slug ?? null;
    if (!resolvedSlug) return { error: "Not found" };

    await prisma.blogPost.delete({ where: { id } });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete post" };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/zh-TW/blog");
  revalidatePath(`/blog/${resolvedSlug}`);
  revalidatePath(`/zh-TW/blog/${resolvedSlug}`);
  return { success: true };
}
