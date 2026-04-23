import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
import { ComingSoon } from "@/components/home/ComingSoon";

export const metadata: Metadata = {
  title: "Casper Tattoo Kaohsiung | Professional Tattoo Studio — Realism & Fine-Line",
  description:
    "Tattoo Kaohsiung — Casper Tattoo is Kaohsiung's premier professional tattoo studio specialising in realistic tattoos and single-needle fine-line art. Book a consultation with professional tattoo artists Casper & Stan in Zuoying District. 高雄刺青｜高雄專業刺青工作室，專精寫實刺青與細線條紋身。",
  keywords: [
    "tattoo Kaohsiung",
    "Kaohsiung tattoo",
    "realistic tattoo Kaohsiung",
    "realism tattoo Kaohsiung",
    "professional tattoo Kaohsiung",
    "professional tattoo artist Kaohsiung",
    "高雄刺青",
    "高雄紋身",
    "高雄寫實刺青",
    "高雄專業刺青",
    "高雄專業刺青師",
    "刺青高雄推薦",
  ],
  alternates: {
    canonical: "/",
    languages: { en: "/", "zh-TW": "/zh-TW", "x-default": "/" },
  },
};

const SITE_URL = getSiteUrl();

const structuredData = {
  "@context": "https://schema.org",
  // HealthAndBeautyBusiness is the closest official schema.org type for a tattoo parlor
  "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
  name: "Casper Tattoo Kaohsiung",
  alternateName: "高雄刺青",
  description:
    "Kaohsiung's premier professional tattoo studio specialising in realistic tattoos and fine-line artistry. 高雄頂級專業刺青工作室，專精寫實刺青（高雄寫實刺青）與細線條紋身，提供客製化刺青設計。",
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
      jobTitle: "Professional Tattoo Artist — Precision Realism | 高雄寫實刺青師",
      knowsAbout: [
        "Realistic tattoo Kaohsiung",
        "Realism tattoo Kaohsiung",
        "Portrait tattoo",
        "Photo-realistic tattoo art",
        "Black and grey realism",
        "高雄寫實刺青",
        "高雄專業刺青師",
      ],
      url: `${SITE_URL}/artists/casper`,
    },
    {
      "@type": "Person",
      name: "Stan",
      jobTitle: "Professional Tattoo Artist — Single-Needle Fine-line | 高雄細線刺青師",
      knowsAbout: [
        "Fine-line tattoo Kaohsiung",
        "Single-needle tattooing",
        "Minimalist tattoo",
        "Delicate linework tattoo",
        "高雄細線刺青",
        "高雄專業刺青師",
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
