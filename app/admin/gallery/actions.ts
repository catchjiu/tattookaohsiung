"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createArtUpload(formData: FormData) {
  const artistId = (formData.get("artist_id") as string)?.trim() || null;
  const title = (formData.get("title") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || "Artwork";
  const imageUrl = (formData.get("image_url") as string)?.trim();
  const tagsStr = (formData.get("tags") as string) || "";
  const tags = tagsStr
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const sortOrder = parseInt((formData.get("display_order") as string) || "0", 10);

  if (!imageUrl) return { error: "Image URL is required" };
  if (!artistId) return { error: "Artist is required" };

  try {
    await prisma.portfolioImage.create({
      data: {
        artistId,
        url: imageUrl,
        altText: description,
        title,
        tags,
        sortOrder,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create artwork" };
  }
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function updateArtUpload(id: string, formData: FormData) {
  const artistId = (formData.get("artist_id") as string)?.trim() || null;
  const title = (formData.get("title") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || "Artwork";
  const imageUrl = (formData.get("image_url") as string)?.trim();
  const tagsStr = (formData.get("tags") as string) || "";
  const tags = tagsStr
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const sortOrder = parseInt((formData.get("display_order") as string) || "0", 10);

  if (!imageUrl) return { error: "Image URL is required" };
  if (!artistId) return { error: "Artist is required" };

  try {
    await prisma.portfolioImage.update({
      where: { id },
      data: {
        artistId,
        url: imageUrl,
        altText: description,
        title,
        tags,
        sortOrder,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update artwork" };
  }
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
  return { success: true };
}

export async function deleteArtUpload(id: string) {
  try {
    await prisma.portfolioImage.delete({ where: { id } });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete artwork" };
  }
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
  return { success: true };
}
