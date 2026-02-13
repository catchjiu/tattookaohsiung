import { logout } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await logout();
  const origin = request.headers.get("origin") || request.nextUrl.origin;
  return NextResponse.redirect(new URL("/admin/login", origin), { status: 302 });
}
