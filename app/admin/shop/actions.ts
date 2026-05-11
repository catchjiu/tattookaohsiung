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

function parseOptionalPriceTwd(raw: string | null | undefined): number | null {
  const s = raw?.trim();
  if (!s) return null;
  const n = Number.parseInt(s, 10);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export async function createShopProduct(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const slug =
    ((formData.get("slug") as string)?.trim() || slugify(name || "")) ||
    slugify(name || "");
  const nameZh = (formData.get("name_zh") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || "";
  const descriptionZh =
    (formData.get("description_zh") as string)?.trim() || null;
  const priceLabel = (formData.get("price_label") as string)?.trim() || null;
  const priceTwd = parseOptionalPriceTwd(
    formData.get("price_twd") as string | null
  );
  const imageUrl = (formData.get("image_url") as string)?.trim() || null;
  const sortOrderRaw = (formData.get("sort_order") as string)?.trim() ?? "0";
  const sortOrder = Number.parseInt(sortOrderRaw, 10);
  const isPublished = formData.get("is_published") === "on";

  if (!name) return { error: "Name is required" };
  if (!description) return { error: "Description (English) is required" };

  const resolvedSlug = slug || slugify(name);

  try {
    await prisma.shopProduct.create({
      data: {
        name,
        nameZh,
        slug: resolvedSlug,
        description,
        descriptionZh,
        priceLabel,
        priceTwd,
        imageUrl,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
        isPublished,
      },
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create product",
    };
  }

  revalidatePath("/admin/shop");
  revalidatePath("/admin/shop/orders");
  revalidatePath("/shop");
  revalidatePath("/zh-TW/shop");
  revalidatePath(`/shop/${resolvedSlug}`);
  revalidatePath(`/zh-TW/shop/${resolvedSlug}`);
  return { success: true };
}

export async function updateShopProduct(id: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const nameZh = (formData.get("name_zh") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || "";
  const descriptionZh =
    (formData.get("description_zh") as string)?.trim() || null;
  const priceLabel = (formData.get("price_label") as string)?.trim() || null;
  const priceTwd = parseOptionalPriceTwd(
    formData.get("price_twd") as string | null
  );
  const imageUrl = (formData.get("image_url") as string)?.trim() || null;
  const sortOrderRaw = (formData.get("sort_order") as string)?.trim() ?? "0";
  const sortOrder = Number.parseInt(sortOrderRaw, 10);
  const isPublished = formData.get("is_published") === "on";

  if (!name || !slug) return { error: "Name and slug are required" };
  if (!description) return { error: "Description (English) is required" };

  const existing = await prisma.shopProduct.findUnique({
    where: { id },
    select: { slug: true },
  });
  const oldSlug = existing?.slug;

  try {
    await prisma.shopProduct.update({
      where: { id },
      data: {
        name,
        nameZh,
        slug,
        description,
        descriptionZh,
        priceLabel,
        priceTwd,
        imageUrl,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
        isPublished,
      },
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update product",
    };
  }

  revalidatePath("/admin/shop");
  revalidatePath("/admin/shop/orders");
  revalidatePath("/shop");
  revalidatePath("/zh-TW/shop");
  revalidatePath(`/shop/${slug}`);
  revalidatePath(`/zh-TW/shop/${slug}`);
  if (oldSlug && oldSlug !== slug) {
    revalidatePath(`/shop/${oldSlug}`);
    revalidatePath(`/zh-TW/shop/${oldSlug}`);
  }
  return { success: true };
}

export async function deleteShopProduct(id: string) {
  let resolvedSlug: string | null = null;
  try {
    const row = await prisma.shopProduct.findUnique({
      where: { id },
      select: { slug: true },
    });
    resolvedSlug = row?.slug ?? null;
    if (!resolvedSlug) return { error: "Not found" };

    await prisma.shopProduct.delete({ where: { id } });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to delete product",
    };
  }

  revalidatePath("/admin/shop");
  revalidatePath("/admin/shop/orders");
  revalidatePath("/shop");
  revalidatePath("/zh-TW/shop");
  revalidatePath(`/shop/${resolvedSlug}`);
  revalidatePath(`/zh-TW/shop/${resolvedSlug}`);
  return { success: true };
}
