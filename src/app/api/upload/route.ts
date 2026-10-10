import { NextResponse } from "next/server";
import { serverErrorResponse } from "@/lib/api-response";
import { rateLimitKey } from "@/lib/security";
import { getDb } from "@/lib/db";
import { requireServerEnv } from "@/lib/env";
import { isJwtRevoked } from "@/lib/auth-tokens";
import jwt from "jsonwebtoken";
import path from "path";

const FILE_SIGNATURES: Record<string, number[][]> = {
  "image/png": [[0x89, 0x50, 0x4e, 0x47]],
  "image/jpeg": [[0xff, 0xd8, 0xff]],
  "image/jpg": [[0xff, 0xd8, 0xff]],
  "image/webp": [[0x52, 0x49, 0x46, 0x46]],
};

function hasValidSignature(buffer: Buffer, mimeType: string): boolean {
  const signatures = FILE_SIGNATURES[mimeType] || [];
  return signatures.some((signature) =>
    signature.every((byte, index) => buffer[index] === byte)
  );
}

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || "127.0.0.1";

    // Detect if requester is an authenticated admin/staff
    let isAdmin = false;
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("naeemi_session="))
      ?.split("=")[1];

    if (sessionCookie) {
      try {
        if (!(await isJwtRevoked(sessionCookie))) {
          const JWT_SECRET = requireServerEnv("JWT_SECRET");
          const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;
          if (decoded && (decoded.role === "Owner" || decoded.role === "Admin" || decoded.role === "Manager")) {
            isAdmin = true;
          }
        }
      } catch {
        // Fallback to normal customer flow if token invalid
      }
    }

    // Rate limiting: Admins get high allowance (150/15m), guests get 30/hour
    const rateLimitLimit = isAdmin ? 150 : 30;
    const rateLimitWindow = isAdmin ? 15 * 60 * 1000 : 60 * 60 * 1000;
    if (!rateLimitKey(`upload:${clientIp}:${isAdmin ? "admin" : "guest"}`, rateLimitLimit, rateLimitWindow)) {
      return NextResponse.json(
        { error: "Too many upload attempts. Please try again shortly." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Validate file size (limit to 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 5MB size limit" }, { status: 400 });
    }

    // 2. Validate MIME type
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PNG, JPEG, and WEBP files are allowed." },
        { status: 400 }
      );
    }

    // 3. Validate file extension to prevent spoofing
    const allowedExtensions = [".png", ".jpeg", ".jpg", ".webp"];
    const ext = path.extname(file.name).toLowerCase();
    if (ext && !allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: "Invalid file extension. Only .png, .jpeg, .jpg, and .webp are allowed." },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!hasValidSignature(buffer, file.type)) {
      return NextResponse.json(
        { error: "Uploaded file content does not match its declared image type." },
        { status: 400 }
      );
    }

    // Save image to MongoDB collection 'media'
    const db = await getDb();
    const result = await db.collection("media").insertOne({
      filename: file.name || "upload.jpg",
      contentType: file.type,
      size: buffer.length,
      data: buffer,
      uploadedBy: isAdmin ? "admin" : "customer",
      createdAt: new Date(),
    });

    const imageUrl = `/api/images/${result.insertedId.toString()}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return serverErrorResponse("/api/upload");
  }
}
