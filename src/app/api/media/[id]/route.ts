import { db } from "@/lib/db";

/**
 * Serves an uploaded image or COA stored in the database.
 *
 * Public, like the Vercel Blob URLs this stands in for: the id is the only
 * thing guarding a file, and product photography is public by nature anyway.
 * Contents never change for a given id — each upload creates a new row — so
 * the response is immutable and the CDN keeps it out of the database.
 */
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const asset = await db.mediaAsset.findUnique({
    where: { id },
    select: { data: true, contentType: true, filename: true },
  });
  if (!asset) return new Response("Not found", { status: 404 });

  const body = new Uint8Array(asset.data);
  return new Response(body, {
    headers: {
      "Content-Type": asset.contentType,
      "Content-Length": String(body.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${asset.filename.replace(/"/g, "")}"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
