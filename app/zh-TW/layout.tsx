import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

/**
 * Nested layout for all /zh-TW/* routes.
 * Overrides the root layout's metadata with Traditional Chinese defaults.
 * The <html lang="zh-TW"> is set by the root layout (reads x-locale header
 * from middleware), so we only need to provide metadata here.
 */
export const metadata: Metadata = {
  title: {
    default: "Casper Tattoo Kaohsiung | 高雄專業刺青工作室｜寫實刺青・細線刺青",
    template: "%s | Casper Tattoo Kaohsiung 高雄刺青",
  },
  description:
    "高雄刺青首選｜Casper Tattoo 高雄專業刺青工作室，專精高雄寫實刺青與細線刺青。高雄專業刺青師 Casper 與 Stan，位於高雄市左營區。",
  keywords: [
    "高雄刺青",
    "高雄紋身",
    "高雄寫實刺青",
    "高雄專業刺青",
    "高雄專業刺青師",
    "高雄刺青工作室",
    "高雄細線刺青",
    "左營刺青",
    "寫實刺青高雄",
    "刺青高雄推薦",
    "tattoo Kaohsiung",
    "realistic tattoo Kaohsiung",
    "professional tattoo Kaohsiung",
  ],
  alternates: {
    canonical: "/zh-TW",
    languages: {
      en: "/",
      "zh-TW": "/zh-TW",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    alternateLocale: "en_US",
    siteName: "Casper Tattoo Kaohsiung",
    url: `${SITE_URL}/zh-TW`,
    title: "Casper Tattoo Kaohsiung | 高雄專業刺青工作室",
    description:
      "高雄頂級專業刺青工作室，專精寫實刺青與細線刺青。高雄刺青師 Casper 與 Stan。",
  },
};

export default function ZhTWLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
