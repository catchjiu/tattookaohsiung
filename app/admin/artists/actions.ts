"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseArtistJob } from "@/lib/artist-job";

async function requireAdminAction(): Promise<{ error: string } | null> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  return null;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function parseOptionalEmail(raw: FormDataEntryValue | null): string | null {
  const email = (raw as string | null)?.trim() || null;
  if (!email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "__invalid__";
  }
  return email;
}

export async function createArtist(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const slug = ((formData.get("slug") as string) || slugify(name || "")).trim() || slugify(name || "");
  const nameZh = (formData.get("name_zh") as string)?.trim() || null;
  const bio = (formData.get("bio") as string)?.trim() || null;
  const bioZh = (formData.get("bio_zh") as string)?.trim() || null;
  const specialty = (formData.get("specialty") as string)?.trim() || null;
  const specialtyZh = (formData.get("specialty_zh") as string)?.trim() || null;
  const emailRaw = parseOptionalEmail(formData.get("email"));
  const igHandle = (formData.get("ig_handle") as string)?.trim()?.replace(/^@/, "") || null;
  const avatarUrl = (formData.get("avatar_url") as string)?.trim() || null;
  const sortOrder = parseInt((formData.get("display_order") as string) || "0", 10);
  const isActive = formData.get("is_active") === "on";
  const job = parseArtistJob(formData.get("job"));

  if (!name) return { error: "Name is required" };
  if (emailRaw === "__invalid__") return { error: "Invalid email address" };
  const email = emailRaw;

  const instagramUrl = igHandle ? `https://instagram.com/${igHandle}` : null;
  const status = isActive ? "AVAILABLE" : "INACTIVE";

  try {
    await prisma.artist.create({
      data: {
        name,
        nameZh,
        slug: slug || slugify(name),
        bio,
        bioZh,
        specialty,
        specialtyZh,
        job,
        email,
        instagramUrl,
        avatarUrl,
        sortOrder,
        status,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create artist" };
  }
  revalidatePath("/admin/artists");
  revalidatePath("/artists");
  revalidatePath("/gallery");
  revalidatePath("/permanent-makeup");
  revalidatePath("/");
  return { success: true };
}

export async function updateArtist(id: string, formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const nameZh = (formData.get("name_zh") as string)?.trim() || null;
  const bio = (formData.get("bio") as string)?.trim() || null;
  const bioZh = (formData.get("bio_zh") as string)?.trim() || null;
  const specialty = (formData.get("specialty") as string)?.trim() || null;
  const specialtyZh = (formData.get("specialty_zh") as string)?.trim() || null;
  const emailRaw = parseOptionalEmail(formData.get("email"));
  const igHandle = (formData.get("ig_handle") as string)?.trim()?.replace(/^@/, "") || null;
  const avatarUrl = (formData.get("avatar_url") as string)?.trim() || null;
  const sortOrder = parseInt((formData.get("display_order") as string) || "0", 10);
  const isActive = formData.get("is_active") === "on";
  const job = parseArtistJob(formData.get("job"));

  if (!name || !slug) return { error: "Name and slug are required" };
  if (emailRaw === "__invalid__") return { error: "Invalid email address" };
  const email = emailRaw;

  const instagramUrl = igHandle ? `https://instagram.com/${igHandle}` : null;
  const status = isActive ? "AVAILABLE" : "INACTIVE";

  try {
    await prisma.artist.update({
      where: { id },
      data: {
        name,
        nameZh,
        slug,
        bio,
        bioZh,
        specialty,
        specialtyZh,
        job,
        email,
        instagramUrl,
        avatarUrl,
        sortOrder,
        status,
      },
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to update artist" };
  }
  revalidatePath("/admin/artists");
  revalidatePath("/artists");
  revalidatePath("/gallery");
  revalidatePath("/permanent-makeup");
  revalidatePath("/");
  return { success: true };
}

export async function deleteArtist(id: string) {
  const authErr = await requireAdminAction();
  if (authErr) return authErr;

  try {
    const artist = await prisma.artist.findUnique({
      where: { id },
      select: { userId: true },
    });
    await prisma.artist.delete({ where: { id } });
    if (artist?.userId) {
      await prisma.session.deleteMany({ where: { userId: artist.userId } });
      await prisma.user.delete({ where: { id: artist.userId } });
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete artist" };
  }
  revalidatePath("/admin/artists");
  revalidatePath("/artists");
  revalidatePath("/gallery");
  revalidatePath("/permanent-makeup");
  revalidatePath("/");
  return { success: true };
}

export async function assignArtistDashboard(
  artistId: string,
  loginEmail: string,
  password: string
) {
  const authErr = await requireAdminAction();
  if (authErr) return authErr;

  const email = loginEmail.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "A valid login email is required" };
  }
  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
    include: { user: true },
  });
  if (!artist) return { error: "Artist not found" };

  const isUpdate = !!artist.user;
  if (!isUpdate && (!password || password.length < 8)) {
    return { error: "Password must be at least 8 characters" };
  }
  if (password && password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  try {
    const passwordHash = password ? await hash(password, 12) : null;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      if (existingUser.role !== "ARTIST") {
        return { error: "This email is already used by an admin account" };
      }
      const linkedElsewhere = await prisma.artist.findFirst({
        where: { userId: existingUser.id, NOT: { id: artistId } },
      });
      if (linkedElsewhere) {
        return { error: "This email is already linked to another artist" };
      }
      await prisma.$transaction([
        prisma.user.update({
          where: { id: existingUser.id },
          data: {
            ...(passwordHash ? { passwordHash } : {}),
            name: artist.name,
          },
        }),
        prisma.artist.update({
          where: { id: artistId },
          data: { userId: existingUser.id },
        }),
      ]);
    } else {
      if (!passwordHash) {
        return { error: "Password is required for new dashboard access" };
      }
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: "ARTIST",
          name: artist.name,
        },
      });
      await prisma.artist.update({
        where: { id: artistId },
        data: { userId: user.id },
      });
    }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to assign dashboard access",
    };
  }

  revalidatePath("/admin/artists");
  return { success: true };
}

export async function revokeArtistDashboard(artistId: string) {
  const authErr = await requireAdminAction();
  if (authErr) return authErr;

  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
    select: { userId: true },
  });
  if (!artist?.userId) return { success: true };

  try {
    await prisma.$transaction([
      prisma.artist.update({
        where: { id: artistId },
        data: { userId: null },
      }),
      prisma.session.deleteMany({ where: { userId: artist.userId } }),
      prisma.user.delete({ where: { id: artist.userId } }),
    ]);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to revoke dashboard access",
    };
  }

  revalidatePath("/admin/artists");
  return { success: true };
}
