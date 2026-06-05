import type { Metadata } from "next";
import { FaqContent } from "@/components/faq/FaqContent";

export const metadata: Metadata = {
  title: "Tattoo FAQ — Pricing, Pain, Aftercare & More | Casper Tattoo Kaohsiung",
  description:
    "Answers to the most frequently asked tattoo questions in Kaohsiung — pricing, pain, healing, aftercare, age requirements, and more from Casper Tattoo.",
  keywords: [
    "tattoo FAQ Kaohsiung",
    "tattoo cost Kaohsiung",
    "tattoo aftercare",
    "does tattoo hurt",
    "高雄刺青常見問題",
    "高雄刺青價格",
    "刺青保養",
  ],
  alternates: {
    canonical: "/faq",
    languages: { en: "/faq", "zh-TW": "/zh-TW/faq", "x-default": "/faq" },
  },
  openGraph: {
    title: "Tattoo FAQ | Casper Tattoo Kaohsiung",
    description:
      "15 frequently asked tattoo questions answered — pricing, pain, healing, aftercare, and booking in Kaohsiung.",
    url: "/faq",
  },
};

export default function FaqPage() {
  return <FaqContent />;
}
