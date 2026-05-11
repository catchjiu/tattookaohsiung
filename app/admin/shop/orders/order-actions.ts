"use server";

import { revalidatePath } from "next/cache";
import { ShopOrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function updateShopOrderStatus(
  orderId: string,
  status: ShopOrderStatus
) {
  const allowed = new Set(Object.values(ShopOrderStatus));
  if (!allowed.has(status)) {
    return { error: "Invalid status" };
  }
  try {
    await prisma.shopOrder.update({
      where: { id: orderId },
      data: { status },
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update order",
    };
  }
  revalidatePath("/admin/shop/orders");
  return { success: true };
}
