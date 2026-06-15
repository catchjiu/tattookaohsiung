"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseBookedUntilInput } from "@/lib/artist-availability";

async function getArtistId(): Promise<{ artistId: string } | { error: string }> {
  const session = await getSession();
  if (!session || session.role !== "ARTIST" || !session.artistId) {
    return { error: "Unauthorized" };
  }
  return { artistId: session.artistId };
}

export async function updateArtistAvailability(formData: FormData) {
  const auth = await getArtistId();
  if ("error" in auth) return auth;

  const bookedUntilRaw = (formData.get("booked_until") as string | null)?.trim() || "";
  const clearBookedUntil = formData.get("clear_booked_until") === "on";

  let bookedUntil: Date | null = null;
  if (!clearBookedUntil && bookedUntilRaw) {
    bookedUntil = parseBookedUntilInput(bookedUntilRaw);
    if (!bookedUntil) {
      return { error: "Invalid date. Use YYYY-MM-DD format." };
    }
  }

  const artist = await prisma.artist.findUnique({
    where: { id: auth.artistId },
    select: { slug: true },
  });
  if (!artist) return { error: "Artist not found" };

  try {
    await prisma.artist.update({
      where: { id: auth.artistId },
      data: { bookedUntil },
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update availability",
    };
  }

  revalidatePath("/artist/profile");
  revalidatePath(`/artists/${artist.slug}`);
  revalidatePath(`/zh-TW/artists/${artist.slug}`);
  revalidatePath("/artists");
  revalidatePath("/permanent-makeup");
  revalidatePath("/");
  return { success: true };
}
