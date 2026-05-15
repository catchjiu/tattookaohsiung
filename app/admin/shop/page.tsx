import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductList } from "./ProductList";
import { coerceSizeOptions } from "@/lib/shop-size-options";

export default async function AdminShopPage() {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  const rows = await prisma.shopProduct.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      sizeStockRows: { select: { size: true, quantity: true } },
    },
  });

  const products = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    name_zh: p.nameZh,
    description: p.description,
    description_zh: p.descriptionZh,
    price_label: p.priceLabel,
    price_twd: p.priceTwd,
    size_options: coerceSizeOptions(p.sizeOptions as unknown),
    size_stocks: p.sizeStockRows.map((r) => ({
      size: r.size,
      quantity: r.quantity,
    })),
    stock_quantity: p.stockQuantity,
    image_url: p.imageUrl,
    sort_order: p.sortOrder,
    is_published: p.isPublished,
    created_at: p.createdAt.toISOString(),
    updated_at: p.updatedAt.toISOString(),
  }));

  return (
    <div className="p-4 pb-8 sm:p-6 md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Shop
          </h1>
          <p className="mt-2 text-foreground-muted">
            Manage products, prices (TWD for cart totals), and the public shop.
            View orders in{" "}
            <a
              href="/admin/shop/orders"
              className="font-medium text-accent hover:underline"
            >
              Shop orders
            </a>
            .
          </p>
        </div>
        <a
          href="/admin/shop/orders"
          className="shrink-0 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground-muted transition-colors hover:border-accent hover:text-accent"
        >
          Shop orders →
        </a>
      </div>
      <div className="mt-8">
        <ProductList products={products} />
      </div>
    </div>
  );
}
