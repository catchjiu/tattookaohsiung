import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryHeader } from "@/components/gallery/GalleryHeader";
import { Section } from "@/components/ui";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tattookaohsiung.com";

const gallerySchema = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "Tattoo Portfolio Gallery — Tattoo Kaohsiung",
  description:
    "Browse our portfolio of precision realism and fine-line tattoo art from Kaohsiung's premier studio.",
  url: `${SITE_URL}/gallery`,
  provider: {
    "@type": "LocalBusiness",
    name: "Tattoo Kaohsiung",
    url: SITE_URL,
  },
};

export const metadata: Metadata = {
  title: "Tattoo Portfolio Gallery",
  description:
    "Browse our portfolio of precision realism and fine-line tattoo art from Tattoo Kaohsiung. Each piece crafted by artists Casper and Stan in Zuoying District, Kaohsiung.",
  alternates: {
    canonical: "/gallery",
    languages: { en: "/gallery", "zh-TW": "/gallery", "x-default": "/gallery" },
  },
  openGraph: {
    title: "Tattoo Portfolio Gallery | Tattoo Kaohsiung",
    description:
      "Browse realism and fine-line tattoo artwork from our Kaohsiung studio.",
    url: "/gallery",
  },
};

export default async function GalleryPage() {
  const images = await prisma.portfolioImage.findMany({
    include: { artist: { select: { name: true, specialty: true } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const artworks = images.map((img) => ({
    id: img.id,
    title: img.title ?? img.altText,
    image_url: img.url,
    tags: img.tags,
    artists: { name: img.artist.name, specialty: img.artist.specialty },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <div className="mx-auto max-w-6xl px-8">
        <Section size="narrow">
          <GalleryHeader />
        </Section>

        <GalleryGrid artworks={artworks} />
      </div>
    </>
  );
}
