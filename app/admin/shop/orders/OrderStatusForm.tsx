"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShopOrderStatus } from "@prisma/client";
import { updateShopOrderStatus } from "./order-actions";

type Props = {
  orderId: string;
  currentStatus: ShopOrderStatus;
};

const STATUS_OPTIONS: ShopOrderStatus[] = [
  ShopOrderStatus.PENDING,
  ShopOrderStatus.CONFIRMED,
  ShopOrderStatus.PAID,
  ShopOrderStatus.SHIPPED,
  ShopOrderStatus.CANCELLED,
];

export function OrderStatusForm({ orderId, currentStatus }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={currentStatus}
      disabled={pending}
      onChange={(e) => {
        const status = e.target.value as ShopOrderStatus;
        startTransition(async () => {
          await updateShopOrderStatus(orderId, status);
          router.refresh();
        });
      }}
      className="rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
