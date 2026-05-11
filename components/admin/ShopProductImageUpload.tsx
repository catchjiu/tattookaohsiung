"use client";

import { useState, useRef } from "react";
import { uploadShopProductImage } from "@/app/admin/shop/upload-actions";
import { Upload, X } from "lucide-react";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
};

export function ShopProductImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f || !f.type.startsWith("image/")) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", f);
      const result = await uploadShopProductImage(formData);
      if (result.error) throw new Error(result.error);
      if (result.url) onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFile}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex min-h-[72px] min-w-[120px] flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-[var(--border)] bg-[#0d0d0d] px-4 py-3 text-sm text-[var(--muted)] transition hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] disabled:opacity-50"
        >
          <Upload size={22} strokeWidth={1.5} />
          {uploading ? "Uploading…" : "Upload image"}
        </button>
        {value && (
          <div className="relative">
            <img
              src={value}
              alt="Product"
              className="h-20 w-20 rounded-md object-cover"
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
        JPEG, PNG, WebP, or GIF. Shown on the shop page.
      </p>
      {error && (
        <p className="mt-2 text-sm text-[var(--accent-crimson)]">{error}</p>
      )}
      <input type="hidden" name="image_url" value={value ?? ""} />
    </div>
  );
}
