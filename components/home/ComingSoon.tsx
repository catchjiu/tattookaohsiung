"use client";

import { HeroSection } from "./HeroSection";
import { ArtistShowcase } from "./ArtistShowcase";
import { BookingCTA } from "./BookingCTA";

type Artist = {
  id: string;
  name: string;
  specialty: string | null;
  avatar_url: string | null;
  slug: string;
};

type Props = {
  artists?: Artist[];
  /** Gallery image URLs for hero carousel background */
  imageUrls?: string[];
};

export function ComingSoon({ artists = [], imageUrls = [] }: Props) {
  return (
    <>
      <HeroSection imageUrls={imageUrls} />
      <ArtistShowcase artists={artists} />
      <BookingCTA />
    </>
  );
}
