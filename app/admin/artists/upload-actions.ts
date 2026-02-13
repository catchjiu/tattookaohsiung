"use server";

import { headers } from "next/headers";
import { uploadToGCP, isGCPConfigured } from "@/lib/gcp-storage";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";

const UPLOAD_LIMIT = 10;

export async function uploadArtistAvatar(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file?.type?.startsWith("image/")) {
    return { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF." };
  }

  const headersList = await headers();
  const clientId = getClientIdentifier(headersList);
  const limit = rateLimit(clientId, "avatar-upload", UPLOAD_LIMIT);
  if (!limit.success) {
    return {
      error: `Too many uploads. Try again in ${limit.retryAfter} seconds.`,
    };
  }

  if (!isGCPConfigured()) {
    return {
      error:
        "GCP Storage is not configured. Set GCP_STORAGE_BUCKET and either: (1) GCP_CLIENT_EMAIL + GCP_PRIVATE_KEY, or (2) run `gcloud auth application-default login` for ADC.",
    };
  }
  const result = await uploadToGCP(file, "artist-avatars");
  if ("error" in result) return { error: result.error };
  return { url: result.url };
}
