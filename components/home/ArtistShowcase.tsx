"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArtistAvatar } from "@/components/ui/ArtistAvatar";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  artistProfileHref,
  PERMANENT_MAKEUP_JOB,
  type ArtistJobValue,
} from "@/lib/artist-job";

type Artist = {
  id: string;
  name: string;
  specialty: string | null;
  avatar_url: string | null;
  slug: string;
  job: ArtistJobValue;
};

type Props = {
  artists: Artist[];
};

export function ArtistShowcase({ artists }: Props) {
  const { t, locale } = useLanguage();
  const artistsPath = locale === "zh-TW" ? "/zh-TW/artists" : "/artists";
  const displayArtists =
    artists.length > 0
      ? artists
      : [
          {
            id: "1",
            name: "Artist One",
            specialty: "Traditional & Fine-line",
            avatar_url: null,
            slug: "artist-one",
            job: "TATTOO_ARTIST" as const,
          },
          {
            id: "2",
            name: "Artist Two",
            specialty: "Realism & Blackwork",
            avatar_url: null,
            slug: "artist-two",
            job: "TATTOO_ARTIST" as const,
          },
          {
            id: "3",
            name: "Artist Three",
            specialty: "Japanese & Neo-traditional",
            avatar_url: null,
            slug: "artist-three",
            job: "TATTOO_ARTIST" as const,
          },
        ];

  return (
    <section className="border-t border-border bg-card py-32 md:py-40">
      <div className="mx-auto max-w-6xl px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-foreground-muted">
            {t("artistShowcase.label")}
          </p>
          <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t("artistShowcase.title")}
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-foreground-muted">
            {t("artistShowcase.description")}
          </p>
        </motion.div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {displayArtists.map((artist, i) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group"
            >
              <Link
                href={artistProfileHref(artist, locale)}
                className="block"
              >
                <div className="relative overflow-hidden bg-card-hover">
                  <div className="aspect-[4/5] overflow-hidden">
                    <ArtistAvatar
                      src={artist.avatar_url}
                      alt={artist.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="border-t border-border bg-background p-6 transition-colors group-hover:bg-card-hover">
                    <h3 className="font-serif text-xl font-medium tracking-tight text-foreground">
                      {artist.name}
                    </h3>
                    <p className="mt-1 text-[13px] tracking-wide text-accent">
                      {artist.specialty ||
                        (artist.job === PERMANENT_MAKEUP_JOB
                          ? t("permanentMakeup.artistRole")
                          : t("artistShowcase.tattooArtist"))}
                    </p>
                    <span className="mt-4 inline-block text-[12px] font-medium tracking-[0.15em] uppercase text-foreground-muted transition-colors group-hover:text-accent">
                      {t("artistShowcase.viewPortfolio")}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            href={artistsPath}
            className="inline-block border-b border-accent pb-1 text-[13px] font-medium tracking-[0.15em] uppercase text-accent transition-colors hover:text-foreground"
          >
            {t("artistShowcase.viewAll")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
