-- AlterTable
ALTER TABLE "portfolio_images" ADD COLUMN "title_zh" TEXT;
ALTER TABLE "portfolio_images" ADD COLUMN "alt_text_zh" TEXT;
ALTER TABLE "portfolio_images" ADD COLUMN "tags_zh" TEXT[] DEFAULT ARRAY[]::TEXT[];
