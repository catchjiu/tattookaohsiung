"use client";

import { useMemo, useState } from "react";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { useLanguage } from "@/components/providers/LanguageProvider";

export type GalleryArtwork = {
  id: string;
  title: string | null;
  image_url: string;
  image_urls?: string[];
  tags: string[] | null;
  artistId: string;
  artists?: { name: string; specialty?: string | null };
};

export type GalleryArtist = {
  id: string;
  name: string;
  nameZh?: string | null;
};

type Props = {
  artworks: GalleryArtwork[];
  artists: GalleryArtist[];
};

export function GalleryWithFilters({ artworks, artists }: Props) {
  const { t, locale } = useLanguage();
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

  const filteredArtworks = useMemo(
    () =>
      selectedArtistId
        ? artworks.filter((artwork) => artwork.artistId === selectedArtistId)
        : artworks,
    [artworks, selectedArtistId]
  );

  function artistLabel(artist: GalleryArtist) {
    return locale === "zh-TW" && artist.nameZh ? artist.nameZh : artist.name;
  }

  return (
    <>
      {artists.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedArtistId(null)}
            className={`rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedArtistId === null
                ? "border-accent bg-accent-muted text-accent"
                : "border-border text-foreground-muted hover:border-accent/50 hover:text-accent"
            }`}
          >
            {t("gallery.filterAll")}
          </button>
          {artists.map((artist) => (
            <button
              key={artist.id}
              type="button"
              onClick={() => setSelectedArtistId(artist.id)}
              className={`rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedArtistId === artist.id
                  ? "border-accent bg-accent-muted text-accent"
                  : "border-border text-foreground-muted hover:border-accent/50 hover:text-accent"
              }`}
            >
              {artistLabel(artist)}
            </button>
          ))}
        </div>
      )}
      <GalleryGrid artworks={filteredArtworks} className={artists.length > 0 ? "mt-10" : undefined} />
    </>
  );
}
