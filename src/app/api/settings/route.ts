import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sanitizeInput } from "@/lib/security";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

function verifyAdminToken(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("naeemi_session="))
    ?.split("=")[1];

  if (!sessionCookie) return null;

  try {
    const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET settings (Public)
export async function GET() {
  try {
    const db = await getDb();
    const settings = await db.collection("settings").findOne({});
    return NextResponse.json(settings || {});
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST/PUT save settings (Owner/Admin only)
export async function POST(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (admin.role !== "Owner" && admin.role !== "Admin") {
      return NextResponse.json({ error: "Forbidden: Insufficient Permissions" }, { status: 403 });
    }

    const body = await request.json();
    const sanitizedBody = sanitizeInput(body);

    const db = await getDb();
    
    // Find the first settings document and update it, or insert if none exists
    const result = await db.collection("settings").findOneAndUpdate(
      {},
      { $set: sanitizedBody },
      { upsert: true, returnDocument: "after" }
    );

    // Logging activity log
    await db.collection("logs").insertOne({
      action: "Update Settings",
      user: admin.email,
      role: admin.role,
      date: new Date().toISOString(),
      details: "Updated global store settings and layout metadata values.",
    });

    return NextResponse.json({ success: true, settings: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
