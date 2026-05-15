"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import type { CartLine } from "@/lib/cart-storage";
import {
  cartLineKey,
  normalizeCartSize,
  parseCartJson,
} from "@/lib/cart-storage";
import { coerceSizeOptions } from "@/lib/shop-size-options";
import { SHOP_BANK_TRANSFER_DISPLAY } from "@/lib/shop-bank-transfer";
import { stockCeilingForLine, type SizeStockRow } from "@/lib/shop-stock";

const CHECKOUT_LIMIT = 8; // per minute per IP

const STOCK_ERROR_MSG =
  "Not enough stock for one or more items. Refresh your cart and try again. / 部分商品庫存不足，請重新整理購物車後再試。";

function variantCartKey(productId: string, size: string | null): string {
  return `${productId}\x1f${size ?? ""}`;
}

export type CartPreviewLine = {
  lineKey: string;
  productId: string;
  slug: string;
  name: string;
  nameZh: string | null;
  priceLabel: string | null;
  priceTwd: number | null;
  imageUrl: string | null;
  size: string | null;
  quantity: number;
  /** Max purchasable for this line (null = unlimited) */
  stockQuantity: number | null;
  qtyForVariantInCart: number;
  exceedsStock: boolean;
};

export async function getShopCartPreview(
  lines: CartLine[]
): Promise<CartPreviewLine[]> {
  if (!lines.length) return [];

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
      sizeOptions: true,
      stockQuantity: true,
      sizeStockRows: { select: { size: true, quantity: true } },
    },
  });

  const byId = new Map(products.map((p) => [p.id, p]));

  const qtyByVariant = new Map<string, number>();
  for (const cl of lines) {
    const p = byId.get(cl.productId);
    if (!p) continue;
    const allowed = new Set(coerceSizeOptions(p.sizeOptions as unknown));
    const sz = normalizeCartSize(cl.size);
    if (allowed.size > 0) {
      if (!sz || !allowed.has(sz)) continue;
    } else if (sz) {
      continue;
    }
    const q = Math.min(99, Math.max(1, Math.floor(cl.quantity)));
    const key = variantCartKey(cl.productId, sz);
    qtyByVariant.set(key, (qtyByVariant.get(key) ?? 0) + q);
  }

  const out: CartPreviewLine[] = [];

  for (const line of lines) {
    const p = byId.get(line.productId);
    if (!p) continue;
    const allowed = new Set(coerceSizeOptions(p.sizeOptions as unknown));
    const sz = normalizeCartSize(line.size);
    if (allowed.size > 0) {
      if (!sz || !allowed.has(sz)) continue;
    } else if (sz) {
      continue;
    }

    const sizeStocks: SizeStockRow[] = p.sizeStockRows.map((r) => ({
      size: r.size,
      quantity: r.quantity,
    }));

    const ceiling = stockCeilingForLine({
      sizeOptions: p.sizeOptions,
      stockQuantity: p.stockQuantity,
      sizeStocks,
      cartSize: sz,
    });

    if (ceiling != null && ceiling <= 0) continue;

    const vKey = variantCartKey(p.id, sz);
    const qtyThisVariant = qtyByVariant.get(vKey) ?? 0;
    const exceedsStock =
      ceiling != null && qtyThisVariant > ceiling;

    out.push({
      lineKey: cartLineKey(line),
      productId: p.id,
      slug: p.slug,
      name: p.name,
      nameZh: p.nameZh,
      priceLabel: p.priceLabel,
      priceTwd: p.priceTwd,
      imageUrl: p.imageUrl,
      size: sz,
      quantity: Math.min(99, Math.max(1, Math.floor(line.quantity))),
      stockQuantity: ceiling,
      qtyForVariantInCart: qtyThisVariant,
      exceedsStock,
    });
  }

  return out;
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
  const customerPhone =
    (formData.get("customer_phone") as string)?.trim() || null;
  const shippingAddress =
    (formData.get("shipping_address") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;
  const transferRaw =
    (formData.get("transfer_sender_last_five") as string)?.trim() ?? "";
  const transferSenderLastFive = transferRaw.replace(/\D/g, "");
  if (transferSenderLastFive.length !== 5) {
    return {
      error:
        "Enter exactly 5 digits: the last 5 digits of the bank account you transferred from.",
    };
  }
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
    include: {
      sizeStockRows: { select: { size: true, quantity: true } },
    },
  });

  if (dbProducts.length !== ids.length) {
    return {
      error: "Some products are no longer available. Refresh your cart.",
    };
  }

  const byId = new Map(dbProducts.map((p) => [p.id, p]));
  const items: {
    productId: string;
    productSlug: string;
    nameSnapshot: string;
    sizeSnapshot: string | null;
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
    const sz = normalizeCartSize(line.size);
    const allowed = new Set(coerceSizeOptions(p.sizeOptions as unknown));

    if (allowed.size > 0) {
      if (!sz || !allowed.has(sz)) {
        return {
          error: `Choose a valid size for "${p.name}" or remove it from your cart.`,
        };
      }
    } else if (sz) {
      return {
        error: `Refresh your cart — "${p.name}" no longer uses size options.`,
      };
    }

    const unit = p.priceTwd;
    const lineTotal =
      unit != null && Number.isFinite(unit) ? unit * qty : null;

    items.push({
      productId: p.id,
      productSlug: p.slug,
      nameSnapshot: p.name,
      sizeSnapshot: sz,
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

  const variantNeed = new Map<string, number>();
  for (const i of items) {
    const key = variantCartKey(i.productId, i.sizeSnapshot);
    variantNeed.set(key, (variantNeed.get(key) ?? 0) + i.quantity);
  }

  for (const [key, needed] of variantNeed) {
    const tab = "\x1f";
    const tabIdx = key.indexOf(tab);
    const pid = tabIdx === -1 ? key : key.slice(0, tabIdx);
    const sizePart = tabIdx === -1 ? "" : key.slice(tabIdx + tab.length);
    const sizeNorm = sizePart || null;

    const p = byId.get(pid);
    if (!p) continue;

    const sizeStocks: SizeStockRow[] = p.sizeStockRows.map((r) => ({
      size: r.size,
      quantity: r.quantity,
    }));

    const ceiling = stockCeilingForLine({
      sizeOptions: p.sizeOptions,
      stockQuantity: p.stockQuantity,
      sizeStocks,
      cartSize: sizeNorm,
    });

    if (ceiling != null && ceiling < needed) {
      return { error: STOCK_ERROR_MSG };
    }
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.shopOrder.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          transferSenderLastFive,
          notes,
          totalTwd,
          items: {
            create: items.map((i) => ({
              productId: i.productId,
              productSlug: i.productSlug,
              nameSnapshot: i.nameSnapshot,
              sizeSnapshot: i.sizeSnapshot,
              priceLabelSnapshot: i.priceLabelSnapshot,
              unitPriceTwd: i.unitPriceTwd,
              quantity: i.quantity,
              lineTotalTwd: i.lineTotalTwd,
            })),
          },
        },
      });

      for (const [key, needed] of variantNeed) {
        const tab = "\x1f";
        const tabIdx = key.indexOf(tab);
        const productId = tabIdx === -1 ? key : key.slice(0, tabIdx);
        const sizePart = tabIdx === -1 ? "" : key.slice(tabIdx + tab.length);
        const sizeNorm = sizePart || null;

        const p = byId.get(productId);
        if (!p) continue;

        const hasSizes =
          coerceSizeOptions(p.sizeOptions as unknown).length > 0;

        if (hasSizes) {
          if (!sizeNorm) continue;
          const tracked = await tx.shopProductSizeStock.findUnique({
            where: {
              productId_size: { productId, size: sizeNorm },
            },
            select: { id: true },
          });
          if (!tracked) continue;

          const updated = await tx.shopProductSizeStock.updateMany({
            where: {
              productId,
              size: sizeNorm,
              quantity: { gte: needed },
            },
            data: { quantity: { decrement: needed } },
          });
          if (updated.count !== 1) {
            throw new Error("INSUFFICIENT_STOCK");
          }
        } else {
          const row = await tx.shopProduct.findUnique({
            where: { id: productId },
            select: { stockQuantity: true },
          });
          if (!row || row.stockQuantity == null) continue;
          const updated = await tx.shopProduct.updateMany({
            where: { id: productId, stockQuantity: { gte: needed } },
            data: { stockQuantity: { decrement: needed } },
          });
          if (updated.count !== 1) {
            throw new Error("INSUFFICIENT_STOCK");
          }
        }
      }

      return created;
    });

    await sendShopOrderEmails(
      order.id,
      customerEmail,
      customerName,
      items,
      totalTwd,
      transferSenderLastFive
    );

    revalidatePath("/admin/shop/orders");
    revalidatePath("/admin/shop");
    revalidatePath("/shop");
    revalidatePath("/zh-TW/shop");

    return { success: true, orderId: order.id };
  } catch (err) {
    console.error("[ShopOrder]", err);
    if (err instanceof Error && err.message === "INSUFFICIENT_STOCK") {
      return { error: STOCK_ERROR_MSG };
    }
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
    sizeSnapshot: string | null;
    priceLabelSnapshot: string | null;
    quantity: number;
    lineTotalTwd: number | null;
  }[],
  totalTwd: number | null,
  transferSenderLastFive: string
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "orders@yourdomain.com";
  const studioTo = process.env.SHOP_ORDER_EMAIL || process.env.ADMIN_EMAIL;

  const linesHtml = items
    .map(
      (i) =>
        `<tr><td>${escapeHtml(i.nameSnapshot)}</td><td>${i.sizeSnapshot ? escapeHtml(i.sizeSnapshot) : "—"}</td><td>${i.quantity}</td><td>${i.priceLabelSnapshot ? escapeHtml(i.priceLabelSnapshot) : "—"}</td><td>${i.lineTotalTwd != null ? `NT$ ${i.lineTotalTwd}` : "—"}</td></tr>`
    )
    .join("");

  const totalLineEn =
    totalTwd != null
      ? `<p><strong>Total:</strong> NT$ ${totalTwd}</p>`
      : `<p><strong>Total:</strong> We will confirm the amount (some items may need a custom quote).</p>`;

  const totalLineZh =
    totalTwd != null
      ? `<p><strong>總計：</strong> NT$ ${totalTwd}</p>`
      : `<p><strong>總計：</strong> 部分商品可能需要報價確認，金額將另為通知。</p>`;

  const customerHtml = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color:#111;">
      <div style="margin-bottom:28px;">
        <p style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#666;margin:0 0 12px;">English</p>
        <p>Hi ${escapeHtml(customerName)},</p>
        <p>Thank you for your purchase — we've received your order and will contact you shortly to confirm payment and pickup or shipping.</p>
        <p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>
        <p><strong>Bank transfer:</strong> ${escapeHtml(SHOP_BANK_TRANSFER_DISPLAY)}</p>
        <p><strong>Transfer reference (last 5 digits of your sending account):</strong> ${escapeHtml(transferSenderLastFive)}</p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0;font-size:14px;">
          <thead><tr><th align="left">Item</th><th align="left">Size</th><th align="right">Qty</th><th align="right">Price</th><th align="right">Line</th></tr></thead>
          <tbody>${linesHtml}</tbody>
        </table>
        ${totalLineEn}
      </div>
      <hr style="border:none;border-top:1px solid #ddd;margin:28px 0;" />
      <div>
        <p style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#666;margin:0 0 12px;">中文</p>
        <p>${escapeHtml(customerName)}，您好：</p>
        <p>感謝您的購買。我們已收到您的訂單，將盡快與您聯繫，確認付款方式以及取貨或寄送細節。</p>
        <p><strong>訂單編號：</strong> ${escapeHtml(orderId)}</p>
        <p><strong>銀行轉帳資訊：</strong> ${escapeHtml(SHOP_BANK_TRANSFER_DISPLAY)}</p>
        <p><strong>轉帳核對（您「轉出帳戶」末五碼）：</strong> ${escapeHtml(transferSenderLastFive)}</p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0;font-size:14px;">
          <thead><tr><th align="left">項目</th><th align="left">尺寸</th><th align="right">數量</th><th align="right">單價</th><th align="right">小計</th></tr></thead>
          <tbody>${linesHtml}</tbody>
        </table>
        ${totalLineZh}
      </div>
      <p style="margin-top:28px;">— Casper Tattoo Kaohsiung 高雄刺青</p>
    </div>
  `;

  const shortRef = orderId.slice(0, 8);

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
          subject: `Order confirmed · 訂單確認 — ${shortRef}`,
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
            subject: `[Shop] New order · 新訂單 ${shortRef} — ${customerName}`,
            html: `
              <div style="font-family:sans-serif;max-width:560px;color:#111;">
                <div style="margin-bottom:24px;">
                  <p style="font-size:11px;text-transform:uppercase;color:#666;">English</p>
                  <p>New shop order.</p>
                  <p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>
                  <p><strong>Customer:</strong> ${escapeHtml(customerName)} — ${escapeHtml(customerEmail)}</p>
                  <p><strong>Bank:</strong> ${escapeHtml(SHOP_BANK_TRANSFER_DISPLAY)}</p>
                  <p><strong>Transfer ref (sender acct. last 5):</strong> ${escapeHtml(transferSenderLastFive)}</p>
                  <table style="border-collapse:collapse;width:100%;margin:12px 0;font-size:14px;"><thead><tr><th align="left">Item</th><th align="left">Size</th><th align="right">Qty</th><th align="right">Price</th><th align="right">Line</th></tr></thead><tbody>${linesHtml}</tbody></table>
                  ${totalLineEn}
                </div>
                <hr style="border:none;border-top:1px solid #ddd;margin:24px 0;" />
                <div>
                  <p style="font-size:11px;text-transform:uppercase;color:#666;">中文</p>
                  <p>商店新訂單。</p>
                  <p><strong>訂單編號：</strong> ${escapeHtml(orderId)}</p>
                  <p><strong>顧客：</strong> ${escapeHtml(customerName)} — ${escapeHtml(customerEmail)}</p>
                  <p><strong>銀行帳號：</strong> ${escapeHtml(SHOP_BANK_TRANSFER_DISPLAY)}</p>
                  <p><strong>轉出帳戶末五碼：</strong> ${escapeHtml(transferSenderLastFive)}</p>
                  <table style="border-collapse:collapse;width:100%;margin:12px 0;font-size:14px;"><thead><tr><th align="left">項目</th><th align="left">尺寸</th><th align="right">數量</th><th align="right">單價</th><th align="right">小計</th></tr></thead><tbody>${linesHtml}</tbody></table>
                  ${totalLineZh}
                </div>
              </div>
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
