import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryHeader } from "@/components/gallery/GalleryHeader";
import { Section } from "@/components/ui";

export default async function GalleryPage() {
  const images = await prisma.portfolioImage.findMany({
    include: { artist: { select: { name: true } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const artworks = images.map((img) => ({
    id: img.id,
    title: img.title ?? img.altText,
    image_url: img.url,
    tags: img.tags,
    artists: { name: img.artist.name },
  }));

  return (
    <div className="mx-auto max-w-7xl px-6">
      <Section size="narrow">
        <GalleryHeader />
      </Section>

      <GalleryGrid artworks={artworks} />
    </div>
  );
}
