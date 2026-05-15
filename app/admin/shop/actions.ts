"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { parseSizeOptionsText } from "@/lib/shop-size-options";

function parseSizeStocksPayload(
  raw: string | null | undefined,
  allowed: Set<string>
): Record<string, number> {
  if (!raw?.trim()) return {};
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (!allowed.has(k)) continue;
    const n =
      typeof v === "number" && Number.isFinite(v)
        ? Math.floor(v)
        : Number.parseInt(String(v), 10);
    if (!Number.isFinite(n) || n < 0) continue;
    out[k] = n;
  }
  return out;
}

async function replaceSizeStocks(
  tx: Prisma.TransactionClient,
  productId: string,
  stocks: Record<string, number>
) {
  await tx.shopProductSizeStock.deleteMany({ where: { productId } });
  const entries = Object.entries(stocks);
  if (!entries.length) return;
  await tx.shopProductSizeStock.createMany({
    data: entries.map(([size, quantity]) => ({
      productId,
      size,
      quantity,
    })),
  });
}

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

function parseOptionalStockQuantity(raw: string | null | undefined): number | null {
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
  const sizeOptions = parseSizeOptionsText(
    (formData.get("size_options") as string)?.trim() ?? ""
  );
  const stockQuantitySingle = parseOptionalStockQuantity(
    formData.get("stock_quantity") as string | null
  );
  const allowedSizes = new Set(sizeOptions);
  const sizeStockPayload = parseSizeStocksPayload(
    formData.get("size_stocks_json") as string | null,
    allowedSizes
  );
  const stockQuantityResolved =
    sizeOptions.length > 0 ? null : stockQuantitySingle;

  if (!name) return { error: "Name is required" };
  if (!description) return { error: "Description (English) is required" };

  const resolvedSlug = slug || slugify(name);

  try {
    await prisma.$transaction(async (tx) => {
      const p = await tx.shopProduct.create({
        data: {
          name,
          nameZh,
          slug: resolvedSlug,
          description,
          descriptionZh,
          priceLabel,
          priceTwd,
          sizeOptions,
          stockQuantity: stockQuantityResolved,
          imageUrl,
          sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
          isPublished,
        },
      });
      await replaceSizeStocks(tx, p.id, sizeStockPayload);
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
  const sizeOptions = parseSizeOptionsText(
    (formData.get("size_options") as string)?.trim() ?? ""
  );
  const stockQuantitySingle = parseOptionalStockQuantity(
    formData.get("stock_quantity") as string | null
  );
  const allowedSizes = new Set(sizeOptions);
  const sizeStockPayload = parseSizeStocksPayload(
    formData.get("size_stocks_json") as string | null,
    allowedSizes
  );
  const stockQuantityResolved =
    sizeOptions.length > 0 ? null : stockQuantitySingle;

  if (!name || !slug) return { error: "Name and slug are required" };
  if (!description) return { error: "Description (English) is required" };

  const existing = await prisma.shopProduct.findUnique({
    where: { id },
    select: { slug: true },
  });
  const oldSlug = existing?.slug;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.shopProduct.update({
        where: { id },
        data: {
          name,
          nameZh,
          slug,
          description,
          descriptionZh,
          priceLabel,
          priceTwd,
          sizeOptions,
          stockQuantity: stockQuantityResolved,
          imageUrl,
          sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
          isPublished,
        },
      });
      if (sizeOptions.length > 0) {
        await replaceSizeStocks(tx, id, sizeStockPayload);
      } else {
        await tx.shopProductSizeStock.deleteMany({ where: { productId: id } });
      }
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
