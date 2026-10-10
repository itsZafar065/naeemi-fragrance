import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return new NextResponse("Invalid image ID", { status: 400 });
    }

    const db = await getDb();
    const imageDoc = await db.collection("media").findOne({ _id: new ObjectId(id) });

    if (!imageDoc || !imageDoc.data) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // imageDoc.data is stored as Binary in Mongo
    const rawBuffer = Buffer.isBuffer(imageDoc.data)
      ? imageDoc.data
      : Buffer.from(imageDoc.data.buffer || imageDoc.data);

    return new NextResponse(rawBuffer, {
      status: 200,
      headers: {
        "Content-Type": imageDoc.contentType || "image/jpeg",
        "Content-Length": rawBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving media image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
