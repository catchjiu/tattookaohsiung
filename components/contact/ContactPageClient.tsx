"use client";

import { FadeInUp } from "@/components/ui/motion";

type Props = {
  children: React.ReactNode;
};

export function ContactPageClient({ children }: Props) {
  return <FadeInUp>{children}</FadeInUp>;
}
