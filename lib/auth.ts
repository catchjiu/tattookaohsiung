"use server";

import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

const SESSION_COOKIE = "admin_session";
const SESSION_DAYS = 7;

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
};

export async function getSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const session = await prisma.session.findFirst({
      where: { token, expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    if (!session?.user) return null;
    return { id: session.user.id, email: session.user.email, name: session.user.name };
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<{ error?: string }> {
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) return { error: "Invalid email or password" };

  const ok = await compare(password, user.passwordHash);
  if (!ok) return { error: "Invalid email or password" };

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

  return {};
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  cookieStore.delete(SESSION_COOKIE);
}
