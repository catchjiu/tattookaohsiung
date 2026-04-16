"use client";

import Link from "next/link";
import { ArtistAvatar } from "@/components/ui/ArtistAvatar";
import { Section, SectionLabel, SectionTitle } from "@/components/ui";
import { ArtistsPageClient } from "./ArtistsPageClient";
import { useLanguage } from "@/components/providers/LanguageProvider";

function igHandle(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/instagram\.com\/([^/?]+)/i);
  return m ? m[1] : null;
}

type Artist = {
  id: string;
  name: string;
  slug: string;
  specialty: string | null;
  avatarUrl: string | null;
  instagramUrl: string | null;
};

type Props = {
  artists: Artist[];
  showHeader?: boolean;
};

export function ArtistsContent({ artists, showHeader = true }: Props) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-8">
      {showHeader && (
        <Section size="narrow">
          <ArtistsPageClient>
            <SectionLabel>{t("artists.label")}</SectionLabel>
            <SectionTitle as="h1" className="mt-3">
              {t("artists.title")}
            </SectionTitle>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-foreground-muted">
              {t("artists.description")}
            </p>
          </ArtistsPageClient>
        </Section>
      )}

      <Section>
        {artists.length === 0 ? (
          <p className="py-20 text-center text-foreground-muted">
            {t("artists.noArtists")}
          </p>
        ) : (
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.slug}`}
                className="group block overflow-hidden bg-card transition-colors hover:bg-card-hover"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ArtistAvatar
                    src={artist.avatarUrl}
                    alt={`${artist.name} — ${artist.specialty ?? "Tattoo Artist"} at Casper Tattoo Kaohsiung`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="border-t border-border p-6">
                  <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
                    {artist.name}
                  </h2>
                  <p className="mt-1 text-[13px] tracking-wide text-accent">
                    {artist.specialty || t("artists.tattooArtist")}
                  </p>
                  {igHandle(artist.instagramUrl) && (
                    <p className="mt-3 text-[13px] text-foreground-muted">
                      @{igHandle(artist.instagramUrl)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
