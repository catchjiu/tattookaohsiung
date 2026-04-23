import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";
import { notFound } from "next/navigation";
import { ArtistDetailContent } from "@/components/artists/ArtistDetailContent";

export const dynamic = "force-dynamic";

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
  const specialty = artist.specialty ?? "刺青師";
  return {
    title: `${artist.name}｜高雄專業刺青師 — ${specialty}`,
    description: `${artist.name} 是 Casper Tattoo 高雄專業刺青師，專精${specialty}。查看作品集並預約諮詢，工作室位於高雄市左營區。高雄專業刺青師｜${specialty}高雄。`,
    keywords: [
      `${artist.name} 高雄刺青`,
      "高雄專業刺青師",
      "高雄刺青師",
      `${specialty}高雄`,
      "高雄刺青",
      `professional tattoo artist Kaohsiung`,
    ],
    alternates: {
      canonical: `/zh-TW/artists/${slug}`,
      languages: {
        en: `/artists/${slug}`,
        "zh-TW": `/zh-TW/artists/${slug}`,
        "x-default": `/artists/${slug}`,
      },
    },
    openGraph: {
      title: `${artist.name}｜高雄專業刺青師 | Casper Tattoo`,
      description: `${artist.name} — 高雄專業刺青師，專精${specialty}。查看作品集。`,
      url: `/zh-TW/artists/${slug}`,
      locale: "zh_TW",
      images: artist.avatarUrl ? [{ url: artist.avatarUrl }] : undefined,
    },
  };
}

export default async function ZhTWArtistPage({
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

  const zhPersonSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name,
    jobTitle: `高雄專業刺青師｜${artist.specialty ?? "刺青"}`,
    worksFor: {
      "@type": "LocalBusiness",
      name: "Casper Tattoo Kaohsiung",
      alternateName: "高雄刺青",
      url: SITE_URL,
    },
    knowsAbout: artist.specialty
      ? [
          `${artist.specialty}高雄`,
          "高雄專業刺青",
          "高雄刺青師",
          "professional tattoo Kaohsiung",
          artist.specialty,
        ]
      : ["高雄專業刺青", "高雄刺青師", "professional tattoo Kaohsiung"],
    url: `${SITE_URL}/zh-TW/artists/${artist.slug}`,
    ...(artist.instagramUrl ? { sameAs: [artist.instagramUrl] } : {}),
    ...(artist.avatarUrl ? { image: artist.avatarUrl } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(zhPersonSchema) }}
      />
      <ArtistDetailContent
        artist={{
          name: artist.name,
          slug: artist.slug,
          specialty: artist.specialty,
          avatarUrl: artist.avatarUrl,
          instagramUrl: artist.instagramUrl,
        }}
        artworks={artist.portfolioImages.map((img) => ({
          id: img.id,
          title: img.title ?? img.altText,
          image_url: img.url,
          tags: img.tags,
        }))}
      />
    </>
  );
}
