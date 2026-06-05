"use client";

import { HeroSection } from "./HeroSection";
import { ArtistShowcase } from "./ArtistShowcase";
import { HomeGalleryPreview } from "./HomeGalleryPreview";
import { HomeShopPreview } from "./HomeShopPreview";
import { BookingCTA } from "./BookingCTA";
import { FaqPreviewSection } from "./FaqPreviewSection";
import type { ReactNode } from "react";
import type { ShopProductCard } from "@/components/shop/ShopContent";
import type { ArtistJobValue } from "@/lib/artist-job";

type Artist = {
  id: string;
  name: string;
  specialty: string | null;
  avatar_url: string | null;
  slug: string;
  job: ArtistJobValue;
};

type GalleryPreviewArtwork = {
  id: string;
  title: string | null;
  image_url: string;
  image_urls?: string[];
  tags: string[] | null;
  artists?: { name: string; specialty?: string | null };
};

type Props = {
  artists?: Artist[];
  galleryArtworks?: GalleryPreviewArtwork[];
  products?: ShopProductCard[];
  /** Gallery image URLs for hero carousel background */
  imageUrls?: string[];
  /** Server-rendered slot (e.g. reviews + map) between shop and booking CTA */
  reviewsSlot?: ReactNode;
};

export function ComingSoon({
  artists = [],
  galleryArtworks = [],
  products = [],
  imageUrls = [],
  reviewsSlot,
}: Props) {
  return (
    <>
      <HeroSection imageUrls={imageUrls} />
      <ArtistShowcase artists={artists} />
      <HomeGalleryPreview artworks={galleryArtworks} />
      <HomeShopPreview products={products} />
      {reviewsSlot}
      <FaqPreviewSection />
      <BookingCTA />
    </>
  );
}
