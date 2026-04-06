import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { ContactContent } from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Book a tattoo consultation at Tattoo Kaohsiung. Visit us at No. 18, Shijian Rd, Zuoying District, Kaohsiung City 813, or DM us on Instagram @tattookaohsiung.",
  alternates: {
    canonical: "/contact",
    languages: { en: "/contact", "zh-TW": "/contact", "x-default": "/contact" },
  },
  openGraph: {
    title: "Book a Consultation | Tattoo Kaohsiung",
    description:
      "Book your tattoo session at our studio in Zuoying District, Kaohsiung. Specialising in realism and fine-line art.",
    url: "/contact",
  },
};

export default async function ContactPage() {
  const artists = await prisma.artist.findMany({
    where: { status: { not: "INACTIVE" } },
    select: { id: true, name: true },
    orderBy: { sortOrder: "asc" },
  });

  return <ContactContent artists={artists} />;
}
