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

// GET all coupons (Public / Admin check)
export async function GET() {
  try {
    const db = await getDb();
    const coupons = await db.collection("coupons").find({}).toArray();
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a new coupon (Owner/Admin only)
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
    const { code, discount, description } = sanitizedBody;

    if (!code || !discount) {
      return NextResponse.json({ error: "Missing required coupon fields" }, { status: 400 });
    }

    const db = await getDb();
    const newCoupon = {
      code: code.toUpperCase().trim(),
      discount: Number(discount),
      description: description || "",
    };

    await db.collection("coupons").updateOne(
      { code: newCoupon.code },
      { $set: newCoupon },
      { upsert: true }
    );

    // Logging activity log
    await db.collection("logs").insertOne({
      action: "Create Coupon",
      user: admin.email,
      role: admin.role,
      date: new Date().toISOString(),
      details: `Created/Updated promotional coupon: ${newCoupon.code} (${newCoupon.discount}% Off).`,
    });

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a coupon (Owner/Admin only)
export async function DELETE(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (admin.role !== "Owner" && admin.role !== "Admin") {
      return NextResponse.json({ error: "Forbidden: Insufficient Permissions" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Missing coupon code" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("coupons").deleteOne({ code: code.toUpperCase().trim() });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    // Logging activity log
    await db.collection("logs").insertOne({
      action: "Delete Coupon",
      user: admin.email,
      role: admin.role,
      date: new Date().toISOString(),
      details: `Deleted promotional coupon: ${code}.`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
