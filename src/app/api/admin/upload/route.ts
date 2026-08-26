import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Product images and COA documents.
 *
 * Vercel Blob is used when BLOB_READ_WRITE_TOKEN is configured. Without it the
 * bytes go to the MediaAsset table and are served back from /api/media/<id>,
 * so uploads work on any deployment with a database and nothing else set up.
 */
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"];

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!isStaff(user)) return NextResponse.json({ error: "Not authorised" }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Files must be 8 MB or smaller." }, { status: 413 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Upload a JPEG, PNG, WebP, AVIF or PDF." }, { status: 415 });
  }

  try {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url });
    }

    const asset = await db.mediaAsset.create({
      data: {
        filename: file.name,
        contentType: file.type,
        size: file.size,
        data: Buffer.from(await file.arrayBuffer()),
      },
      select: { id: true },
    });
    return NextResponse.json({ url: `/api/media/${asset.id}` });
  } catch (error) {
    console.error("upload failed", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 502 });
  }
}
