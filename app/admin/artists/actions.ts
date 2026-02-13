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

export async function createArtist(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const slug = ((formData.get("slug") as string) || slugify(name || "")).trim() || slugify(name || "");
  const bio = (formData.get("bio") as string)?.trim() || null;
  const specialty = (formData.get("specialty") as string)?.trim() || null;
  const igHandle = (formData.get("ig_handle") as string)?.trim()?.replace(/^@/, "") || null;
  const avatarUrl = (formData.get("avatar_url") as string)?.trim() || null;
  const sortOrder = parseInt((formData.get("display_order") as string) || "0", 10);
  const isActive = formData.get("is_active") === "on";

  if (!name) return { error: "Name is required" };

  const instagramUrl = igHandle ? `https://instagram.com/${igHandle}` : null;
  const status = isActive ? "AVAILABLE" : "INACTIVE";

  try {
    await prisma.artist.create({
      data: {
        name,
        slug: slug || slugify(name),
        bio,
        specialty,
        instagramUrl,
        avatarUrl,
        sortOrder,
        status,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create artist" };
  }
  revalidatePath("/admin/artists");
  revalidatePath("/artists");
  revalidatePath("/");
  return { success: true };
}

export async function updateArtist(id: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim() || null;
  const specialty = (formData.get("specialty") as string)?.trim() || null;
  const igHandle = (formData.get("ig_handle") as string)?.trim()?.replace(/^@/, "") || null;
  const avatarUrl = (formData.get("avatar_url") as string)?.trim() || null;
  const sortOrder = parseInt((formData.get("display_order") as string) || "0", 10);
  const isActive = formData.get("is_active") === "on";

  if (!name || !slug) return { error: "Name and slug are required" };

  const instagramUrl = igHandle ? `https://instagram.com/${igHandle}` : null;
  const status = isActive ? "AVAILABLE" : "INACTIVE";

  try {
    await prisma.artist.update({
      where: { id },
      data: {
        name,
        slug,
        bio,
        specialty,
        instagramUrl,
        avatarUrl,
        sortOrder,
        status,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update artist" };
  }
  revalidatePath("/admin/artists");
  revalidatePath("/artists");
  revalidatePath("/");
  return { success: true };
}

export async function deleteArtist(id: string) {
  try {
    await prisma.artist.delete({ where: { id } });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete artist" };
  }
  revalidatePath("/admin/artists");
  revalidatePath("/artists");
  revalidatePath("/");
  return { success: true };
}
