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
};

export function ComingSoon({ artists = [] }: Props) {
  return (
    <>
      <HeroSection />
      <ArtistShowcase artists={artists} />
      <BookingCTA />
    </>
  );
}
