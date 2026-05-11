import type { Metadata } from "next";
import { CheckoutForm } from "@/components/shop/CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "結帳 — Casper Tattoo 高雄刺青",
  description: "完成商店訂單。",
  alternates: {
    canonical: "/zh-TW/checkout",
    languages: {
      en: "/checkout",
      "zh-TW": "/zh-TW/checkout",
      "x-default": "/checkout",
    },
  },
  robots: { index: false, follow: true },
};

export default function CheckoutPageZhTW() {
  return <CheckoutForm />;
}
