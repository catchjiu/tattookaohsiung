"use client";

import { useCallback, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import { Upload, X } from "lucide-react";
import { uploadBookingReference } from "@/app/contact/actions";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ImageCropStage } from "@/components/admin/ImageCropStage";
import { getCroppedImageBlob } from "@/lib/image-crop-canvas";

const ASPECT = 4 / 3;
const OUTPUT_WIDTH = 1400;
const OUTPUT_HEIGHT = 1050;

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export function BookingReferenceUpload({ value, onChange }: Props) {
  const { t } = useLanguage();
  const [file, setFile] = useState<string | null>(null);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCropPixels = useCallback((pixels: Area | null) => {
    setCroppedArea(pixels);
  }, []);

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (!picked?.type.startsWith("image/")) return;
    e.target.value = "";
    setError(null);
    setCroppedArea(null);
    setFile(URL.createObjectURL(picked));
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
      formData.set(
        "file",
        new File([blob], "reference.jpg", { type: "image/jpeg" })
      );

      const result = await uploadBookingReference(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) {
        if (file) URL.revokeObjectURL(file);
        setFile(null);
        setCroppedArea(null);
        onChange(result.url);
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
          zoomLabelClassName="text-xs text-foreground-muted"
          className="relative min-h-[200px] h-52 w-full overflow-hidden rounded-md border border-border bg-card"
          caption={
            <p className="text-xs text-foreground-muted">
              4:3 reference — crop & zoom before upload
            </p>
          }
          onCropPixelsReady={handleCropPixels}
        />
        {error && (
          <p className="text-sm text-[var(--accent-crimson)]">{error}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCancelCrop}
            className="rounded-sm border border-border px-3 py-1.5 text-sm text-foreground-muted transition hover:bg-card-hover hover:text-foreground"
          >
            {t("booking.cancelCrop")}
          </button>
          <button
            type="button"
            onClick={handleConfirmCrop}
            disabled={uploading || !croppedArea}
            className="rounded-sm border border-accent bg-accent-muted px-3 py-1.5 text-sm font-medium text-accent transition hover:bg-accent hover:text-charcoal disabled:opacity-45"
          >
            {uploading ? t("booking.uploading") : t("booking.applyCropUpload")}
          </button>
        </div>
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
          onChange={handleFilePick}
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex min-h-[80px] min-w-[120px] flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-border bg-card px-4 py-3 text-sm text-foreground-muted transition hover:border-accent hover:text-accent disabled:opacity-50"
        >
          <Upload size={24} strokeWidth={1.5} />
          {uploading ? t("booking.uploading") : t("booking.uploadPhoto")}
        </button>
        {value && (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={t("booking.referencePreview")}
              className="max-h-24 max-w-32 rounded-md object-contain"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute -right-2 -top-2 rounded-full bg-[var(--accent-crimson)] p-1 text-white hover:opacity-90"
              aria-label={t("booking.remove")}
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-foreground-muted">
        {t("booking.optionalNote")}
      </p>
      {error && (
        <p className="mt-2 text-sm text-[var(--accent-crimson)]">{error}</p>
      )}
    </div>
  );
}
