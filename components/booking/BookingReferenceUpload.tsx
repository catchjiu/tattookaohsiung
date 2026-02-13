"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { uploadBookingReference } from "@/app/contact/actions";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export function BookingReferenceUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    e.target.value = "";
    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadBookingReference(formData);

    setUploading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.url) onChange(result.url);
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
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex min-h-[80px] min-w-[120px] flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-border bg-card px-4 py-3 text-sm text-foreground-muted transition hover:border-accent hover:text-accent disabled:opacity-50"
        >
          <Upload size={24} strokeWidth={1.5} />
          {uploading ? "Uploading…" : "Upload photo"}
        </button>
        {value && (
          <div className="relative">
            <img
              src={value}
              alt="Reference preview"
              className="max-h-24 max-w-32 rounded-md object-contain"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute -right-2 -top-2 rounded-full bg-[var(--accent-crimson)] p-1 text-white hover:opacity-90"
              aria-label="Remove"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-foreground-muted">
        Optional. Any image ratio is fine.
      </p>
      {error && (
        <p className="mt-2 text-sm text-[var(--accent-crimson)]">{error}</p>
      )}
    </div>
  );
}
