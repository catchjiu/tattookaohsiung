import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { ArtistDetailContent } from "@/components/artists/ArtistDetailContent";

const SITE_URL = getSiteUrl();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artist = await prisma.artist.findFirst({
    where: { slug, status: { not: "INACTIVE" } },
    select: { name: true, specialty: true, avatarUrl: true },
  });
  if (!artist) return {};
  const specialty = artist.specialty ?? "Tattoo Artist";
  return {
    title: `${artist.name} — Professional Tattoo Artist Kaohsiung | ${specialty}`,
    description: `${artist.name} is a professional tattoo artist at Casper Tattoo Kaohsiung, specialising in ${specialty.toLowerCase()}. View the portfolio and book a consultation in Zuoying District, Kaohsiung. 高雄專業刺青師 ${artist.name} — ${specialty}。`,
    keywords: [
      `${artist.name} tattoo Kaohsiung`,
      "professional tattoo artist Kaohsiung",
      "professional tattoo Kaohsiung",
      `${specialty} Kaohsiung`,
      "高雄專業刺青師",
      "高雄刺青師",
    ],
    alternates: {
      canonical: `/artists/${slug}`,
      languages: {
        en: `/artists/${slug}`,
        "zh-TW": `/artists/${slug}`,
        "x-default": `/artists/${slug}`,
      },
    },
    openGraph: {
      title: `${artist.name} — Professional Tattoo Artist Kaohsiung | Casper Tattoo`,
      description: `Explore ${artist.name}'s portfolio — professional ${specialty.toLowerCase()} tattoo art from Kaohsiung's premier studio.`,
      url: `/artists/${slug}`,
      images: artist.avatarUrl ? [{ url: artist.avatarUrl }] : undefined,
    },
  };
}

export default async function ArtistGalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const artist = await prisma.artist.findFirst({
    where: { slug, status: { not: "INACTIVE" } },
    include: {
      portfolioImages: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!artist) notFound();

  const artworks = artist.portfolioImages.map((img) => ({
    id: img.id,
    title: img.title ?? img.altText,
    image_url: img.url,
    tags: img.tags,
  }));

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name,
    jobTitle: `Professional Tattoo Artist — ${artist.specialty ?? "Tattooing"} | 高雄專業刺青師`,
    worksFor: {
      "@type": "LocalBusiness",
      name: "Casper Tattoo Kaohsiung",
      alternateName: "高雄刺青",
      url: SITE_URL,
    },
    knowsAbout: artist.specialty
      ? [
          artist.specialty,
          `${artist.specialty} Kaohsiung`,
          "Professional tattoo Kaohsiung",
          "Tattoo Kaohsiung",
          "Kaohsiung tattoo",
          "Tattooing",
          "Body art",
          "高雄專業刺青",
          "高雄刺青師",
        ]
      : ["Professional tattoo Kaohsiung", "Kaohsiung tattoo", "Tattooing", "Body art", "高雄刺青師"],
    url: `${SITE_URL}/artists/${artist.slug}`,
    ...(artist.instagramUrl ? { sameAs: [artist.instagramUrl] } : {}),
    ...(artist.avatarUrl ? { image: artist.avatarUrl } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <ArtistDetailContent
        artist={{
          name: artist.name,
          slug: artist.slug,
          specialty: artist.specialty,
          avatarUrl: artist.avatarUrl,
          instagramUrl: artist.instagramUrl,
        }}
        artworks={artworks}
      />
    </>
  );
}
