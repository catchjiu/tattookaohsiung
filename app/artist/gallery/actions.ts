"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseImagesJson, primaryImageUrl } from "@/lib/parse-images-json";

async function getArtistId(): Promise<{ artistId: string } | { error: string }> {
  const session = await getSession();
  if (!session || session.role !== "ARTIST" || !session.artistId) {
    return { error: "Unauthorized" };
  }
  return { artistId: session.artistId };
}

async function assertPortfolioOwnership(
  imageId: string,
  artistId: string
): Promise<{ error: string } | null> {
  const image = await prisma.portfolioImage.findUnique({
    where: { id: imageId },
    select: { artistId: true },
  });
  if (!image || image.artistId !== artistId) {
    return { error: "Artwork not found" };
  }
  return null;
}

async function replacePortfolioAssets(portfolioImageId: string, urls: string[]) {
  await prisma.portfolioImageAsset.deleteMany({
    where: { portfolioImageId },
  });
  if (!urls.length) return;
  await prisma.portfolioImageAsset.createMany({
    data: urls.map((url, sortOrder) => ({
      portfolioImageId,
      url,
      sortOrder,
    })),
  });
}

function parseTagList(formData: FormData, key: string): string[] {
  const raw = (formData.get(key) as string) || "";
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function revalidateGalleryPaths() {
  revalidatePath("/artist/gallery");
  revalidatePath("/gallery");
  revalidatePath("/zh-TW/gallery");
  revalidatePath("/");
  revalidatePath("/zh-TW");
  revalidatePath("/artists", "layout");
  revalidatePath("/zh-TW/artists", "layout");
}

export async function createArtUpload(formData: FormData) {
  const auth = await getArtistId();
  if ("error" in auth) return { error: auth.error };

  const title = (formData.get("title") as string)?.trim() || null;
  const titleZh = (formData.get("title_zh") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || "Artwork";
  const descriptionZh = (formData.get("description_zh") as string)?.trim() || null;
  const imageUrlRaw = (formData.get("image_url") as string)?.trim();
  const imageUrls = parseImagesJson(formData.get("images_json") as string);
  const imageUrl = primaryImageUrl(imageUrls, imageUrlRaw);
  const tags = parseTagList(formData, "tags");
  const tagsZh = parseTagList(formData, "tags_zh");
  const sortOrder = parseInt((formData.get("display_order") as string) || "0", 10);

  if (!imageUrl) return { error: "Image URL is required" };

  try {
    const created = await prisma.portfolioImage.create({
      data: {
        artistId: auth.artistId,
        url: imageUrl,
        altText: description,
        title,
        titleZh,
        altTextZh: descriptionZh,
        tags,
        tagsZh,
        sortOrder,
        showInHeroSlider: false,
      },
    });
    await replacePortfolioAssets(created.id, imageUrls.length ? imageUrls : [imageUrl]);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create artwork" };
  }
  revalidateGalleryPaths();
  return { success: true };
}

export async function updateArtUpload(id: string, formData: FormData) {
  const auth = await getArtistId();
  if ("error" in auth) return { error: auth.error };

  const ownership = await assertPortfolioOwnership(id, auth.artistId);
  if (ownership) return ownership;

  const title = (formData.get("title") as string)?.trim() || null;
  const titleZh = (formData.get("title_zh") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || "Artwork";
  const descriptionZh = (formData.get("description_zh") as string)?.trim() || null;
  const imageUrlRaw = (formData.get("image_url") as string)?.trim();
  const imageUrls = parseImagesJson(formData.get("images_json") as string);
  const imageUrl = primaryImageUrl(imageUrls, imageUrlRaw);
  const tags = parseTagList(formData, "tags");
  const tagsZh = parseTagList(formData, "tags_zh");
  const sortOrder = parseInt((formData.get("display_order") as string) || "0", 10);

  if (!imageUrl) return { error: "Image URL is required" };

  try {
    await prisma.portfolioImage.update({
      where: { id },
      data: {
        url: imageUrl,
        altText: description,
        title,
        titleZh,
        altTextZh: descriptionZh,
        tags,
        tagsZh,
        sortOrder,
      },
    });
    await replacePortfolioAssets(id, imageUrls.length ? imageUrls : [imageUrl]);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update artwork" };
  }
  revalidateGalleryPaths();
  return { success: true };
}

export async function deleteArtUpload(id: string) {
  const auth = await getArtistId();
  if ("error" in auth) return { error: auth.error };

  const ownership = await assertPortfolioOwnership(id, auth.artistId);
  if (ownership) return ownership;

  try {
    await prisma.portfolioImage.delete({ where: { id } });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete artwork" };
  }
  revalidateGalleryPaths();
  return { success: true };
}
