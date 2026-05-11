"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { ShopProduct } from "@/types/database";
import { createShopProduct, updateShopProduct } from "./actions";
import { ShopProductImageUpload } from "@/components/admin/ShopProductImageUpload";

type Props = {
  product?: ShopProduct | null;
  onClose: () => void;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function ProductForm({ product, onClose }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const isEditing = !!product;

  useEffect(() => {
    setImageUrl(product?.image_url ?? "");
  }, [product?.image_url]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = isEditing
      ? await updateShopProduct(product.id, formData)
      : await createShopProduct(formData);

    if (result?.error) {
      setError(result.error);
      return;
    }
    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-xl max-h-[90dvh] sm:max-h-[85vh] flex-col rounded-t-xl sm:rounded-md border border-border border-b-0 sm:border-b bg-card shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4 sm:px-6">
          <h2 className="font-display text-lg font-semibold sm:text-xl">
            {isEditing ? "Edit product" : "New product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 rounded-full p-2.5 text-foreground-muted transition-colors hover:bg-border hover:text-foreground touch-manipulation"
            aria-label="Close"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-4">
            <div className="space-y-4">
              {error && (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  Name (English) *
                </label>
                <input
                  name="name"
                  required
                  defaultValue={product?.name}
                  onChange={(e) => {
                    const slugInput = e.target.form?.querySelector(
                      '[name="slug"]'
                    ) as HTMLInputElement;
                    if (slugInput && !product) slugInput.value = slugify(e.target.value);
                  }}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  Name (中文)
                </label>
                <input
                  name="name_zh"
                  defaultValue={product?.name_zh ?? ""}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  URL slug *
                </label>
                <input
                  name="slug"
                  required
                  defaultValue={product?.slug}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  Description (English) *
                </label>
                <textarea
                  name="description"
                  required
                  rows={5}
                  defaultValue={product?.description}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  Description (中文)
                </label>
                <textarea
                  name="description_zh"
                  rows={5}
                  defaultValue={product?.description_zh ?? ""}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  Price (TWD, optional)
                </label>
                <input
                  name="price_twd"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="e.g. 1200"
                  defaultValue={
                    product?.price_twd != null ? String(product.price_twd) : ""
                  }
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                />
                <p className="mt-1 text-xs text-foreground-muted">
                  Whole TWD amount for cart totals. Leave empty for &quot;quote
                  on request&quot; items.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  Price label (display only)
                </label>
                <input
                  name="price_label"
                  placeholder="e.g. NT$ 1,200"
                  defaultValue={product?.price_label ?? ""}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground-muted">
                  Sort order
                </label>
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={product?.sort_order ?? 0}
                  className="mt-1 w-28 rounded-md border border-border bg-background px-3 py-2 text-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground-muted">
                  Product image
                </label>
                <div className="mt-2">
                  <ShopProductImageUpload
                    value={imageUrl || null}
                    onChange={(u) => setImageUrl(u ?? "")}
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground-muted">
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={product?.is_published ?? false}
                  className="rounded border-border"
                />
                Published (visible on shop page)
              </label>
            </div>
          </div>

          <div className="flex shrink-0 gap-3 border-t border-border px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-border px-4 py-3 text-sm font-medium text-foreground-muted transition-colors hover:bg-border hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-charcoal transition-colors hover:opacity-90"
            >
              {isEditing ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
