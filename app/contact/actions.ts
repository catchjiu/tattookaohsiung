"use server";

import { headers } from "next/headers";
import { uploadFile, isUploadConfigured } from "@/lib/upload";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { escapeHtml, isEmailConfigured, sendEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/site-url";
import { permanentMakeupArtistWhere } from "@/lib/artist-job";

const UPLOAD_LIMIT = 10; // per minute per IP
const BOOKING_LIMIT = 5; // per minute per IP

export async function uploadBookingReference(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file?.type?.startsWith("image/")) {
    return { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF." };
  }

  const headersList = await headers();
  const clientId = getClientIdentifier(headersList);
  const limit = rateLimit(clientId, "upload", UPLOAD_LIMIT);
  if (!limit.success) {
    return {
      error: `Too many uploads. Please try again in ${limit.retryAfter} seconds.`,
    };
  }

  if (!isUploadConfigured()) {
    return { error: "File upload is not configured. Please contact the studio." };
  }
  const result = await uploadFile(file, "booking-references");
  if ("error" in result) return { error: result.error };
  return { url: result.url };
}

export async function submitBooking(formData: FormData) {
  const headersList = await headers();
  const clientId = getClientIdentifier(headersList);
  const limit = rateLimit(clientId, "booking", BOOKING_LIMIT);
  if (!limit.success) {
    return {
      error: `Too many requests. Please try again in ${limit.retryAfter} seconds.`,
    };
  }

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const style = (formData.get("style") as string)?.trim() || null;
  const placement = (formData.get("placement") as string)?.trim() || null;
  const size = (formData.get("size") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const reference_url = (formData.get("reference_url") as string)?.trim() || null;
  const preferred_artist_id = (formData.get("preferred_artist_id") as string)?.trim() || null;
  const preferred_date = (formData.get("preferred_date") as string)?.trim() || null;

  if (!name || !email) {
    return { error: "Name and email are required." };
  }

  try {
      const artist = preferred_artist_id
        ? await prisma.artist.findUnique({
            where: { id: preferred_artist_id },
          })
        : await prisma.artist.findFirst({
            where: { status: { not: "INACTIVE" } },
            orderBy: { sortOrder: "asc" },
          });

      if (!artist) {
        return {
          error: "No artists available for booking. Please contact us directly.",
        };
      }

      const conceptDescription = [style, size, description]
        .filter(Boolean)
        .join("\n\n");

      const booking = await prisma.bookingRequest.create({
        data: {
          artistId: artist.id,
          clientName: name,
          clientEmail: email,
          clientPhone: phone,
          conceptDescription: conceptDescription || "No description provided.",
          placement,
          preferredDate: preferred_date,
          status: "PENDING",
          references: reference_url
            ? {
                create: {
                  url: reference_url,
                  fileName: "reference.jpg",
                },
              }
            : undefined,
        },
      });

      // Await emails so the server finishes sending before the action returns
      // (fire-and-forget is dropped on serverless). Booking still succeeds if email fails.
      try {
        await sendBookingNotificationEmails({
          bookingId: booking.id,
          artist,
          clientName: name,
          clientEmail: email,
          clientPhone: phone,
          style,
          size,
          description,
          placement,
          preferredDate: preferred_date,
          referenceUrl: reference_url,
        });
      } catch (emailErr) {
        console.error("[Booking] Notification email failed:", emailErr);
      }

      return { success: true };
  } catch (err) {
    console.error("[Booking] Prisma error:", err);
    return {
      error: err instanceof Error ? err.message : "Booking failed",
    };
  }
}

export async function submitPermanentMakeupBooking(formData: FormData) {
  const headersList = await headers();
  const clientId = getClientIdentifier(headersList);
  const limit = rateLimit(clientId, "booking", BOOKING_LIMIT);
  if (!limit.success) {
    return {
      error: `Too many requests. Please try again in ${limit.retryAfter} seconds.`,
    };
  }

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const service = (formData.get("service") as string)?.trim() || "Permanent Makeup";
  const additionalInfo =
    (formData.get("additional_info") as string)?.trim() || null;
  const preferred_artist_id =
    (formData.get("preferred_artist_id") as string)?.trim() || null;
  const preferred_date =
    (formData.get("preferred_date") as string)?.trim() || null;

  if (!name || !email) {
    return { error: "Name and email are required." };
  }

  try {
    const artist = preferred_artist_id
      ? await prisma.artist.findFirst({
          where: {
            id: preferred_artist_id,
            status: { not: "INACTIVE" },
            ...permanentMakeupArtistWhere,
          },
        })
      : await prisma.artist.findFirst({
          where: {
            status: { not: "INACTIVE" },
            ...permanentMakeupArtistWhere,
          },
          orderBy: { sortOrder: "asc" },
        });

    if (!artist) {
      return {
        error:
          "No permanent makeup artists available for booking. Please contact us directly.",
      };
    }

    const conceptDescription = [
      `Service: ${service}`,
      additionalInfo ? `Additional information:\n${additionalInfo}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const booking = await prisma.bookingRequest.create({
      data: {
        artistId: artist.id,
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        conceptDescription: conceptDescription || "No description provided.",
        placement: service,
        preferredDate: preferred_date,
        status: "PENDING",
      },
    });

    try {
      await sendPermanentMakeupNotificationEmails({
        bookingId: booking.id,
        artist,
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        service,
        additionalInfo,
        preferredDate: preferred_date,
      });
    } catch (emailErr) {
      console.error("[PMU Booking] Notification email failed:", emailErr);
    }

    return { success: true };
  } catch (err) {
    console.error("[PMU Booking] Prisma error:", err);
    return {
      error: err instanceof Error ? err.message : "Booking failed",
    };
  }
}

type PermanentMakeupNotificationPayload = {
  bookingId: string;
  artist: { id: string; name: string; email: string | null };
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  service: string;
  additionalInfo: string | null;
  preferredDate: string | null;
};

async function sendPermanentMakeupNotificationEmails(
  details: PermanentMakeupNotificationPayload
) {
  if (!isEmailConfigured()) {
    console.warn("[PMU Booking] RESEND_API_KEY not set — booking emails skipped");
    return;
  }

  const clientOk = await sendEmail({
    to: details.clientEmail,
    subject:
      "Permanent makeup booking received · 半永久彩妝預約已收到 — Casper Tattoo Kaohsiung",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color:#111;">
        <div style="margin-bottom:28px;">
          <p style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#666;margin:0 0 12px;">English</p>
          <p>Dear ${escapeHtml(details.clientName)},</p>
          <p>Thank you for your permanent makeup booking request. We've received your message and will be in touch within 24–48 hours to discuss your service and confirm availability.</p>
          <p>Warm regards,<br/>Casper Tattoo Kaohsiung</p>
        </div>
        <hr style="border:none;border-top:1px solid #ddd;margin:28px 0;" />
        <div>
          <p style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#666;margin:0 0 12px;">中文</p>
          <p>${escapeHtml(details.clientName)}，您好：</p>
          <p>感謝您的半永久彩妝預約申請。我們已收到您的訊息，將在 24–48 小時內與您聯繫，討論服務內容並確認可預約時段。</p>
          <p>誠摯問候，<br/>Casper Tattoo Kaohsiung 高雄刺青</p>
        </div>
      </div>
    `,
  });

  if (!clientOk) {
    console.error(
      `[PMU Booking] Client confirmation email failed for ${details.clientEmail}`
    );
  }

  const notifyTo =
    details.artist.email?.trim() ||
    process.env.BOOKING_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim();

  if (!notifyTo) {
    console.warn(
      "[PMU Booking] No artist email, BOOKING_EMAIL, or ADMIN_EMAIL — studio notification skipped"
    );
    return;
  }

  const siteUrl = getSiteUrl();
  const adminUrl = `${siteUrl}/admin/bookings`;
  const field = (label: string, value: string | null) =>
    `<p><strong>${escapeHtml(label)}:</strong> ${value ? escapeHtml(value) : "—"}</p>`;

  const studioOk = await sendEmail({
    to: notifyTo,
    subject: `New permanent makeup booking — ${details.clientName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color:#111;">
        <p>A new permanent makeup booking request has been submitted${details.artist.email ? ` for ${escapeHtml(details.artist.name)}` : ""}.</p>
        <p><strong>Booking ID:</strong> ${escapeHtml(details.bookingId)}</p>
        ${field("Client name", details.clientName)}
        ${field("Client email", details.clientEmail)}
        ${field("Client phone", details.clientPhone)}
        ${field("Assigned artist", details.artist.name)}
        ${field("Service", details.service)}
        ${field("Preferred date", details.preferredDate)}
        ${field("Additional information", details.additionalInfo)}
        <p style="margin-top:24px;"><a href="${escapeHtml(adminUrl)}">View in admin</a></p>
      </div>
    `,
  });

  if (!studioOk) {
    console.error(`[PMU Booking] Studio notification email failed for ${notifyTo}`);
  }
}

type BookingNotificationPayload = {
  bookingId: string;
  artist: { id: string; name: string; email: string | null };
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  style: string | null;
  size: string | null;
  description: string | null;
  placement: string | null;
  preferredDate: string | null;
  referenceUrl: string | null;
};

async function sendBookingNotificationEmails(
  details: BookingNotificationPayload
) {
  if (!isEmailConfigured()) {
    console.warn("[Booking] RESEND_API_KEY not set — booking emails skipped");
    return;
  }

  const clientOk = await sendEmail({
    to: details.clientEmail,
    subject: "Booking received · 預約申請已收到 — Casper Tattoo Kaohsiung",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color:#111;">
        <div style="margin-bottom:28px;">
          <p style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#666;margin:0 0 12px;">English</p>
          <p>Dear ${escapeHtml(details.clientName)},</p>
          <p>Thank you for your booking request. We've received your message and will be in touch within 24–48 hours to discuss your vision and confirm availability.</p>
          <p>In the meantime, feel free to share any additional reference images or ideas via <a href="https://instagram.com/tattookaohsiung">Instagram</a> or LINE.</p>
          <p>Warm regards,<br/>Casper Tattoo Kaohsiung</p>
        </div>
        <hr style="border:none;border-top:1px solid #ddd;margin:28px 0;" />
        <div>
          <p style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#666;margin:0 0 12px;">中文</p>
          <p>${escapeHtml(details.clientName)}，您好：</p>
          <p>感謝您的預約申請。我們已收到您的訊息，將在 24–48 小時內與您聯繫，討論您的構想並確認可預約時段。</p>
          <p>在此之前，歡迎透過 <a href="https://instagram.com/tattookaohsiung">Instagram</a> 或 LINE 分享更多參考圖片或想法。</p>
          <p>誠摯問候，<br/>Casper Tattoo Kaohsiung 高雄刺青</p>
        </div>
      </div>
    `,
  });

  if (!clientOk) {
    console.error(
      `[Booking] Client confirmation email failed for ${details.clientEmail}`
    );
  }

  const notifyTo =
    details.artist.email?.trim() ||
    process.env.BOOKING_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim();

  if (!notifyTo) {
    console.warn(
      "[Booking] No artist email, BOOKING_EMAIL, or ADMIN_EMAIL — studio notification skipped"
    );
    return;
  }

  const siteUrl = getSiteUrl();
  const adminUrl = `${siteUrl}/admin/bookings`;
  const field = (label: string, value: string | null) =>
    `<p><strong>${escapeHtml(label)}:</strong> ${value ? escapeHtml(value) : "—"}</p>`;

  const referenceBlock = details.referenceUrl
    ? `<p><strong>Reference image:</strong> <a href="${escapeHtml(details.referenceUrl)}">${escapeHtml(details.referenceUrl)}</a></p>`
    : "";

  const studioOk = await sendEmail({
    to: notifyTo,
    subject: `New booking request — ${details.clientName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color:#111;">
        <p>A new booking request has been submitted${details.artist.email ? ` for ${escapeHtml(details.artist.name)}` : ""}.</p>
        <p><strong>Booking ID:</strong> ${escapeHtml(details.bookingId)}</p>
        ${field("Client name", details.clientName)}
        ${field("Client email", details.clientEmail)}
        ${field("Client phone", details.clientPhone)}
        ${field("Assigned artist", details.artist.name)}
        ${field("Style", details.style)}
        ${field("Size", details.size)}
        ${field("Placement", details.placement)}
        ${field("Preferred date", details.preferredDate)}
        ${field("Description", details.description)}
        ${referenceBlock}
        <p style="margin-top:24px;"><a href="${escapeHtml(adminUrl)}">View in admin</a></p>
      </div>
    `,
  });

  if (!studioOk) {
    console.error(`[Booking] Studio notification email failed for ${notifyTo}`);
  }
}
