"use client";

import { useState, useCallback, useRef } from "react";
import type { Area } from "react-easy-crop";
import { Upload, X } from "lucide-react";
import { uploadPortfolioImage } from "@/app/admin/gallery/upload-actions";
import { ImageCropStage } from "@/components/admin/ImageCropStage";
import { getCroppedImageBlob } from "@/lib/image-crop-canvas";

const ASPECT = 2 / 3;
const OUTPUT_WIDTH = 600;
const OUTPUT_HEIGHT = 900;

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export function GalleryImageUpload({ value, onChange }: Props) {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [file, setFile] = useState<string | null>(null);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCropPixels = useCallback((pixels: Area | null) => {
    setCroppedArea(pixels);
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []).filter((f) =>
      f.type.startsWith("image/")
    );
    e.target.value = "";
    if (selected.length === 0) return;
    setError(null);
    setPendingFiles((prev) => [...prev, ...selected]);
    if (!file) {
      startCropForFile(selected[0]);
    }
  }

  function startCropForFile(f: File) {
    setFile(URL.createObjectURL(f));
    setCroppedArea(null);
  }

  function handleCancelCrop() {
    if (file) URL.revokeObjectURL(file);
    setFile(null);
    setCroppedArea(null);
    setPendingFiles([]);
  }

  function skipCurrentFile() {
    if (file) URL.revokeObjectURL(file);
    setFile(null);
    setPendingFiles((prev) => {
      const next = prev.slice(1);
      if (next.length > 0) startCropForFile(next[0]);
      return next;
    });
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
      formData.set("file", new File([blob], "cropped.jpg", { type: "image/jpeg" }));

      const result = await uploadPortfolioImage(formData);
      if (result.error) throw new Error(result.error);
      if (result.url) {
        onChange([...value, result.url]);
      }

      if (file) URL.revokeObjectURL(file);
      setFile(null);
      setPendingFiles((prev) => {
        const next = prev.slice(1);
        if (next.length > 0) startCropForFile(next[0]);
        return next;
      });
      setCroppedArea(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  if (file) {
    const queueLabel =
      pendingFiles.length > 1
        ? ` (${pendingFiles.length} in queue)`
        : "";

    return (
      <div className="space-y-4">
        <ImageCropStage
          imageSrc={file}
          aspect={ASPECT}
          showGrid
          onCropPixelsReady={handleCropPixels}
          caption={
            <p className="text-xs text-[var(--muted)]">
              Crop to 2:3 portrait — drag to reposition, slider to zoom. Matches gallery display
              {queueLabel}
            </p>
          }
        />
        {error && (
          <p className="text-sm text-[var(--accent-crimson)]">{error}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCancelCrop}
            className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]"
          >
            Cancel all
          </button>
          {pendingFiles.length > 1 ? (
            <button
              type="button"
              onClick={skipCurrentFile}
              className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--border)]"
            >
              Skip this photo
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleConfirmCrop}
            disabled={uploading || !croppedArea}
            className="rounded-md bg-[var(--accent-gold)] px-3 py-1.5 text-sm font-medium text-[#121212] hover:bg-[#d4af37] disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Apply crop & upload"}
          </button>
        </div>
        <input type="hidden" name="image_url" value={value[0] ?? ""} />
        <input type="hidden" name="images_json" value={JSON.stringify(value)} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-start gap-4">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[120px] min-w-[120px] flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-[var(--border)] bg-[#0d0d0d] px-4 py-3 text-sm text-[var(--muted)] transition hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)]"
        >
          <Upload size={24} strokeWidth={1.5} />
          Add photos
        </button>

        {value.map((url, i) => (
          <div key={`${url}-${i}`} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Preview ${i + 1}`}
              className="h-24 w-16 rounded-md object-cover"
            />
            {i === 0 ? (
              <span className="absolute -bottom-1 left-1 rounded bg-[var(--accent-gold)] px-1 text-[9px] font-medium text-[#121212]">
                Cover
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute -right-2 -top-2 rounded-full bg-[var(--accent-crimson)] p-1 text-white hover:bg-red-700"
              aria-label={`Remove image ${i + 1}`}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        2:3 portrait crop with mask & zoom — select multiple files. First image is the cover;
        swipe gallery in lightbox.
      </p>
      {error && (
        <p className="mt-2 text-sm text-[var(--accent-crimson)]">{error}</p>
      )}
      <input type="hidden" name="image_url" value={value[0] ?? ""} />
      <input type="hidden" name="images_json" value={JSON.stringify(value)} />
    </div>
  );
}
