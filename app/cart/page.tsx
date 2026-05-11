import type { Metadata } from "next";
import { CartContent } from "@/components/shop/CartContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cart — Casper Tattoo Kaohsiung",
  description: "Review items in your cart before checkout.",
  alternates: {
    canonical: "/cart",
    languages: { en: "/cart", "zh-TW": "/zh-TW/cart", "x-default": "/cart" },
  },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartContent />;
}
