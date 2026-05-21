"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/ui";
import { FadeInUp } from "@/components/ui/motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

function getArtistField<K extends "name" | "specialty">(
  item: { artists?: unknown },
  field: K
): string {
  const a = item.artists;
  if (!a) return "";
  const entry = Array.isArray(a)
    ? (a[0] as Record<string, string | null | undefined>)
    : (a as Record<string, string | null | undefined>);
  return entry?.[field] ?? "";
}

function buildAlt(item: { title?: string | null; artists?: unknown }): string {
  const artist = getArtistField(item, "name");
  const specialty = getArtistField(item, "specialty");
  const studioSuffix = "Casper Tattoo Kaohsiung";

  // e.g. "Portrait realism tattoo by Casper at Casper Tattoo Kaohsiung"
  // or   "Dragon sleeve — Fine-line tattoo by Stan at Casper Tattoo Kaohsiung"
  const stylePart = specialty ? `${specialty} tattoo` : "tattoo";

  if (item.title && artist)
    return `${item.title} — ${stylePart} by ${artist} at ${studioSuffix}`;
  if (item.title) return `${item.title} — ${stylePart} at ${studioSuffix}`;
  if (artist) return `${stylePart} by ${artist} at ${studioSuffix}`;
  return `Tattoo artwork at ${studioSuffix}`;
}

const BLUR_PLACEHOLDER =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQADAD8A0p//2Q==";

type ArtistMeta = { name: string; specialty?: string | null };

type Artwork = {
  id: string;
  title: string | null;
  image_url: string;
  image_urls?: string[];
  tags: string[] | null;
  artists?: ArtistMeta | ArtistMeta[] | null;
};

type Props = {
  artworks: Artwork[];
  showArtistName?: boolean;
};

export function GalleryGrid({ artworks, showArtistName = true }: Props) {
  const { t } = useLanguage();
  const [lightboxItem, setLightboxItem] = useState<Artwork | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  function openLightbox(item: Artwork) {
    setLightboxItem(item);
    setLightboxIndex(0);
  }

  function imagesForItem(item: Artwork): string[] {
    if (item.image_urls?.length) return item.image_urls;
    return item.image_url ? [item.image_url] : [];
  }

  return (
    <>
      <div className="mt-20 columns-2 gap-8 sm:columns-3 lg:columns-4">
        {artworks.length === 0 ? (
          <p className="col-span-full py-20 text-center text-foreground-muted">
            {t("gallery.noArtwork")}
          </p>
        ) : (
          artworks.map((item, i) => (
            <FadeInUp
              key={item.id}
              delay={i * 0.04}
              amount={0.1}
              className="mb-8 break-inside-avoid"
            >
              <div>
                <button
                  type="button"
                  onClick={() => openLightbox(item)}
                  className="group relative block w-full cursor-pointer text-left touch-manipulation"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-card-hover">
                    <Image
                      src={item.image_url}
                      alt={buildAlt(item)}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                      loading="lazy"
                    />
                    {imagesForItem(item).length > 1 ? (
                      <span className="absolute bottom-2 right-2 rounded bg-charcoal/75 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white/90">
                        +{imagesForItem(item).length - 1}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4">
                    <div className="font-serif text-[15px] font-medium text-foreground">
                      {item.title || t("gallery.untitled")}
                    </div>
                    {showArtistName && (
                      <div className="mt-1 text-[13px] text-foreground-muted">
                        {getArtistField(item, "name") || "—"}
                      </div>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] tracking-wide text-accent">
                        {item.tags.map((tag: string) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </FadeInUp>
          ))
        )}
      </div>

      {lightboxItem && (
        <Lightbox
          src={lightboxItem.image_url}
          alt={buildAlt(lightboxItem)}
          images={imagesForItem(lightboxItem)}
          initialIndex={lightboxIndex}
          isOpen={!!lightboxItem}
          onClose={() => setLightboxItem(null)}
        />
      )}
    </>
  );
}
