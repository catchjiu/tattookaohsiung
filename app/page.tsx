import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { ComingSoon } from "@/components/home/ComingSoon";

export const metadata: Metadata = {
  title: "Tattoo Kaohsiung | Precision Realism & Fine-Line Studio Taiwan",
  description:
    "Premier tattoo studio in Kaohsiung specializing in precision realism and single-needle fine-line art. Book a consultation with artists Casper and Stan in Zuoying District.",
  alternates: {
    canonical: "/",
    languages: { en: "/", "zh-TW": "/", "x-default": "/" },
  },
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tattookaohsiung.com";

const structuredData = {
  "@context": "https://schema.org",
  // HealthAndBeautyBusiness is the closest official schema.org type for a tattoo parlor
  "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
  name: "Tattoo Kaohsiung",
  description:
    "Premier tattoo studio in Kaohsiung specializing in precision realism and single-needle fine-line art.",
  url: SITE_URL,
  telephone: "+886-967-071-750",
  priceRange: "$$$",
  image: `${SITE_URL}/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 18, Shijian Rd",
    addressLocality: "Zuoying District",
    addressRegion: "Kaohsiung City",
    postalCode: "813",
    addressCountry: "TW",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 22.6896,
    longitude: 120.2986,
  },
  hasMap:
    "https://www.google.com/maps/search/?api=1&query=18+Shijian+Rd,+Zuoying+District,+Kaohsiung+City,+813+Taiwan",
  areaServed: [
    { "@type": "City", name: "Kaohsiung" },
    { "@type": "Country", name: "Taiwan" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "12:00",
      closes: "21:00",
    },
  ],
  employee: [
    {
      "@type": "Person",
      name: "Casper",
      jobTitle: "Tattoo Artist — Precision Realism",
      knowsAbout: [
        "Realism tattoo",
        "Portrait tattoo",
        "Photo-realistic tattoo art",
        "Black and grey realism",
      ],
      url: `${SITE_URL}/artists/casper`,
    },
    {
      "@type": "Person",
      name: "Stan",
      jobTitle: "Tattoo Artist — Single-Needle Fine-line",
      knowsAbout: [
        "Fine-line tattoo",
        "Single-needle tattooing",
        "Minimalist tattoo",
        "Delicate linework tattoo",
      ],
      url: `${SITE_URL}/artists/stan`,
    },
  ],
  sameAs: ["https://www.instagram.com/tattookaohsiung"],
};

export default async function HomePage() {
  const [artists, portfolioImages] = await Promise.all([
    prisma.artist.findMany({
      where: { status: { not: "INACTIVE" } },
      select: {
        id: true,
        name: true,
        specialty: true,
        avatarUrl: true,
        slug: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
    prisma.portfolioImage.findMany({
      where: { showInHeroSlider: true },
      select: { url: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 12,
    }),
  ]);

  const imageUrls = portfolioImages.map((img) => img.url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ComingSoon
        artists={artists.map((a) => ({
          id: a.id,
          name: a.name,
          specialty: a.specialty,
          avatar_url: a.avatarUrl,
          slug: a.slug,
        }))}
        imageUrls={imageUrls}
      />
    </>
  );
}
