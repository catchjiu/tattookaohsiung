"use client";

import { FadeInUp } from "@/components/ui/motion";

type Props = {
  children: React.ReactNode;
};

export function ArtistsPageClient({ children }: Props) {
  return <FadeInUp>{children}</FadeInUp>;
}
