import type { Metadata } from "next";
import { CheckoutForm } from "@/components/shop/CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout — Casper Tattoo Kaohsiung",
  description: "Complete your shop order — Casper Tattoo Kaohsiung.",
  alternates: {
    canonical: "/checkout",
    languages: {
      en: "/checkout",
      "zh-TW": "/zh-TW/checkout",
      "x-default": "/checkout",
    },
  },
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
