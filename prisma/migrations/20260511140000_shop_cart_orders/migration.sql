-- Price in whole TWD for checkout totals (optional; null = contact for price)
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "price_twd" INTEGER;

-- CreateEnum
CREATE TYPE "ShopOrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PAID', 'SHIPPED', 'CANCELLED');

-- CreateTable
CREATE TABLE "shop_orders" (
    "id" TEXT NOT NULL,
    "status" "ShopOrderStatus" NOT NULL DEFAULT 'PENDING',
    "customer_name" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_phone" TEXT,
    "shipping_address" TEXT,
    "notes" TEXT,
    "total_twd" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'TWD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop_order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_slug" TEXT NOT NULL,
    "name_snapshot" TEXT NOT NULL,
    "price_label_snapshot" TEXT,
    "unit_price_twd" INTEGER,
    "quantity" INTEGER NOT NULL,
    "line_total_twd" INTEGER,

    CONSTRAINT "shop_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shop_orders_status_created_at_idx" ON "shop_orders"("status", "created_at");

-- CreateIndex
CREATE INDEX "shop_order_items_order_id_idx" ON "shop_order_items"("order_id");

-- AddForeignKey
ALTER TABLE "shop_order_items" ADD CONSTRAINT "shop_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "shop_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "shop_order_items" ADD CONSTRAINT "shop_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "shop_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
