import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { ArtistsContent } from "@/components/artists/ArtistsContent";

export const metadata: Metadata = {
  title: "Our Tattoo Artists",
  description:
    "Meet Casper (precision realism) and Stan (single-needle fine-line) — the resident artists at Tattoo Kaohsiung, Zuoying District, Kaohsiung, Taiwan.",
  alternates: {
    canonical: "/artists",
    languages: { en: "/artists", "zh-TW": "/artists", "x-default": "/artists" },
  },
  openGraph: {
    title: "Our Tattoo Artists | Tattoo Kaohsiung",
    description:
      "Meet Casper and Stan — master tattoo artists specialising in realism and fine-line at our Kaohsiung studio.",
    url: "/artists",
  },
};

export default async function ArtistsPage() {
  const artists = await prisma.artist.findMany({
    where: { status: { not: "INACTIVE" } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <ArtistsContent
      artists={artists.map((a) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        specialty: a.specialty,
        avatarUrl: a.avatarUrl,
        instagramUrl: a.instagramUrl,
      }))}
    />
  );
}
