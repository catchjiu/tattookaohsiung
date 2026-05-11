"use server";

import { headers } from "next/headers";
import { uploadFile, isUploadConfigured } from "@/lib/upload";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";

const UPLOAD_LIMIT = 30;

export async function uploadShopProductImage(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file?.type?.startsWith("image/")) {
    return { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF." };
  }

  const headersList = await headers();
  const clientId = getClientIdentifier(headersList);
  const limit = rateLimit(clientId, "shop-upload", UPLOAD_LIMIT);
  if (!limit.success) {
    return {
      error: `Too many uploads. Try again in ${limit.retryAfter} seconds.`,
    };
  }

  if (!isUploadConfigured()) {
    return {
      error:
        "No storage configured. Add Cloudinary (CLOUDINARY_*) — sign up free at cloudinary.com",
    };
  }
  const result = await uploadFile(file, "shop-products");
  if ("error" in result) return { error: result.error };
  return { url: result.url };
}
