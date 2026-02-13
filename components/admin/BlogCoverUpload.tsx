"use client";

import { useState, useCallback, useRef } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { uploadBlogImage } from "@/app/admin/blog/upload-actions";
import { Upload, X } from "lucide-react";

const ASPECT = 3 / 2; // 3:2 landscape for blog cover
const OUTPUT_WIDTH = 900;
const OUTPUT_HEIGHT = 600; // 900x600 for 3:2

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
  value: string | null;
  onChange: (url: string | null) => void;
};

export function BlogCoverUpload({ value, onChange }: Props) {
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
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    e.target.value = "";
    setError(null);
    setFile(URL.createObjectURL(f));
  }

  function handleCancelCrop() {
    if (file) URL.revokeObjectURL(file);
    setFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
  }

  async function handleConfirmCrop() {
    if (!file || !croppedArea) return;
    setUploading(true);
    setError(null);
    try {
      const blob = await getCroppedImg(file, croppedArea);
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
        <div className="relative h-48 w-full overflow-hidden rounded-md border border-[var(--border)] bg-[#0d0d0d]">
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
          Crop to 3:2 landscape — blog cover image
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
            disabled={uploading}
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
        3:2 landscape crop — blog cover
      </p>
      {error && (
        <p className="mt-2 text-sm text-[var(--accent-crimson)]">{error}</p>
      )}
      <input type="hidden" name="cover_image_url" value={value ?? ""} />
    </div>
  );
}
