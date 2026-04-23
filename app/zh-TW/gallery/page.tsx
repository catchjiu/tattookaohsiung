import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHero } from "@/components/ui/PageHero";

export const dynamic = "force-dynamic";

const SITE_URL = getSiteUrl();

const zhGallerySchema = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "高雄寫實刺青作品集｜Casper Tattoo Kaohsiung 高雄刺青工作室",
  description:
    "高雄專業刺青工作室寫實刺青與細線刺青作品集。Realistic tattoo and fine-line portfolio from Kaohsiung's professional tattoo studio.",
  url: `${SITE_URL}/zh-TW/gallery`,
  provider: {
    "@type": "LocalBusiness",
    name: "Casper Tattoo Kaohsiung",
    alternateName: "高雄刺青",
    url: SITE_URL,
  },
};

export const metadata: Metadata = {
  title: "高雄寫實刺青作品集｜高雄刺青師作品 — Casper Tattoo",
  description:
    "瀏覽 Casper Tattoo 高雄專業刺青工作室的寫實刺青與細線刺青作品集。高雄刺青師 Casper 與 Stan 的精彩作品。高雄寫實刺青｜高雄細線刺青。",
  keywords: [
    "高雄寫實刺青作品",
    "高雄刺青作品集",
    "高雄刺青師作品",
    "高雄細線刺青",
    "高雄刺青",
    "realistic tattoo Kaohsiung gallery",
    "Kaohsiung tattoo portfolio",
  ],
  alternates: {
    canonical: "/zh-TW/gallery",
    languages: { en: "/gallery", "zh-TW": "/zh-TW/gallery", "x-default": "/gallery" },
  },
  openGraph: {
    title: "高雄寫實刺青作品集｜Casper Tattoo 高雄刺青",
    description: "高雄專業刺青工作室寫實刺青與細線刺青作品集。",
    url: `${SITE_URL}/zh-TW/gallery`,
    locale: "zh_TW",
  },
};

export default async function ZhTWGalleryPage() {
  const [images, heroImages] = await Promise.all([
    prisma.portfolioImage.findMany({
      include: { artist: { select: { name: true, specialty: true } } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.portfolioImage.findMany({
      where: { showInHeroSlider: true },
      select: { url: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 12,
    }),
  ]);

  const artworks = images.map((img) => ({
    id: img.id,
    title: img.title ?? img.altText,
    image_url: img.url,
    tags: img.tags,
    artists: { name: img.artist.name, specialty: img.artist.specialty },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(zhGallerySchema) }}
      />
      <PageHero
        imageUrls={heroImages.map((img) => img.url)}
        labelKey="gallery.label"
        titleKey="gallery.title"
        descriptionKey="gallery.description"
      />
      <div className="mx-auto max-w-6xl px-8 py-20">
        <GalleryGrid artworks={artworks} />
      </div>
    </>
  );
}
