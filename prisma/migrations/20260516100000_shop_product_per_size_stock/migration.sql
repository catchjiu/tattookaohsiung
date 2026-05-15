-- CreateTable
CREATE TABLE "shop_product_size_stocks" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "shop_product_size_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shop_product_size_stocks_product_id_size_key" ON "shop_product_size_stocks"("product_id", "size");

-- CreateIndex
CREATE INDEX "shop_product_size_stocks_product_id_idx" ON "shop_product_size_stocks"("product_id");

-- AddForeignKey
ALTER TABLE "shop_product_size_stocks" ADD CONSTRAINT "shop_product_size_stocks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "shop_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
