"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import type { UserRole } from "@prisma/client";

const SESSION_COOKIE = "admin_session";
const SESSION_DAYS = 7;

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  artistId: string | null;
};

/** @deprecated Use SessionUser */
export type AdminUser = SessionUser;

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const session = await prisma.session.findFirst({
      where: { token, expiresAt: { gt: new Date() } },
      include: { user: { include: { artist: { select: { id: true } } } } },
    });

    if (!session?.user) return null;
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      artistId: session.user.artist?.id ?? null,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect("/admin/login");
  if (user.role !== "ADMIN") redirect("/artist");
  return user;
}

export async function requireArtist(): Promise<SessionUser & { artistId: string }> {
  const user = await getSession();
  if (!user) redirect("/admin/login");
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role !== "ARTIST" || !user.artistId) redirect("/admin/login");
  return { ...user, artistId: user.artistId };
}

export async function login(
  email: string,
  password: string
): Promise<{ error?: string; redirectTo?: string }> {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    include: { artist: { select: { id: true } } },
  });
  if (!user) return { error: "Invalid email or password" };

  const ok = await compare(password, user.passwordHash);
  if (!ok) return { error: "Invalid email or password" };

  if (user.role === "ARTIST" && !user.artist) {
    return { error: "Artist account is not linked to a profile. Contact the studio." };
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

  await prisma.session.create({
    data: { userId: user.id, token, expiresAt },
  });

  const headersList = await headers();
  const forwardedProto = headersList.get("x-forwarded-proto");
  const isHttps = forwardedProto === "https";
  const secureCookie = process.env.NODE_ENV === "production" ? isHttps : false;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: "lax",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: "/",
  });

  return { redirectTo: user.role === "ARTIST" ? "/artist" : "/admin" };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookieStore.delete(SESSION_COOKIE);
}
