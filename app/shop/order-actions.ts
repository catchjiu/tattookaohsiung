"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import type { CartLine } from "@/lib/cart-storage";
import { parseCartJson } from "@/lib/cart-storage";

const CHECKOUT_LIMIT = 8; // per minute per IP

export type CartProductRow = {
  id: string;
  slug: string;
  name: string;
  nameZh: string | null;
  priceLabel: string | null;
  priceTwd: number | null;
  imageUrl: string | null;
};

export async function getShopCartPreview(
  lines: CartLine[]
): Promise<{ products: CartProductRow[]; quantities: Record<string, number> }> {
  if (!lines.length) return { products: [], quantities: {} };

  const ids = [...new Set(lines.map((l) => l.productId))];
  const products = await prisma.shopProduct.findMany({
    where: { id: { in: ids }, isPublished: true },
    select: {
      id: true,
      slug: true,
      name: true,
      nameZh: true,
      priceLabel: true,
      priceTwd: true,
      imageUrl: true,
    },
  });

  const quantities: Record<string, number> = {};
  for (const l of lines) {
    quantities[l.productId] = l.quantity;
  }

  const pos = new Map(ids.map((id, i) => [id, i]));
  const sorted = [...products].sort(
    (a, b) => (pos.get(a.id) ?? 0) - (pos.get(b.id) ?? 0)
  );

  return { products: sorted, quantities };
}

export async function submitShopOrder(formData: FormData) {
  const headersList = await headers();
  const clientId = getClientIdentifier(headersList);
  const limit = rateLimit(clientId, "shop-checkout", CHECKOUT_LIMIT);
  if (!limit.success) {
    return {
      error: `Too many requests. Try again in ${limit.retryAfter} seconds.`,
    };
  }

  const customerName = (formData.get("customer_name") as string)?.trim();
  const customerEmail = (formData.get("customer_email") as string)?.trim();
  const customerPhone = (formData.get("customer_phone") as string)?.trim() || null;
  const shippingAddress =
    (formData.get("shipping_address") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;
  let cartLines: CartLine[] = [];

  try {
    const raw = JSON.parse((formData.get("cart_json") as string) || "[]");
    cartLines = parseCartJson(raw);
  } catch {
    return { error: "Invalid cart data." };
  }

  if (!customerName || !customerEmail) {
    return { error: "Name and email are required." };
  }

  if (!cartLines.length) {
    return { error: "Your cart is empty." };
  }

  const ids = [...new Set(cartLines.map((l) => l.productId))];
  const dbProducts = await prisma.shopProduct.findMany({
    where: { id: { in: ids }, isPublished: true },
  });

  if (dbProducts.length !== ids.length) {
    return { error: "Some products are no longer available. Refresh your cart." };
  }

  const byId = new Map(dbProducts.map((p) => [p.id, p]));
  const items: {
    productId: string;
    productSlug: string;
    nameSnapshot: string;
    priceLabelSnapshot: string | null;
    unitPriceTwd: number | null;
    quantity: number;
    lineTotalTwd: number | null;
  }[] = [];

  let totalTwd: number | null = 0;

  for (const line of cartLines) {
    const p = byId.get(line.productId);
    if (!p) continue;
    const qty = Math.min(99, Math.max(1, Math.floor(line.quantity)));
    const unit = p.priceTwd;
    const lineTotal =
      unit != null && Number.isFinite(unit) ? unit * qty : null;

    items.push({
      productId: p.id,
      productSlug: p.slug,
      nameSnapshot: p.name,
      priceLabelSnapshot: p.priceLabel,
      unitPriceTwd: unit,
      quantity: qty,
      lineTotalTwd: lineTotal,
    });

    if (lineTotal != null && totalTwd != null) {
      totalTwd += lineTotal;
    } else {
      totalTwd = null;
    }
  }

  if (!items.length) {
    return { error: "Could not build order." };
  }

  try {
    const order = await prisma.shopOrder.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        notes,
        totalTwd,
        items: {
          create: items.map((i) => ({
            productId: i.productId,
            productSlug: i.productSlug,
            nameSnapshot: i.nameSnapshot,
            priceLabelSnapshot: i.priceLabelSnapshot,
            unitPriceTwd: i.unitPriceTwd,
            quantity: i.quantity,
            lineTotalTwd: i.lineTotalTwd,
          })),
        },
      },
    });

    await sendShopOrderEmails(order.id, customerEmail, customerName, items, totalTwd);

    revalidatePath("/admin/shop/orders");

    return { success: true, orderId: order.id };
  } catch (err) {
    console.error("[ShopOrder]", err);
    return {
      error: err instanceof Error ? err.message : "Order could not be placed.",
    };
  }
}

async function sendShopOrderEmails(
  orderId: string,
  customerEmail: string,
  customerName: string,
  items: {
    nameSnapshot: string;
    priceLabelSnapshot: string | null;
    quantity: number;
    lineTotalTwd: number | null;
  }[],
  totalTwd: number | null
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "orders@yourdomain.com";
  const studioTo = process.env.SHOP_ORDER_EMAIL || process.env.ADMIN_EMAIL;

  const linesHtml = items
    .map(
      (i) =>
        `<tr><td>${escapeHtml(i.nameSnapshot)}</td><td>${i.quantity}</td><td>${i.priceLabelSnapshot ? escapeHtml(i.priceLabelSnapshot) : "—"}</td><td>${i.lineTotalTwd != null ? `NT$ ${i.lineTotalTwd}` : "—"}</td></tr>`
    )
    .join("");
  const totalLine =
    totalTwd != null
      ? `<p><strong>Total:</strong> NT$ ${totalTwd}</p>`
      : `<p><strong>Total:</strong> We will confirm the amount (some items need a custom quote).</p>`;

  const customerHtml = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
      <p>Hi ${escapeHtml(customerName)},</p>
      <p>Thank you for your order. We've received it and will contact you shortly to confirm payment and pickup or shipping.</p>
      <p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0;font-size:14px;">
        <thead><tr><th align="left">Item</th><th align="right">Qty</th><th align="right">Price</th><th align="right">Line</th></tr></thead>
        <tbody>${linesHtml}</tbody>
      </table>
      ${totalLine}
      <p>— Casper Tattoo Kaohsiung</p>
    </div>
  `;

  if (apiKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from,
          to: customerEmail,
          subject: `Order received — ${orderId.slice(0, 8)}`,
          html: customerHtml,
        }),
      });
    } catch (e) {
      console.error("[ShopOrder] customer email failed", e);
    }

    if (studioTo) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from,
            to: studioTo,
            subject: `[Shop] New order ${orderId.slice(0, 8)} — ${escapeHtml(customerName)}`,
            html: `
              <p>New shop order.</p>
              <p><strong>ID:</strong> ${escapeHtml(orderId)}</p>
              <p><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
              <table style="border-collapse:collapse;width:100%;">${linesHtml}</table>
              ${totalLine}
            `,
          }),
        });
      } catch (e) {
        console.error("[ShopOrder] studio email failed", e);
      }
    }
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
