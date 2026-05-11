/**
 * Unified upload — Cloudinary (easy) or GCP Storage.
 * Cloudinary is preferred when configured; no buckets or IAM needed.
 */

import {
  uploadToCloudinary,
  isCloudinaryConfigured,
  type UploadFolder as CloudinaryFolder,
} from "./cloudinary";
import {
  uploadToGCP,
  isGCPConfigured,
  type GCPFolder,
} from "./gcp-storage";

export type UploadResult = { url: string } | { error: string };

const FOLDER_MAP: Record<CloudinaryFolder, GCPFolder> = {
  "artist-avatars": "artist-avatars",
  portfolio: "portfolio",
  "blog-images": "blog-images",
  "booking-references": "booking-references",
  "shop-products": "shop-products",
};

export function isUploadConfigured(): boolean {
  return isCloudinaryConfigured() || isGCPConfigured();
}

export async function uploadFile(
  file: File,
  folder: CloudinaryFolder
): Promise<UploadResult> {
  if (isCloudinaryConfigured()) {
    return uploadToCloudinary(file, folder);
  }

  if (isGCPConfigured()) {
    return uploadToGCP(file, FOLDER_MAP[folder]);
  }

  return {
    error:
      "No storage configured. Add Cloudinary (CLOUDINARY_*) or GCP (GCP_STORAGE_BUCKET + credentials).",
  };
}
