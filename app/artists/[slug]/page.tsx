import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
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
    <div className="mx-auto max-w-6xl px-8 py-24 md:py-32">
      <Link
        href="/artists"
        className="mb-12 inline-block text-[13px] font-medium tracking-[0.12em] uppercase text-foreground-muted transition-colors hover:text-foreground"
      >
        ← Back to Artists
      </Link>

      <div className="mb-16 flex flex-col gap-8 sm:flex-row sm:items-end sm:gap-12">
        {artist.avatarUrl && (
          <div className="h-36 w-36 shrink-0 overflow-hidden bg-card-hover">
            <img
              src={artist.avatarUrl}
              alt={artist.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            {artist.name}
          </h1>
          {artist.specialty && (
            <p className="mt-2 text-[15px] tracking-wide text-accent">
              {artist.specialty}
            </p>
          )}
          {igHandle(artist.instagramUrl) && (
            <a
              href={`https://instagram.com/${igHandle(artist.instagramUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[14px] text-foreground-muted transition-colors hover:text-accent"
            >
              @{igHandle(artist.instagramUrl)}
            </a>
          )}
        </div>
      </div>

      <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
        Portfolio
      </p>
      <p className="mt-2 text-[15px] text-foreground-muted">
        {artworks?.length ?? 0} piece{(artworks?.length ?? 0) !== 1 ? "s" : ""}{" "}
        in this collection.
      </p>

      <div className="mt-12">
        <GalleryGrid artworks={artworks} showArtistName={false} />
      </div>
    </div>
  );
}
