"use client";

import Link from "next/link";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { ArtistAvatar } from "@/components/ui/ArtistAvatar";
import { useLanguage } from "@/components/providers/LanguageProvider";

function igHandle(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/instagram\.com\/([^/?]+)/i);
  return m ? m[1] : null;
}

type Artwork = {
  id: string;
  title: string | null;
  image_url: string;
  tags: string[] | null;
};

type Props = {
  artist: {
    name: string;
    slug: string;
    specialty: string | null;
    avatarUrl: string | null;
    instagramUrl: string | null;
  };
  artworks: Artwork[];
};

export function ArtistDetailContent({ artist, artworks }: Props) {
  const { t } = useLanguage();
  const count = artworks.length;
  const pieceWord = count === 1 ? t("artistDetail.piece") : t("artistDetail.pieces");

  return (
    <div className="mx-auto max-w-6xl px-8 py-24 md:py-32">
      <Link
        href="/artists"
        className="mb-12 inline-block text-[13px] font-medium tracking-[0.12em] uppercase text-foreground-muted transition-colors hover:text-foreground"
      >
        {t("artistDetail.backToArtists")}
      </Link>

      <div className="mb-16 flex flex-col gap-8 sm:flex-row sm:items-end sm:gap-12">
        <div className="h-36 w-36 shrink-0 overflow-hidden bg-card-hover">
          <ArtistAvatar
            src={artist.avatarUrl}
            alt={artist.name}
            width={144}
            height={144}
            className="h-full w-full object-cover"
          />
        </div>
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
        {t("artistDetail.portfolio")}
      </p>
      <p className="mt-2 text-[15px] text-foreground-muted">
        {count} {pieceWord} {t("artistDetail.inThisCollection")}
      </p>

      <div className="mt-12">
        <GalleryGrid
          artworks={artworks.map((a) => ({
            ...a,
            artists: { name: artist.name, specialty: artist.specialty },
          }))}
          showArtistName={false}
        />
      </div>
    </div>
  );
}
