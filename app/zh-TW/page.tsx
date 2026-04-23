import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site-url";
import { ComingSoon } from "@/components/home/ComingSoon";

export const dynamic = "force-dynamic";

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  title: "高雄刺青｜高雄專業刺青工作室 Casper Tattoo — 寫實刺青・細線刺青",
  description:
    "高雄刺青首選｜Casper Tattoo 高雄專業刺青工作室，專精高雄寫實刺青（人物肖像・自然景物）與細線刺青。高雄專業刺青師 Casper 與 Stan，位於高雄市左營區實踐路 18 號。立即預約諮詢。",
  keywords: [
    "高雄刺青",
    "高雄紋身",
    "高雄寫實刺青",
    "高雄專業刺青",
    "高雄專業刺青師",
    "高雄刺青推薦",
    "高雄刺青工作室",
    "左營刺青",
    "刺青高雄",
    "寫實刺青高雄",
    "tattoo Kaohsiung",
    "professional tattoo Kaohsiung",
    "realistic tattoo Kaohsiung",
  ],
  alternates: {
    canonical: "/zh-TW",
    languages: { en: "/", "zh-TW": "/zh-TW", "x-default": "/" },
  },
  openGraph: {
    title: "高雄刺青｜Casper Tattoo 高雄專業刺青工作室",
    description:
      "高雄頂級專業刺青工作室，寫實刺青與細線刺青。高雄刺青師 Casper 與 Stan。",
    url: `${SITE_URL}/zh-TW`,
    locale: "zh_TW",
  },
};

const zhStructuredData = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
  additionalType: "https://www.wikidata.org/wiki/Q11645",
  name: "Casper Tattoo Kaohsiung",
  alternateName: "高雄刺青",
  description:
    "高雄專業刺青工作室，專精高雄寫實刺青與細線刺青。Professional tattoo studio in Kaohsiung specialising in realistic tattoos and fine-line artistry.",
  url: `${SITE_URL}/zh-TW`,
  telephone: "+886-967-071-750",
  priceRange: "$$$",
  image: `${SITE_URL}/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "實踐路 18 號",
    addressLocality: "左營區",
    addressRegion: "高雄市",
    postalCode: "813",
    addressCountry: "TW",
  },
  geo: { "@type": "GeoCoordinates", latitude: 22.6896, longitude: 120.2986 },
  hasMap:
    "https://www.google.com/maps/search/?api=1&query=18+Shijian+Rd,+Zuoying+District,+Kaohsiung+City,+813+Taiwan",
  areaServed: [{ "@type": "City", name: "高雄市" }, { "@type": "Country", name: "台灣" }],
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
      jobTitle: "高雄專業刺青師｜寫實刺青",
      knowsAbout: ["高雄寫實刺青", "人物肖像刺青", "高雄專業刺青師", "realistic tattoo Kaohsiung"],
      url: `${SITE_URL}/zh-TW/artists/casper`,
    },
    {
      "@type": "Person",
      name: "Stan",
      jobTitle: "高雄專業刺青師｜細線刺青",
      knowsAbout: ["高雄細線刺青", "單針刺青", "高雄專業刺青師", "fine-line tattoo Kaohsiung"],
      url: `${SITE_URL}/zh-TW/artists/stan`,
    },
  ],
  sameAs: ["https://www.instagram.com/tattookaohsiung"],
};

export default async function ZhTWHomePage() {
  const [artists, portfolioImages] = await Promise.all([
    prisma.artist.findMany({
      where: { status: { not: "INACTIVE" } },
      select: { id: true, name: true, specialty: true, avatarUrl: true, slug: true },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(zhStructuredData) }}
      />
      <ComingSoon
        artists={artists.map((a) => ({
          id: a.id,
          name: a.name,
          specialty: a.specialty,
          avatar_url: a.avatarUrl,
          slug: a.slug,
        }))}
        imageUrls={portfolioImages.map((img) => img.url)}
      />
    </>
  );
}
