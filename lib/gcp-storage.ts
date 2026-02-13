/**
 * Google Cloud Storage — secure file uploads for portfolio & booking references.
 * Uses service account credentials from env.
 */

import { Storage } from "@google-cloud/storage";

const BUCKET = process.env.GCP_STORAGE_BUCKET;
const PROJECT_ID = process.env.GCP_PROJECT_ID;
const CLIENT_EMAIL = process.env.GCP_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n");

function getStorage(): Storage | null {
  if (!BUCKET || !CLIENT_EMAIL || !PRIVATE_KEY) return null;
  return new Storage({
    projectId: PROJECT_ID || undefined,
    credentials: {
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    },
  });
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export type UploadResult =
  | { url: string }
  | { error: string };

/**
 * Upload a file to GCP Storage. Returns public URL or error.
 */
export type GCPFolder =
  | "booking-references"
  | "portfolio"
  | "artist-avatars"
  | "blog-images";

export async function uploadToGCP(
  file: File,
  folder: GCPFolder
): Promise<UploadResult> {
  const storage = getStorage();
  if (!storage) {
    return { error: "GCP Storage not configured" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF." };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { error: "File too large. Maximum 10MB." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)
    ? ext
    : "jpg";
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${safeExt}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = storage.bucket(BUCKET!);
    const blob = bucket.file(path);

    await blob.save(buffer, {
      contentType: file.type,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    await blob.makePublic();
    const url = `https://storage.googleapis.com/${BUCKET}/${path}`;
    return { url };
  } catch (err) {
    console.error("[GCP Storage] Upload failed:", err);
    return {
      error: err instanceof Error ? err.message : "Upload failed",
    };
  }
}

export function isGCPConfigured(): boolean {
  return !!(BUCKET && CLIENT_EMAIL && PRIVATE_KEY);
}
