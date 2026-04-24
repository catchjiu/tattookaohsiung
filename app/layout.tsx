import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSiteUrl } from "@/lib/site-url";
import type { Locale } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const SITE_URL = getSiteUrl();

// ---------------------------------------------------------------------------
// TattooShop (LocalBusiness) — global site-wide structured data
// Placed in layout.tsx so every page inherits the business identity signal.
// Uses `strategy="afterInteractive"` (Next.js Script) because JSON-LD does
// not need to block rendering; Googlebot executes JS and reads it correctly.
// ---------------------------------------------------------------------------
const localBusinessStructuredData = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
  // TattooShop is not a native schema.org type; additionalType maps to the
  // Wikidata entity for "tattoo parlour" so validators can identify the niche.
  additionalType: "https://www.wikidata.org/wiki/Q11645",
  name: "Casper Tattoo Kaohsiung 高雄刺青",
  alternateName: ["Casper Tattoo Kaohsiung", "高雄刺青", "高雄刺青工作室"],
  description:
    "A premier tattoo studio in Kaohsiung specializing in high-end realism and intricate fine-line artistry. We provide custom tattoo designs that blend technical precision with artistic soul. " +
    "高雄頂級刺青工作室，專注於高端寫實風格與精緻細線條藝術，提供結合技術精準與藝術靈魂的客製化刺青設計。",
  url: SITE_URL,
  telephone: "+886-967-071-750",
  priceRange: "$$$",
  image: `${SITE_URL}/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 18, Shijian Rd | 實踐路 18 號",
    addressLocality: "Zuoying District | 左營區",
    addressRegion: "Kaohsiung City | 高雄市",
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
  // ---- Service catalog -------------------------------------------------------
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Tattoo Services | 刺青服務項目",
    itemListElement: [
      {
        "@type": "Offer",
        position: 1,
        itemOffered: {
          "@type": "Service",
          name: "Realism Tattoos | 寫實風格紋身",
          description:
            "High-fidelity portraits, nature, and 3D architectural designs. | 高真度人物肖像、自然景物與立體設計",
          serviceType: "Realism Tattoo | 寫實風格刺青",
          provider: { "@id": SITE_URL },
        },
      },
      {
        "@type": "Offer",
        position: 2,
        itemOffered: {
          "@type": "Service",
          name: "Fine Line Artistry | 細線條藝術",
          description:
            "Delicate, minimalist, and intricate single-needle aesthetic works. | 精緻極簡、細膩的單針美學作品",
          serviceType: "Fine Line Tattoo | 細線條刺青",
          provider: { "@id": SITE_URL },
        },
      },
      {
        "@type": "Offer",
        position: 3,
        itemOffered: {
          "@type": "Service",
          name: "Custom Tattoo Design | 客製化刺青設計",
          description:
            "Professional consultation to transform concepts into permanent body art. | 專業諮詢，將個人創意轉化為永恆的身體藝術",
          serviceType: "Custom Tattoo Design | 客製化刺青設計",
          provider: { "@id": SITE_URL },
        },
      },
    ],
  },
  // ---- Coverage & hours ------------------------------------------------------
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
  // ---- Team ------------------------------------------------------------------
  employee: [
    {
      "@type": "Person",
      name: "Casper",
      jobTitle: "Tattoo Artist — Precision Realism | 寫實刺青藝術家",
      knowsAbout: [
        "Realism tattoo | 寫實刺青",
        "Portrait tattoo | 人物肖像刺青",
        "Black and grey realism | 黑灰寫實",
      ],
      url: `${SITE_URL}/artists/casper`,
    },
    {
      "@type": "Person",
      name: "Stan",
      jobTitle: "Tattoo Artist — Single-Needle Fine-line | 細線條刺青藝術家",
      knowsAbout: [
        "Fine-line tattoo | 細線條刺青",
        "Single-needle tattooing | 單針刺青",
        "Minimalist tattoo | 極簡刺青",
      ],
      url: `${SITE_URL}/artists/stan`,
    },
  ],
  sameAs: [
    "https://www.instagram.com/tattookaohsiung",
    "https://maps.app.goo.gl/5qZqT6F3KtN2D8da8",
  ],
  keywords:
    "tattoo Kaohsiung, 高雄刺青, realism tattoo, fine-line tattoo, 寫實刺青, 細線條刺青, custom tattoo design, 客製化刺青設計",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Casper Tattoo Kaohsiung | Professional Realism & Fine-Line Tattoo Studio",
    template: "%s | Casper Tattoo Kaohsiung",
  },
  description:
    "Casper Tattoo — Kaohsiung's premier professional tattoo studio specializing in precision realism and fine-line artistry. Book a consultation with professional tattoo artists Casper and Stan in Zuoying District, Kaohsiung.",
  icons: {
    icon: "/casper.jpg",
    shortcut: "/casper.jpg",
    apple: "/casper.jpg",
  },
  keywords: [
    // ── English – exact match & close variants ──
    "tattoo Kaohsiung",
    "Kaohsiung tattoo",
    "realistic tattoo Kaohsiung",
    "realism tattoo Kaohsiung",
    "professional tattoo Kaohsiung",
    "professional tattoo artist Kaohsiung",
    "best tattoo shop Kaohsiung",
    "Zuoying tattoo studio",
    "fine-line tattoo Kaohsiung",
    "portrait tattoo Kaohsiung",
    "tattoo studio Taiwan",
    "tattoo artist Taiwan",
    "tattoo tourism Taiwan",
    // ── Traditional Chinese – exact match & close variants ──
    "高雄刺青",
    "高雄紋身",
    "高雄寫實刺青",
    "高雄專業刺青",
    "高雄專業刺青師",
    "高雄刺青工作室",
    "高雄細線刺青",
    "左營刺青",
    "寫實刺青高雄",
    "刺青高雄推薦",
    "紋身高雄",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "zh-TW": "/zh-TW",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "zh_TW",
    siteName: "Casper Tattoo Kaohsiung",
    url: SITE_URL,
    title: "Casper Tattoo Kaohsiung | Professional Realism & Fine-Line Studio",
    description:
      "Kaohsiung's premier professional tattoo studio — precision realism portraits, fine-line artistry, and custom designs by artists Casper & Stan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casper Tattoo Kaohsiung | Professional Realism & Fine-Line Studio",
    description:
      "Kaohsiung's premier professional tattoo studio — precision realism portraits, fine-line artistry, and custom designs by artists Casper & Stan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read locale set by middleware so <html lang> and LanguageProvider
  // both reflect the correct language in the SSR response.
  const headersList = await headers();
  const locale = (headersList.get("x-locale") ?? "en") as Locale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${oswald.variable} min-h-screen bg-background text-foreground antialiased font-sans`}
      >
        <Script
          id="local-business-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessStructuredData),
          }}
        />
        <LanguageProvider initialLocale={locale}>
          <div className="grain-overlay" aria-hidden />
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
