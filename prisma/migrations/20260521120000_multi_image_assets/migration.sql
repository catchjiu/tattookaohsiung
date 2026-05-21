-- CreateTable
CREATE TABLE "shop_product_images" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "shop_product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_image_assets" (
    "id" TEXT NOT NULL,
    "portfolio_image_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "portfolio_image_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "shop_product_images_product_id_idx" ON "shop_product_images"("product_id");

-- CreateIndex
CREATE INDEX "portfolio_image_assets_portfolio_image_id_idx" ON "portfolio_image_assets"("portfolio_image_id");

-- AddForeignKey
ALTER TABLE "shop_product_images" ADD CONSTRAINT "shop_product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "shop_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_image_assets" ADD CONSTRAINT "portfolio_image_assets_portfolio_image_id_fkey" FOREIGN KEY ("portfolio_image_id") REFERENCES "portfolio_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill existing single images
INSERT INTO "shop_product_images" ("id", "product_id", "url", "sort_order")
SELECT 'spi_' || "id", "id", "image_url", 0
FROM "shop_products"
WHERE "image_url" IS NOT NULL AND "image_url" <> '';

INSERT INTO "portfolio_image_assets" ("id", "portfolio_image_id", "url", "sort_order")
SELECT 'pia_' || "id", "id", "url", 0
FROM "portfolio_images"
WHERE "url" IS NOT NULL AND "url" <> '';
