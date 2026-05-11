import type { Metadata } from "next";
import { CheckoutSuccessContent } from "@/components/shop/CheckoutSuccessContent";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ order?: string }>;
};

export const metadata: Metadata = {
  title: "訂單已收到 — Casper Tattoo 高雄刺青",
  robots: { index: false, follow: true },
};

export default async function CheckoutSuccessPageZhTW({ searchParams }: Props) {
  const { order } = await searchParams;
  return <CheckoutSuccessContent orderId={order ?? null} />;
}
