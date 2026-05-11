import type { Metadata } from "next";
import { CheckoutSuccessContent } from "@/components/shop/CheckoutSuccessContent";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ order?: string }>;
};

export const metadata: Metadata = {
  title: "Order received — Casper Tattoo Kaohsiung",
  robots: { index: false, follow: true },
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;
  return <CheckoutSuccessContent orderId={order ?? null} />;
}
