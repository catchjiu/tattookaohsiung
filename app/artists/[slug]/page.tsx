import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { ArtistDetailContent } from "@/components/artists/ArtistDetailContent";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tattookaohsiung.com";

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
    title: `${artist.name} — ${specialty}`,
    description: `View ${artist.name}'s ${specialty.toLowerCase()} portfolio at Casper Tattoo Kaohsiung, Zuoying District, Kaohsiung, Taiwan.`,
    alternates: {
      canonical: `/artists/${slug}`,
      languages: {
        en: `/artists/${slug}`,
        "zh-TW": `/artists/${slug}`,
        "x-default": `/artists/${slug}`,
      },
    },
    openGraph: {
      title: `${artist.name} — ${specialty} | Casper Tattoo Kaohsiung`,
      description: `Explore ${artist.name}'s tattoo portfolio — ${specialty.toLowerCase()} art from Kaohsiung's premier studio.`,
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
    jobTitle: artist.specialty ?? "Tattoo Artist",
    worksFor: {
      "@type": "LocalBusiness",
      name: "Casper Tattoo Kaohsiung",
      url: SITE_URL,
    },
    knowsAbout: artist.specialty ? [artist.specialty, "Tattooing", "Body art"] : ["Tattooing", "Body art"],
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
