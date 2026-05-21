"use client";

import { HeroSection } from "./HeroSection";
import { ArtistShowcase } from "./ArtistShowcase";
import { HomeShopPreview } from "./HomeShopPreview";
import { BookingCTA } from "./BookingCTA";
import type { ShopProductCard } from "@/components/shop/ShopContent";

type Artist = {
  id: string;
  name: string;
  specialty: string | null;
  avatar_url: string | null;
  slug: string;
};

type Props = {
  artists?: Artist[];
  products?: ShopProductCard[];
  /** Gallery image URLs for hero carousel background */
  imageUrls?: string[];
};

export function ComingSoon({
  artists = [],
  products = [],
  imageUrls = [],
}: Props) {
  return (
    <>
      <HeroSection imageUrls={imageUrls} />
      <ArtistShowcase artists={artists} />
      <HomeShopPreview products={products} />
      <BookingCTA />
    </>
  );
}
