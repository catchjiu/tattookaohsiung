import type { Metadata } from "next";
import { CartContent } from "@/components/shop/CartContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "購物車 — Casper Tattoo 高雄刺青",
  description: "檢視購物車後結帳。",
  alternates: {
    canonical: "/zh-TW/cart",
    languages: { en: "/cart", "zh-TW": "/zh-TW/cart", "x-default": "/cart" },
  },
  robots: { index: false, follow: true },
};

export default function CartPageZhTW() {
  return <CartContent />;
}
