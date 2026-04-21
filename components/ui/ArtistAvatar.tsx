"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80";

type Props = {
  src: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
};

export function ArtistAvatar({
  src,
  alt,
  className = "",
  fill,
  width = 400,
  height = 500,
  sizes,
}: Props) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    // If the avatar URL changes (e.g. user uploads a new photo),
    // allow the new image to attempt loading even if the previous one failed.
    setFailed(false);
  }, [src]);
  const imgSrc = !src || failed ? PLACEHOLDER : src;

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={className}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
