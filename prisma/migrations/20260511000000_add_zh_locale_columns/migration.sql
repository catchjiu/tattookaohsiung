-- Locale columns referenced in schema.prisma but missing from earlier migrations
ALTER TABLE "artists" ADD COLUMN IF NOT EXISTS "name_zh" TEXT;
ALTER TABLE "artists" ADD COLUMN IF NOT EXISTS "bio_zh" TEXT;
ALTER TABLE "artists" ADD COLUMN IF NOT EXISTS "specialty_zh" TEXT;

ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "title_zh" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "excerpt_zh" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "content_zh" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "category_zh" TEXT;
