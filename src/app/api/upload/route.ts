import { NextResponse } from "next/server";
import { serverErrorResponse } from "@/lib/api-response";
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
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Validate file size (limit to 3MB for database size optimization)
    const MAX_SIZE = 3 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 3MB size limit" }, { status: 400 });
    }

    // 2. Validate MIME type
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only PNG, JPEG, and WEBP files are allowed." }, { status: 400 });
    }

    // 3. Validate file extension to prevent spoofing
    const allowedExtensions = [".png", ".jpeg", ".jpg", ".webp"];
    const ext = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: "Invalid file extension. Only .png, .jpeg, .jpg, and .webp are allowed." }, { status: 400 });
    }

    // Read file buffer and convert to Base64 data URL
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!hasValidSignature(buffer, file.type)) {
      return NextResponse.json({ error: "Uploaded file content does not match its declared image type." }, { status: 400 });
    }

    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      url: dataUrl
    });
  } catch (error: any) {
    return serverErrorResponse("/api/upload");
  }
}
