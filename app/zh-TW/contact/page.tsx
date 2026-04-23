import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ContactContent } from "@/components/contact/ContactContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "高雄刺青預約｜預約高雄專業刺青師諮詢 — Casper Tattoo",
  description:
    "預約 Casper Tattoo 高雄專業刺青師諮詢。高雄刺青工作室地址：813 高雄市左營區實踐路 18 號。高雄刺青預約｜高雄刺青諮詢，Instagram @tattookaohsiung。",
  keywords: [
    "高雄刺青預約",
    "高雄刺青諮詢",
    "高雄專業刺青師預約",
    "高雄刺青",
    "刺青預約高雄",
    "book tattoo Kaohsiung",
    "professional tattoo artist Kaohsiung",
  ],
  alternates: {
    canonical: "/zh-TW/contact",
    languages: { en: "/contact", "zh-TW": "/zh-TW/contact", "x-default": "/contact" },
  },
  openGraph: {
    title: "高雄刺青預約｜Casper Tattoo 高雄刺青工作室",
    description: "預約高雄專業刺青師諮詢，寫實刺青與細線刺青。高雄市左營區。",
    url: "/zh-TW/contact",
    locale: "zh_TW",
  },
};

export default async function ZhTWContactPage() {
  const artists = await prisma.artist.findMany({
    where: { status: { not: "INACTIVE" } },
    select: { id: true, name: true },
    orderBy: { sortOrder: "asc" },
  });

  return <ContactContent artists={artists} />;
}
