import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { ContactContent } from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "Book a Professional Tattoo Artist in Kaohsiung | Casper Tattoo",
  description:
    "Book a consultation with a professional tattoo artist in Kaohsiung. Visit Casper Tattoo at No. 18, Shijian Rd, Zuoying District, Kaohsiung 813 — specialists in realistic tattoos and fine-line art. 高雄刺青預約｜高雄專業刺青師諮詢預約。",
  keywords: [
    "book tattoo Kaohsiung",
    "tattoo consultation Kaohsiung",
    "professional tattoo artist Kaohsiung",
    "professional tattoo Kaohsiung",
    "Kaohsiung tattoo booking",
    "高雄刺青預約",
    "高雄刺青諮詢",
    "高雄專業刺青師預約",
  ],
  alternates: {
    canonical: "/contact",
    languages: { en: "/contact", "zh-TW": "/zh-TW/contact", "x-default": "/contact" },
  },
  openGraph: {
    title: "Book a Professional Tattoo Artist in Kaohsiung | Casper Tattoo",
    description:
      "Book your session with Kaohsiung's professional tattoo artists — specialists in realistic tattoos and fine-line art in Zuoying District.",
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
