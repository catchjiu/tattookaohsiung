"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80";

type Artist = {
  id: string;
  name: string;
  specialty: string | null;
  avatar_url: string | null;
  slug: string;
};

type Props = {
  artists: Artist[];
};

export function ArtistShowcase({ artists }: Props) {
  const displayArtists =
    artists.length > 0
      ? artists
      : [
          {
            id: "1",
            name: "Artist One",
            specialty: "Traditional & Fine-line",
            avatar_url: PLACEHOLDER_IMAGE,
            slug: "artist-one",
          },
          {
            id: "2",
            name: "Artist Two",
            specialty: "Realism & Blackwork",
            avatar_url: PLACEHOLDER_IMAGE,
            slug: "artist-two",
          },
          {
            id: "3",
            name: "Artist Three",
            specialty: "Japanese & Neo-traditional",
            avatar_url: PLACEHOLDER_IMAGE,
            slug: "artist-three",
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
            Studio
          </p>
          <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Our Artists
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-foreground-muted">
            Each artist brings a unique vision and decades of experience to every
            piece.
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
              <Link href={`/artists/${artist.slug}`} className="block">
                <div className="relative overflow-hidden bg-card-hover">
                  <div className="aspect-[4/5] overflow-hidden">
                    {artist.avatar_url ? (
                      <img
                        src={artist.avatar_url}
                        alt={artist.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <Image
                        src={PLACEHOLDER_IMAGE}
                        alt={artist.name}
                        width={400}
                        height={500}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <div className="border-t border-border bg-background p-6 transition-colors group-hover:bg-card-hover">
                    <h3 className="font-serif text-xl font-medium tracking-tight text-foreground">
                      {artist.name}
                    </h3>
                    <p className="mt-1 text-[13px] tracking-wide text-accent">
                      {artist.specialty || "Tattoo Artist"}
                    </p>
                    <span className="mt-4 inline-block text-[12px] font-medium tracking-[0.15em] uppercase text-foreground-muted transition-colors group-hover:text-accent">
                      View Portfolio →
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
            href="/artists"
            className="inline-block border-b border-accent pb-1 text-[13px] font-medium tracking-[0.15em] uppercase text-accent transition-colors hover:text-foreground"
          >
            View All Artists
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
