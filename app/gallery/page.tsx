import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHero } from "@/components/ui/PageHero";

const SITE_URL = getSiteUrl();

const gallerySchema = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "Realistic Tattoo Portfolio Gallery — Casper Tattoo Kaohsiung | 高雄寫實刺青作品集",
  description:
    "Portfolio of realistic tattoos, fine-line artistry, and custom designs from Kaohsiung's premier professional tattoo studio. 高雄專業刺青工作室寫實刺青與細線刺青作品集。",
  url: `${SITE_URL}/gallery`,
  provider: {
    "@type": "LocalBusiness",
    name: "Casper Tattoo Kaohsiung 高雄刺青",
    alternateName: ["Casper Tattoo Kaohsiung", "高雄刺青"],
    url: SITE_URL,
  },
};

export const metadata: Metadata = {
  title: "Realistic Tattoo Gallery Kaohsiung | Realism & Fine-Line Portfolio",
  description:
    "Browse our portfolio of realistic tattoos and fine-line artistry from Casper Tattoo Kaohsiung — professional tattoo studio in Zuoying District. 高雄寫實刺青｜細線刺青作品集，高雄專業刺青工作室 Casper Tattoo。",
  keywords: [
    "realistic tattoo Kaohsiung",
    "realism tattoo Kaohsiung gallery",
    "professional tattoo Kaohsiung",
    "fine-line tattoo Kaohsiung",
    "tattoo portfolio Kaohsiung",
    "Kaohsiung tattoo gallery",
    "高雄寫實刺青",
    "高雄刺青作品",
    "高雄刺青作品集",
    "高雄細線刺青",
  ],
  alternates: {
    canonical: "/gallery",
    languages: { en: "/gallery", "zh-TW": "/zh-TW/gallery", "x-default": "/gallery" },
  },
  openGraph: {
    title: "Realistic Tattoo Gallery Kaohsiung | Casper Tattoo",
    description:
      "Portfolio of realistic tattoos, fine-line artistry, and custom designs from Kaohsiung's premier professional tattoo studio.",
    url: "/gallery",
  },
};

export default async function GalleryPage() {
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

  const heroUrls = heroImages.map((img) => img.url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <PageHero
        imageUrls={heroUrls}
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
