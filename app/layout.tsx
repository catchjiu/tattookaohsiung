import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tattookaohsiung.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Casper Tattoo Kaohsiung | Precision Realism & Fine-Line Studio Taiwan",
    template: "%s | Casper Tattoo Kaohsiung",
  },
  description:
    "Premier tattoo studio in Kaohsiung specializing in precision realism and single-needle fine-line art. Book a consultation with artists Casper and Stan in Zuoying District.",
  keywords: [
    "tattoo Kaohsiung",
    "tattoo Taiwan",
    "realism tattoo",
    "fine-line tattoo",
    "portrait tattoo Taiwan",
    "tattoo tourism Taiwan",
    "best tattoo shop Kaohsiung",
    "刺青高雄",
    "紋身高雄",
    "高雄刺青工作室",
    "左營刺青",
    "寫實刺青",
    "細線刺青",
    "Zuoying tattoo studio",
    "tattoo artist Taiwan",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "zh-TW": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "zh_TW",
    siteName: "Casper Tattoo Kaohsiung",
    url: SITE_URL,
    title: "Casper Tattoo Kaohsiung | Precision Realism & Fine-Line Studio Taiwan",
    description:
      "Premier tattoo studio in Kaohsiung specializing in precision realism and single-needle fine-line art.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casper Tattoo Kaohsiung | Precision Realism & Fine-Line Studio Taiwan",
    description:
      "Premier tattoo studio in Kaohsiung specializing in precision realism and single-needle fine-line art.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${oswald.variable} min-h-screen bg-background text-foreground antialiased font-sans`}
      >
        <LanguageProvider>
          <div className="grain-overlay" aria-hidden />
          <Navbar />
          <main className="pt-16">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
