import type { Metadata } from "next";
import { FaqContent } from "@/components/faq/FaqContent";

export const metadata: Metadata = {
  title: "刺青常見問題 — 價格、疼痛、保養 | Casper Tattoo 高雄刺青",
  description:
    "高雄刺青最常見的 15 個問題解答 — 價格、疼痛感、癒合時間、術後保養、年齡規定等，由 Casper Tattoo 高雄刺青工作室為您說明。",
  keywords: [
    "高雄刺青常見問題",
    "高雄刺青價格",
    "刺青會痛嗎",
    "刺青保養",
    "刺青癒合",
    "tattoo FAQ Kaohsiung",
  ],
  alternates: {
    canonical: "/zh-TW/faq",
    languages: { en: "/faq", "zh-TW": "/zh-TW/faq", "x-default": "/faq" },
  },
  openGraph: {
    title: "刺青常見問題 | Casper Tattoo 高雄刺青",
    description:
      "15 個最常見的刺青問題完整解答 — 價格、疼痛、癒合、保養與預約須知。",
    url: "/zh-TW/faq",
  },
};

export default function FaqPageZhTW() {
  return <FaqContent />;
}
