-- Optional apparel / variant sizes (e.g. S, M, L, XL). Empty array = one size only.
ALTER TABLE "shop_products" ADD COLUMN "size_options" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "shop_order_items" ADD COLUMN "size_snapshot" TEXT;
