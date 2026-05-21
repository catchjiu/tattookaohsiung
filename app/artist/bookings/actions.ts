"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = [
  "PENDING",
  "APPROVED",
  "SCHEDULED",
  "COMPLETED",
  "WAITLISTED",
  "DECLINED",
  "CANCELLED",
] as const;

async function getArtistId(): Promise<{ artistId: string } | { error: string }> {
  const session = await getSession();
  if (!session || session.role !== "ARTIST" || !session.artistId) {
    return { error: "Unauthorized" };
  }
  return { artistId: session.artistId };
}

async function assertBookingOwnership(
  bookingId: string,
  artistId: string
): Promise<{ error: string } | null> {
  const booking = await prisma.bookingRequest.findUnique({
    where: { id: bookingId },
    select: { artistId: true },
  });
  if (!booking || booking.artistId !== artistId) {
    return { error: "Booking not found" };
  }
  return null;
}

export async function updateBookingStatus(
  id: string,
  status: (typeof VALID_STATUSES)[number]
): Promise<{ error?: string }> {
  const auth = await getArtistId();
  if ("error" in auth) return { error: auth.error };

  if (!VALID_STATUSES.includes(status)) {
    return { error: "Invalid status" };
  }

  const ownership = await assertBookingOwnership(id, auth.artistId);
  if (ownership) return ownership;

  try {
    await prisma.bookingRequest.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/artist/bookings");
    return {};
  } catch (err) {
    console.error("[Artist Bookings] Update status failed:", err);
    return {
      error: err instanceof Error ? err.message : "Failed to update status",
    };
  }
}

export async function deleteBooking(id: string): Promise<{ error?: string }> {
  const auth = await getArtistId();
  if ("error" in auth) return { error: auth.error };

  const ownership = await assertBookingOwnership(id, auth.artistId);
  if (ownership) return ownership;

  try {
    await prisma.bookingRequest.delete({ where: { id } });
    revalidatePath("/artist/bookings");
    return {};
  } catch (err) {
    console.error("[Artist Bookings] Delete failed:", err);
    return {
      error: err instanceof Error ? err.message : "Failed to delete booking",
    };
  }
}
