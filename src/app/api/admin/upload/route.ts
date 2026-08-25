import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getCurrentUser, isStaff } from "@/lib/auth";

/**
 * Product images and COA documents, stored on Vercel Blob.
 *
 * Without BLOB_READ_WRITE_TOKEN the endpoint reports that uploads are not
 * configured rather than failing obscurely — the dashboard disables the
 * control in that case.
 */
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"];

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!isStaff(user)) return NextResponse.json({ error: "Not authorised" }, { status: 403 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Uploads are not configured — set BLOB_READ_WRITE_TOKEN." },
      { status: 501 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Files must be 8 MB or smaller." }, { status: 413 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Upload a JPEG, PNG, WebP, AVIF or PDF." },
      { status: 415 },
    );
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("blob upload failed", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 502 });
  }
}
