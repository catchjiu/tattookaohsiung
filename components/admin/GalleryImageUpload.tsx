"use client";

import { useState, useCallback, useRef } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Upload, X } from "lucide-react";
import { uploadPortfolioImage } from "@/app/admin/gallery/upload-actions";

const ASPECT = 2 / 3;
const OUTPUT_WIDTH = 600;
const OUTPUT_HEIGHT = 900;

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");

  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    OUTPUT_WIDTH,
    OUTPUT_HEIGHT
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))),
      "image/jpeg",
      0.9
    );
  });
}

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export function GalleryImageUpload({ value, onChange }: Props) {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [file, setFile] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
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
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
  }

  function handleCancelCrop() {
    if (file) URL.revokeObjectURL(file);
    setFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
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
  }

  async function handleConfirmCrop() {
    if (!file || !croppedArea) return;
    setUploading(true);
    setError(null);
    try {
      const blob = await getCroppedImg(file, croppedArea);
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
        <div className="relative h-64 w-full overflow-hidden rounded-md border border-[var(--border)] bg-[#0d0d0d]">
          <Cropper
            image={file}
            crop={crop}
            zoom={zoom}
            aspect={ASPECT}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            objectFit="contain"
            style={{ containerStyle: { backgroundColor: "#0d0d0d" } }}
          />
        </div>
        <p className="text-xs text-[var(--muted)]">
          Crop to 2:3 portrait — matches gallery display{queueLabel}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-[var(--muted)]">Zoom</span>
        </div>
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
            disabled={uploading}
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
        2:3 portrait crop — select multiple files. First image is the cover;
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
