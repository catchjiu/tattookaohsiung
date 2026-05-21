"use client";

import { useState, useRef } from "react";
import { uploadShopProductImage } from "@/app/admin/shop/upload-actions";
import { Upload, X } from "lucide-react";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export function ShopProductImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter((f) =>
      f.type.startsWith("image/")
    );
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const f of files) {
        const formData = new FormData();
        formData.append("file", f);
        const result = await uploadShopProductImage(formData);
        if (result.error) throw new Error(result.error);
        if (result.url) uploaded.push(result.url);
      }
      if (uploaded.length > 0) onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
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
          onChange={handleFiles}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex min-h-[72px] min-w-[120px] flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-[var(--border)] bg-[#0d0d0d] px-4 py-3 text-sm text-[var(--muted)] transition hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] disabled:opacity-50"
        >
          <Upload size={22} strokeWidth={1.5} />
          {uploading ? "Uploading…" : "Add photos"}
        </button>

        {value.map((url, i) => (
          <div key={`${url}-${i}`} className="relative">
            <img
              src={url}
              alt={`Product ${i + 1}`}
              className="h-20 w-20 rounded-md object-cover"
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
        JPEG, PNG, WebP, or GIF. Select multiple files — first image is the
        cover. Swipe gallery on product page.
      </p>
      {error && (
        <p className="mt-2 text-sm text-[var(--accent-crimson)]">{error}</p>
      )}
      <input type="hidden" name="image_url" value={value[0] ?? ""} />
      <input type="hidden" name="images_json" value={JSON.stringify(value)} />
    </div>
  );
}
