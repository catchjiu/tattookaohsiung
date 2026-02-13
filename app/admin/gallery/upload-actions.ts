"use server";

import { headers } from "next/headers";
import { uploadToGCP, isGCPConfigured } from "@/lib/gcp-storage";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";

const UPLOAD_LIMIT = 20; // admin can upload more

export async function uploadPortfolioImage(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file?.type?.startsWith("image/")) {
    return { error: "Invalid file type." };
  }

  const headersList = await headers();
  const clientId = getClientIdentifier(headersList);
  const limit = rateLimit(clientId, "portfolio-upload", UPLOAD_LIMIT);
  if (!limit.success) {
    return {
      error: `Too many uploads. Try again in ${limit.retryAfter} seconds.`,
    };
  }

  if (!isGCPConfigured()) {
    return { error: "GCP Storage is not configured. Add GCP_* env vars." };
  }
  const result = await uploadToGCP(file, "portfolio");
  if ("error" in result) return { error: result.error };
  return { url: result.url };
}
