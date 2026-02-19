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

export const metadata: Metadata = {
  title: "Tattoo Kaohsiung | Coming Soon",
  description:
    "Tattoo Kaohsiung — Precision realism meets contemporary ink. Kaohsiung.",
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
