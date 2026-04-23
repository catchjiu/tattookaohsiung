import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { ArtistsContent } from "@/components/artists/ArtistsContent";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Professional Tattoo Artists Kaohsiung | Casper & Stan",
  description:
    "Meet Kaohsiung's professional tattoo artists — Casper (realistic tattoo specialist) and Stan (fine-line expert) at Casper Tattoo, Zuoying District, Kaohsiung. 高雄專業刺青師｜寫實刺青師 Casper 與細線刺青師 Stan。",
  keywords: [
    "professional tattoo artist Kaohsiung",
    "professional tattoo Kaohsiung",
    "realistic tattoo Kaohsiung",
    "tattoo artist Kaohsiung",
    "Kaohsiung tattoo artist",
    "高雄專業刺青師",
    "高雄刺青師",
    "高雄寫實刺青師",
  ],
  alternates: {
    canonical: "/artists",
    languages: { en: "/artists", "zh-TW": "/artists", "x-default": "/artists" },
  },
  openGraph: {
    title: "Professional Tattoo Artists Kaohsiung | Casper Tattoo",
    description:
      "Kaohsiung's professional tattoo artists — Casper (realism) and Stan (fine-line) — crafting exceptional work in Zuoying District.",
    url: "/artists",
  },
};

export default async function ArtistsPage() {
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

  const heroUrls = heroImages.map((img) => img.url);

  return (
    <>
      <PageHero
        imageUrls={heroUrls}
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
