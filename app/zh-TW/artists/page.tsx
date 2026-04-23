import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ArtistsContent } from "@/components/artists/ArtistsContent";
import { PageHero } from "@/components/ui/PageHero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "高雄專業刺青師｜Casper（寫實刺青）& Stan（細線刺青）",
  description:
    "認識高雄專業刺青師 — Casper 專精高雄寫實刺青（人物肖像・自然景物），Stan 專精高雄細線刺青（單針極簡藝術）。Casper Tattoo 位於高雄市左營區。",
  keywords: [
    "高雄專業刺青師",
    "高雄刺青師",
    "高雄寫實刺青師",
    "高雄細線刺青師",
    "高雄刺青",
    "professional tattoo artist Kaohsiung",
    "Kaohsiung tattoo artist",
  ],
  alternates: {
    canonical: "/zh-TW/artists",
    languages: { en: "/artists", "zh-TW": "/zh-TW/artists", "x-default": "/artists" },
  },
  openGraph: {
    title: "高雄專業刺青師｜Casper Tattoo 高雄刺青",
    description: "高雄專業刺青師 Casper（寫實）與 Stan（細線），位於高雄市左營區。",
    url: "/zh-TW/artists",
    locale: "zh_TW",
  },
};

export default async function ZhTWArtistsPage() {
  const [artists, heroImages] = await Promise.all([
    prisma.artist.findMany({
      where: { status: { not: "INACTIVE" } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
    prisma.portfolioImage.findMany({
      where: { showInHeroSlider: true },
      select: { url: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 12,
    }),
  ]);

  return (
    <>
      <PageHero
        imageUrls={heroImages.map((img) => img.url)}
        labelKey="artists.label"
        titleKey="artists.title"
        descriptionKey="artists.description"
      />
      <ArtistsContent
        artists={artists.map((a) => ({
          id: a.id,
          name: a.name,
          slug: a.slug,
          specialty: a.specialty,
          avatarUrl: a.avatarUrl,
          instagramUrl: a.instagramUrl,
        }))}
        showHeader={false}
      />
    </>
  );
}
