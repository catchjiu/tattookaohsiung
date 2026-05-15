"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { ShopProduct } from "@/types/database";
import { deleteShopProduct } from "./actions";
import { ProductForm } from "./ProductForm";

type Props = {
  products: ShopProduct[];
};

export function ProductList({ products }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<ShopProduct | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    setDeletingId(id);
    await deleteShopProduct(id);
    setDeletingId(null);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-foreground-muted">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border-2 border-accent bg-accent-muted px-5 py-3.5 text-base font-semibold text-accent transition-colors hover:bg-accent hover:text-charcoal touch-manipulation"
        >
          <Plus size={20} strokeWidth={1.5} />
          New product
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:hidden">
        {products.length === 0 ? (
          <div className="rounded-md border border-border bg-card px-6 py-12 text-center text-foreground-muted">
            No products yet. Add one to display on the shop page.
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-3 rounded-md border-2 border-border bg-card p-4"
            >
              <div>
                <div className="font-display font-semibold text-foreground">
                  {p.name}
                </div>
                <div className="text-sm text-foreground-muted">/{p.slug}</div>
                {p.price_label && (
                  <div className="mt-1 text-sm text-foreground-muted">
                    {p.price_label}
                  </div>
                )}
                {p.price_twd != null ? (
                  <div className="mt-0.5 text-xs text-foreground-muted">
                    NT$ {p.price_twd} (cart)
                  </div>
                ) : null}
                <div className="mt-1 text-xs text-foreground-muted">
                  Stock:{" "}
                  {p.stock_quantity != null ? p.stock_quantity : "∞ unlimited"}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    p.is_published
                      ? "bg-green-500/20 text-green-400"
                      : "bg-border text-foreground-muted"
                  }`}
                >
                  {p.is_published ? "Published" : "Draft"}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(p)}
                    className="flex items-center gap-2 rounded-md border-2 border-border px-4 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-border hover:text-foreground touch-manipulation"
                  >
                    <Pencil size={16} strokeWidth={1.5} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="flex items-center gap-2 rounded-md border-2 border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50 touch-manipulation"
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 hidden overflow-x-auto rounded-md border border-border md:block">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-border bg-card">
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground-muted">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground-muted">
                Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground-muted">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground-muted">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-foreground-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-foreground-muted"
                >
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border bg-card hover:bg-card-hover"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{p.name}</div>
                    <div className="text-xs text-foreground-muted">
                      /{p.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground-muted">
                    <div>{p.price_label || "—"}</div>
                    {p.price_twd != null ? (
                      <div className="mt-0.5 text-xs">NT$ {p.price_twd}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground-muted">
                    {p.stock_quantity != null ? p.stock_quantity : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        p.is_published
                          ? "bg-green-500/20 text-green-400"
                          : "bg-border text-foreground-muted"
                      }`}
                    >
                      {p.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(p)}
                        className="rounded p-2 text-foreground-muted transition-colors hover:bg-border hover:text-foreground"
                        title="Edit"
                      >
                        <Pencil size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="rounded p-2 text-foreground-muted transition-colors hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <ProductForm product={null} onClose={() => setShowCreate(false)} />
      )}
      {editing && (
        <ProductForm product={editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}
