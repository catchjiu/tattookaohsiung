import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { ArtistsPageClient } from "@/components/artists/ArtistsPageClient";
import { Section, SectionLabel, SectionTitle } from "@/components/ui";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80";

function igHandle(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/instagram\.com\/([^/?]+)/i);
  return m ? m[1] : null;
}

export default async function ArtistsPage() {
  const artists = await prisma.artist.findMany({
    where: { status: { not: "INACTIVE" } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="mx-auto max-w-7xl px-6">
      <Section size="narrow">
        <ArtistsPageClient>
          <SectionLabel>Studio</SectionLabel>
          <SectionTitle as="h1" className="mt-2">
            Our Artists
          </SectionTitle>
          <p className="mt-4 max-w-2xl text-foreground-muted">
            Meet the master artists behind our studio. Each brings a unique
            vision and decades of experience to every piece.
          </p>
        </ArtistsPageClient>
      </Section>

      <Section>
        {artists.length === 0 ? (
          <p className="text-center text-foreground-muted">
            No artists yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artists/${artist.slug}`}
                className="group block overflow-hidden rounded-sm border border-border bg-card transition-colors hover:border-accent hover:bg-card-hover"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  {artist.avatarUrl ? (
                    <Image
                      src={artist.avatarUrl}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={PLACEHOLDER}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />
                </div>
                <div className="relative p-6">
                  <h2 className="font-serif text-xl font-medium text-foreground">
                    {artist.name}
                  </h2>
                  <p className="mt-1 text-sm text-accent">
                    {artist.specialty || "Tattoo Artist"}
                  </p>
                  {igHandle(artist.instagramUrl) && (
                    <p className="mt-3 text-sm text-foreground-muted">
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
