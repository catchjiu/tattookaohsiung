import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui/PageHero";
import { PermanentMakeupContent } from "@/components/permanent-makeup/PermanentMakeupContent";
import { permanentMakeupArtistWhere } from "@/lib/artist-job";
import { galleryTagsForLocale, galleryTitleForLocale } from "@/lib/gallery-display";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "高雄紋繡｜霧眉紋唇 — Casper Tattoo",
  description:
    "認識 Casper Tattoo 高雄專業紋繡師，瀏覽霧眉、紋唇等半永久彩妝作品集。工作室位於高雄市左營區。",
  keywords: [
    "高雄紋繡",
    "高雄霧眉",
    "高雄紋唇",
    "半永久彩妝 高雄",
    "PMU 高雄",
  ],
  alternates: {
    canonical: "/zh-TW/permanent-makeup",
    languages: {
      en: "/permanent-makeup",
      "zh-TW": "/zh-TW/permanent-makeup",
      "x-default": "/permanent-makeup",
    },
  },
  openGraph: {
    title: "高雄紋繡｜Casper Tattoo",
    description: "Casper Tattoo 高雄專業紋繡師與作品集。",
    url: "/zh-TW/permanent-makeup",
  },
};

export default async function PermanentMakeupPageZhTW() {
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
    bookedUntil: artist.bookedUntil?.toISOString() ?? null,
    artworks: artist.portfolioImages.map((img) => ({
      id: img.id,
      title: galleryTitleForLocale(img, "zh-TW"),
      image_url: img.url,
      image_urls: img.assets.map((a) => a.url),
      tags: galleryTagsForLocale(img, "zh-TW"),
    })),
  }));

  return (
    <>
      <PageHero
        imageUrls={heroUrls}
        labelKey="permanentMakeup.label"
        titleKey="permanentMakeup.title"
        descriptionKey="permanentMakeup.description"
        bookNow
      />
      <PermanentMakeupContent artists={artistData} />
    </>
  );
}
