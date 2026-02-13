import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

function igHandle(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/instagram\.com\/([^/?]+)/i);
  return m ? m[1] : null;
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

  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <Link
        href="/artists"
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent-gold)]"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        Back to Artists
      </Link>

      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-12">
        {artist.avatarUrl && (
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-sm">
            <img
              src={artist.avatarUrl}
              alt={artist.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="font-serif text-4xl font-medium">{artist.name}</h1>
          {artist.specialty && (
            <p className="mt-2 text-[var(--accent-gold)]">{artist.specialty}</p>
          )}
          {igHandle(artist.instagramUrl) && (
            <a
              href={`https://instagram.com/${igHandle(artist.instagramUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-[var(--muted)] hover:text-[var(--accent-gold)]"
            >
              @{igHandle(artist.instagramUrl)}
            </a>
          )}
        </div>
      </div>

      <h2 className="font-serif text-2xl font-medium text-[var(--foreground)]">
        Portfolio
      </h2>
      <p className="mt-2 text-[var(--muted)]">
        {artworks?.length ?? 0} piece{(artworks?.length ?? 0) !== 1 ? "s" : ""} in this collection. Hover or tap to reveal color.
      </p>

      <GalleryGrid artworks={artworks} showArtistName={false} />
    </div>
  );
}
