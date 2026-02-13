"use client";

import { SectionLabel, SectionTitle } from "@/components/ui";
import { FadeInUp } from "@/components/ui/motion";

export function GalleryHeader() {
  return (
    <FadeInUp>
      <SectionLabel>Portfolio</SectionLabel>
      <SectionTitle as="h1" className="mt-2">
        Gallery
      </SectionTitle>
      <p className="mt-4 max-w-2xl text-foreground-muted">
        Browse our portfolio of tattoo artistry. Click any image to view in
        full.
      </p>
    </FadeInUp>
  );
}
