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
    <div className="mx-auto max-w-6xl px-8">
      <Section size="narrow">
        <ArtistsPageClient>
          <SectionLabel>Studio</SectionLabel>
          <SectionTitle as="h1" className="mt-3">
            Our Artists
          </SectionTitle>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-foreground-muted">
            Meet the master artists behind our studio. Each brings a unique
            vision and decades of experience to every piece.
          </p>
        </ArtistsPageClient>
      </Section>

      <Section>
        {artists.length === 0 ? (
          <p className="py-20 text-center text-foreground-muted">
            No artists yet. Check back soon.
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
                  {artist.avatarUrl ? (
                    <Image
                      src={artist.avatarUrl}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <Image
                      src={PLACEHOLDER}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <div className="border-t border-border p-6">
                  <h2 className="font-serif text-xl font-medium tracking-tight text-foreground">
                    {artist.name}
                  </h2>
                  <p className="mt-1 text-[13px] tracking-wide text-accent">
                    {artist.specialty || "Tattoo Artist"}
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
