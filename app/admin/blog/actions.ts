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
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const content = (formData.get("content") as string)?.trim() || "";
  const coverImageUrl = (formData.get("cover_image_url") as string)?.trim() || null;
  const category = (formData.get("category") as string)?.trim() || null;
  const isPublished = formData.get("is_published") === "on";

  if (!title) return { error: "Title is required" };

  try {
    await prisma.blogPost.create({
      data: {
        title,
        slug: slug || slugify(title),
        excerpt,
        content,
        coverImageUrl,
        category,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create post" };
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

export async function updateBlogPost(id: string, formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim() || null;
  const content = (formData.get("content") as string)?.trim() || "";
  const coverImageUrl = (formData.get("cover_image_url") as string)?.trim() || null;
  const category = (formData.get("category") as string)?.trim() || null;
  const isPublished = formData.get("is_published") === "on";

  if (!title || !slug) return { error: "Title and slug are required" };

  const existing = await prisma.blogPost.findUnique({
    where: { id },
    select: { publishedAt: true },
  });

  const publishedAt = isPublished
    ? (existing?.publishedAt ?? new Date())
    : null;

  try {
    await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImageUrl,
        category,
        isPublished,
        publishedAt,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update post" };
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({ where: { id } });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete post" };
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  return { success: true };
}
