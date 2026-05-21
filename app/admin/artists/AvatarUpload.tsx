"use client";

import { useState, useCallback } from "react";
import type { Area } from "react-easy-crop";
import { uploadArtistAvatar } from "./upload-actions";
import { Upload, X } from "lucide-react";
import { ImageCropStage } from "@/components/admin/ImageCropStage";
import { getCroppedImageBlob } from "@/lib/image-crop-canvas";

const ASPECT = 3 / 4; // Homepage artist card ratio
const OUTPUT_WIDTH = 600;

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export function AvatarUpload({ value, onChange }: Props) {
  const [file, setFile] = useState<string | null>(null);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCropPixels = useCallback((pixels: Area | null) => {
    setCroppedArea(pixels);
  }, []);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    setError(null);
    setCroppedArea(null);
    const url = URL.createObjectURL(f);
    setFile(url);
  }

  function handleCancelCrop() {
    if (file) URL.revokeObjectURL(file);
    setFile(null);
    setCroppedArea(null);
  }

  async function handleConfirmCrop() {
    if (!file || !croppedArea) return;
    const outputHeight = Math.round(OUTPUT_WIDTH / ASPECT);
    setUploading(true);
    setError(null);
    try {
      const blob = await getCroppedImageBlob(
        file,
        croppedArea,
        OUTPUT_WIDTH,
        outputHeight
      );
      const formData = new FormData();
      formData.append("file", blob, "avatar.jpg");
      const result = await uploadArtistAvatar(formData);
      if (result.error) throw new Error(result.error);
      if (result.url) {
        onChange(result.url);
        handleCancelCrop();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    onChange(null);
  }

  if (file) {
    return (
      <div className="space-y-4">
        <ImageCropStage
          imageSrc={file}
          aspect={ASPECT}
          showGrid
          zoomLabelClassName="text-xs text-foreground-muted"
          className="relative h-64 w-full overflow-hidden rounded-md border border-border bg-charcoal"
          caption={
            <p className="text-xs text-foreground-muted">
              3:4 portrait — drag to reposition, slider to zoom
            </p>
          }
          onCropPixelsReady={handleCropPixels}
        />
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancelCrop}
            className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground-muted transition-colors hover:bg-border hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmCrop}
            disabled={uploading || !croppedArea}
            className="rounded-md border border-accent bg-accent-muted px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-ivory disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Apply crop & upload"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative inline-block">
          <div
            className="overflow-hidden rounded-md border border-border bg-card-hover"
            style={{ aspectRatio: "3/4", width: 120 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Avatar preview"
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      ) : null}
      <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground-muted transition-colors hover:text-accent">
        <Upload size={18} strokeWidth={1.5} />
        <span>{value ? "Change photo" : "Upload photo"}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>
      <p className="text-xs text-foreground-subtle">
        3:4 portrait crop with mask & zoom — cropped to fit homepage cards
      </p>
    </div>
  );
}
