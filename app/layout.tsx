import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Honkaku Tattoo Studio | Coming Soon",
  description:
    "Honkaku Tattoo Studio — Authentic traditional Japanese artistry meets contemporary ink. Coming soon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${playfair.variable} min-h-screen bg-[#121212] text-[#f5f5f5] antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
