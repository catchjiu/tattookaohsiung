"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/ui";
import { FadeInUp } from "@/components/ui/motion";

function getArtistName(item: { artists?: unknown }): string {
  const a = item.artists;
  if (!a) return "—";
  if (Array.isArray(a)) return (a[0] as { name?: string })?.name ?? "—";
  return (a as { name?: string })?.name ?? "—";
}

const BLUR_PLACEHOLDER =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBEQACEQADAD8A0p//2Q==";

type Artwork = {
  id: string;
  title: string | null;
  image_url: string;
  tags: string[] | null;
  artists?: { name: string } | { name: string }[] | null;
};

type Props = {
  artworks: Artwork[];
  showArtistName?: boolean;
};

export function GalleryGrid({ artworks, showArtistName = true }: Props) {
  const [lightboxItem, setLightboxItem] = useState<Artwork | null>(null);

  return (
    <>
      <div className="mt-20 columns-2 gap-8 sm:columns-3 lg:columns-4">
        {artworks.length === 0 ? (
          <p className="col-span-full py-20 text-center text-foreground-muted">
            No artwork yet. Check back soon.
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
                  onClick={() => setLightboxItem(item)}
                  className="group relative block w-full cursor-pointer text-left"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-card-hover">
                    <Image
                      src={item.image_url}
                      alt={item.title || "Artwork"}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                    />
                  </div>
                  <div className="mt-4">
                    <div className="font-serif text-[15px] font-medium text-foreground">
                      {item.title || "Untitled"}
                    </div>
                    {showArtistName && (
                      <div className="mt-1 text-[13px] text-foreground-muted">
                        {getArtistName(item)}
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
          alt={lightboxItem.title || "Artwork"}
          isOpen={!!lightboxItem}
          onClose={() => setLightboxItem(null)}
        />
      )}
    </>
  );
}
