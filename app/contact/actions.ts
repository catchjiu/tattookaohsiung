"use server";

import { headers } from "next/headers";
import { uploadToGCP, isGCPConfigured } from "@/lib/gcp-storage";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

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

  if (!isGCPConfigured()) {
    return { error: "File upload is not configured. Please contact the studio." };
  }
  const result = await uploadToGCP(file, "booking-references");
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

      await sendBookingConfirmationEmail(email, name);

      return { success: true };
  } catch (err) {
    console.error("[Booking] Prisma error:", err);
    return {
      error: err instanceof Error ? err.message : "Booking failed",
    };
  }
}

async function sendBookingConfirmationEmail(email: string, name: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "bookings@yourdomain.com",
        to: email,
        subject: "Your booking request — We've received it",
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
            <p>Dear ${name},</p>
            <p>Thank you for your booking request. We've received your message and will be in touch within 24–48 hours to discuss your vision and confirm availability.</p>
            <p>In the meantime, feel free to share any additional reference images or ideas via email or Instagram.</p>
            <p>Warm regards,<br/>The Studio Team</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      console.error("[Email] Resend failed:", await res.text());
    }
  } catch (err) {
    console.error("[Email] Send failed:", err);
  }
}
