/**
 * API route for booking reference upload.
 * Alternative to Server Action — useful for client-side fetch.
 * Rate limited. Uses GCP when configured, else Supabase.
 */

import { NextRequest, NextResponse } from "next/server";
import { uploadToGCP, isGCPConfigured } from "@/lib/gcp-storage";
import { rateLimit, getClientIdentifier } from "@/lib/rate-limit";

const UPLOAD_LIMIT = 10;

export async function POST(request: NextRequest) {
  const clientId = getClientIdentifier(request.headers);
  const limit = rateLimit(clientId, "upload-api", UPLOAD_LIMIT);
  if (!limit.success) {
    return NextResponse.json(
      {
        error: `Too many uploads. Try again in ${limit.retryAfter} seconds.`,
      },
      { status: 429 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file?.type?.startsWith("image/")) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF." },
      { status: 400 }
    );
  }

  if (!isGCPConfigured()) {
    return NextResponse.json(
      { error: "File upload is not configured." },
      { status: 503 }
    );
  }
  const result = await uploadToGCP(file, "booking-references");
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ url: result.url });
}
