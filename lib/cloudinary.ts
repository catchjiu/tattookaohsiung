/**
 * Cloudinary — simple image uploads, no buckets or IAM.
 * Sign up at cloudinary.com, get 3 env vars, done.
 */

import { v2 as cloudinary } from "cloudinary";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export type UploadResult = { url: string } | { error: string };

export type UploadFolder =
  | "artist-avatars"
  | "portfolio"
  | "blog-images"
  | "booking-references";

function getConfig() {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) return null;
  return { cloud_name: CLOUD_NAME, api_key: API_KEY, api_secret: API_SECRET };
}

export function isCloudinaryConfigured(): boolean {
  return !!(CLOUD_NAME && API_KEY && API_SECRET);
}

export async function uploadToCloudinary(
  file: File,
  folder: UploadFolder
): Promise<UploadResult> {
  const config = getConfig();
  if (!config) {
    return { error: "Cloudinary is not configured" };
  }

  cloudinary.config(config);

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF." };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { error: "File too large. Maximum 10MB." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `tattookaohsiung/${folder}`,
      resource_type: "image",
    });

    return { url: result.secure_url };
  } catch (err) {
    console.error("[Cloudinary] Upload failed:", err);
    return {
      error: err instanceof Error ? err.message : "Upload failed",
    };
  }
}
