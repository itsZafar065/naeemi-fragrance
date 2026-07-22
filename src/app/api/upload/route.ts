import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function POST(request: Request) {
  try {
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
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only PNG, JPEG, WEBP, GIF, and PDF files are allowed." }, { status: 400 });
    }

    // 3. Validate file extension to prevent spoofing
    const allowedExtensions = [".png", ".jpeg", ".jpg", ".webp", ".gif", ".pdf"];
    const ext = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: "Invalid file extension. Only .png, .jpeg, .jpg, .webp, .gif, and .pdf are allowed." }, { status: 400 });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize filename to avoid folder traversal attacks
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}_${originalName}`;
    
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
