"use client";

import { ArtistAvatar } from "@/components/ui/ArtistAvatar";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import {
  artistBioForLocale,
  artistNameForLocale,
  artistSpecialtyForLocale,
} from "@/lib/artist-display";
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
  image_urls?: string[];
  tags: string[] | null;
};

export type PermanentMakeupArtist = {
  id: string;
  slug: string;
  name: string;
  nameZh: string | null;
  bio: string | null;
  bioZh: string | null;
  specialty: string | null;
  specialtyZh: string | null;
  avatarUrl: string | null;
  instagramUrl: string | null;
  artworks: Artwork[];
};

type Props = {
  artists: PermanentMakeupArtist[];
};

export function PermanentMakeupContent({ artists }: Props) {
  const { t, locale } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-8 py-20 md:py-28">
      {artists.length === 0 ? (
        <p className="py-20 text-center text-foreground-muted">
          {t("permanentMakeup.noArtists")}
        </p>
      ) : (
        <div className="space-y-32">
          {artists.map((artist) => {
            const displayName = artistNameForLocale(artist, locale);
            const displayBio = artistBioForLocale(artist, locale);
            const displaySpecialty = artistSpecialtyForLocale(artist, locale);
            const handle = igHandle(artist.instagramUrl);
            const count = artist.artworks.length;
            const pieceWord =
              count === 1
                ? t("artistDetail.piece")
                : t("artistDetail.pieces");

            return (
              <section
                key={artist.id}
                id={artist.slug}
                className="scroll-mt-24 border-t border-border pt-20 first:border-t-0 first:pt-0"
              >
                <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
                  <div className="h-40 w-40 shrink-0 overflow-hidden bg-card-hover">
                    <ArtistAvatar
                      src={artist.avatarUrl}
                      alt={displayName}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="max-w-2xl">
                    <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                      {displayName}
                    </h2>
                    <p className="mt-2 text-[15px] tracking-wide text-accent">
                      {displaySpecialty || t("permanentMakeup.artistRole")}
                    </p>
                    {handle && (
                      <a
                        href={`https://instagram.com/${handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-[14px] text-foreground-muted transition-colors hover:text-accent"
                      >
                        @{handle}
                      </a>
                    )}
                    {displayBio && (
                      <p className="mt-6 text-[17px] leading-relaxed text-foreground-muted whitespace-pre-line">
                        {displayBio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-16">
                  <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground-muted">
                    {t("permanentMakeup.portfolio")}
                  </p>
                  <p className="mt-2 text-[15px] text-foreground-muted">
                    {count} {pieceWord} {t("artistDetail.inThisCollection")}
                  </p>
                  {count > 0 ? (
                    <div className="mt-12">
                      <GalleryGrid
                        artworks={artist.artworks.map((a) => ({
                          ...a,
                          artists: {
                            name: displayName,
                            specialty: displaySpecialty,
                          },
                        }))}
                        showArtistName={false}
                      />
                    </div>
                  ) : (
                    <p className="mt-8 text-center text-foreground-muted">
                      {t("permanentMakeup.noPortfolio")}
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
