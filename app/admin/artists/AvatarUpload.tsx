"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { uploadArtistAvatar } from "./upload-actions";
import { Upload, X } from "lucide-react";

const ASPECT = 3 / 4; // Homepage artist card ratio
const OUTPUT_WIDTH = 600; // 600x800 for crisp display

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
  canvas.height = Math.round(OUTPUT_WIDTH / ASPECT);

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
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

export function AvatarUpload({ value, onChange }: Props) {
  const [file, setFile] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    setError(null);
    const url = URL.createObjectURL(f);
    setFile(url);
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
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative inline-block">
          <div
            className="overflow-hidden rounded-md border border-[var(--border)]"
            style={{ aspectRatio: "3/4", width: 120 }}
          >
            <img
              src={value}
              alt="Avatar preview"
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 rounded-full bg-[var(--accent-crimson)] p-1 text-white hover:bg-[var(--accent-crimson)]/90"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      ) : null}
      <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent-gold)]">
        <Upload size={18} strokeWidth={1.5} />
        <span>{value ? "Change photo" : "Upload photo"}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>
      <p className="text-xs text-[var(--muted-foreground)]">
        3:4 portrait ratio, cropped to fit homepage cards
      </p>
    </div>
  );
}
