"use server";

import { headers } from "next/headers";
import { uploadFile, isUploadConfigured } from "@/lib/upload";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { escapeHtml, sendEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/site-url";

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
            where: { status: "AVAILABLE" },
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

      await Promise.all([
        sendBookingConfirmationEmail(email, name),
        sendArtistBookingNotificationEmail({
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
        }),
      ]);

      return { success: true };
  } catch (err) {
    console.error("[Booking] Prisma error:", err);
    return {
      error: err instanceof Error ? err.message : "Booking failed",
    };
  }
}

async function sendBookingConfirmationEmail(email: string, name: string) {
  await sendEmail({
    to: email,
    subject: "Your booking request — We've received it",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <p>Dear ${escapeHtml(name)},</p>
        <p>Thank you for your booking request. We've received your message and will be in touch within 24–48 hours to discuss your vision and confirm availability.</p>
        <p>In the meantime, feel free to share any additional reference images or ideas via email or Instagram.</p>
        <p>Warm regards,<br/>The Studio Team</p>
      </div>
    `,
  });
}

type ArtistBookingNotification = {
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

async function sendArtistBookingNotificationEmail(details: ArtistBookingNotification) {
  const notifyTo =
    details.artist.email ||
    process.env.BOOKING_EMAIL ||
    process.env.ADMIN_EMAIL;

  if (!notifyTo) return;

  const siteUrl = getSiteUrl();
  const adminUrl = `${siteUrl}/admin/bookings`;
  const field = (label: string, value: string | null) =>
    `<p><strong>${escapeHtml(label)}:</strong> ${value ? escapeHtml(value) : "—"}</p>`;

  const referenceBlock = details.referenceUrl
    ? `<p><strong>Reference image:</strong> <a href="${escapeHtml(details.referenceUrl)}">${escapeHtml(details.referenceUrl)}</a></p>`
    : "";

  await sendEmail({
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
}
