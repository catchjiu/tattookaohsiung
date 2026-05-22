import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui/PageHero";
import { PermanentMakeupContent } from "@/components/permanent-makeup/PermanentMakeupContent";
import { permanentMakeupArtistWhere } from "@/lib/artist-job";
import { galleryTagsForLocale, galleryTitleForLocale } from "@/lib/gallery-display";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Permanent Makeup Kaohsiung | Casper Tattoo",
  description:
    "Meet our permanent makeup artists at Casper Tattoo Kaohsiung. View portfolios of microblading, lip blush, and cosmetic tattoo work in Zuoying District.",
  keywords: [
    "permanent makeup Kaohsiung",
    "microblading Kaohsiung",
    "cosmetic tattoo Kaohsiung",
    "PMU Kaohsiung",
    "高雄紋繡",
    "高雄霧眉",
  ],
  alternates: {
    canonical: "/permanent-makeup",
    languages: {
      en: "/permanent-makeup",
      "zh-TW": "/zh-TW/permanent-makeup",
      "x-default": "/permanent-makeup",
    },
  },
  openGraph: {
    title: "Permanent Makeup | Casper Tattoo Kaohsiung",
    description:
      "Professional permanent makeup artists and portfolios at Casper Tattoo Kaohsiung.",
    url: "/permanent-makeup",
  },
};

export default async function PermanentMakeupPage() {
  const artists = await prisma.artist.findMany({
    where: {
      ...permanentMakeupArtistWhere,
      status: { not: "INACTIVE" },
    },
    include: {
      portfolioImages: {
        include: {
          assets: { orderBy: { sortOrder: "asc" }, select: { url: true } },
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  const heroUrls = artists
    .flatMap((artist) =>
      artist.portfolioImages.map((img) => img.url).filter(Boolean)
    )
    .slice(0, 12);

  const artistData = artists.map((artist) => ({
    id: artist.id,
    slug: artist.slug,
    name: artist.name,
    nameZh: artist.nameZh,
    bio: artist.bio,
    bioZh: artist.bioZh,
    specialty: artist.specialty,
    specialtyZh: artist.specialtyZh,
    avatarUrl: artist.avatarUrl,
    instagramUrl: artist.instagramUrl,
    artworks: artist.portfolioImages.map((img) => ({
      id: img.id,
      title: galleryTitleForLocale(img, "en"),
      image_url: img.url,
      image_urls: img.assets.map((a) => a.url),
      tags: galleryTagsForLocale(img, "en"),
    })),
  }));

  return (
    <>
      <PageHero
        imageUrls={heroUrls}
        labelKey="permanentMakeup.label"
        titleKey="permanentMakeup.title"
        descriptionKey="permanentMakeup.description"
      />
      <PermanentMakeupContent artists={artistData} />
    </>
  );
}
