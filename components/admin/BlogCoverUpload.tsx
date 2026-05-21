"use client";

import { useState, useCallback, useRef } from "react";
import type { Area } from "react-easy-crop";
import { uploadBlogImage } from "@/app/admin/blog/upload-actions";
import { Upload, X } from "lucide-react";
import { ImageCropStage } from "@/components/admin/ImageCropStage";
import { getCroppedImageBlob } from "@/lib/image-crop-canvas";

const ASPECT = 3 / 2; // 3:2 landscape for blog cover
const OUTPUT_WIDTH = 900;
const OUTPUT_HEIGHT = 600;

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export function BlogCoverUpload({ value, onChange }: Props) {
  const [file, setFile] = useState<string | null>(null);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCropPixels = useCallback((pixels: Area | null) => {
    setCroppedArea(pixels);
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    e.target.value = "";
    setError(null);
    setCroppedArea(null);
    setFile(URL.createObjectURL(f));
  }

  function handleCancelCrop() {
    if (file) URL.revokeObjectURL(file);
    setFile(null);
    setCroppedArea(null);
  }

  async function handleConfirmCrop() {
    if (!file || !croppedArea) return;
    setUploading(true);
    setError(null);
    try {
      const blob = await getCroppedImageBlob(
        file,
        croppedArea,
        OUTPUT_WIDTH,
        OUTPUT_HEIGHT
      );
      const formData = new FormData();
      formData.append("file", blob, "cover.jpg");
      const result = await uploadBlogImage(formData);
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

  if (file) {
    return (
      <div className="space-y-4">
        <ImageCropStage
          imageSrc={file}
          aspect={ASPECT}
          showGrid
          className="relative h-48 w-full overflow-hidden rounded-md border border-[var(--border)] bg-[#0d0d0d]"
          onCropPixelsReady={handleCropPixels}
          caption={
            <p className="text-xs text-[var(--muted)]">
              Crop to 3:2 landscape — drag to reposition, slider to zoom
            </p>
          }
        />
        {error && (
          <p className="text-sm text-[var(--accent-crimson)]">{error}</p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancelCrop}
            className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmCrop}
            disabled={uploading || !croppedArea}
            className="rounded-md bg-[var(--accent-gold)] px-3 py-1.5 text-sm font-medium text-[#121212] hover:bg-[#d4af37] disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Apply crop & upload"}
          </button>
        </div>
        <input type="hidden" name="cover_image_url" value={value ?? ""} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[80px] min-w-[120px] flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-[var(--border)] bg-[#0d0d0d] px-4 py-3 text-sm text-[var(--muted)] transition hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)]"
        >
          <Upload size={24} strokeWidth={1.5} />
          Upload cover
        </button>
        {value && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Cover preview"
              className="h-16 w-24 rounded-md object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute -right-2 -top-2 rounded-full bg-[var(--accent-crimson)] p-1 text-white hover:bg-red-700"
              aria-label="Remove"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        3:2 landscape crop with mask & zoom — blog cover
      </p>
      {error && (
        <p className="mt-2 text-sm text-[var(--accent-crimson)]">{error}</p>
      )}
      <input type="hidden" name="cover_image_url" value={value ?? ""} />
    </div>
  );
}
