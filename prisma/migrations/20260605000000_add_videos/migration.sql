-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "title_zh" TEXT,
    "excerpt" TEXT,
    "excerpt_zh" TEXT,
    "content" TEXT NOT NULL DEFAULT '',
    "content_zh" TEXT,
    "youtube_url" TEXT NOT NULL,
    "youtube_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "videos_slug_key" ON "videos"("slug");

-- CreateIndex
CREATE INDEX "videos_is_published_published_at_idx" ON "videos"("is_published", "published_at");

-- CreateIndex
CREATE INDEX "videos_is_published_sort_order_idx" ON "videos"("is_published", "sort_order");

-- CreateIndex
CREATE INDEX "videos_slug_idx" ON "videos"("slug");
