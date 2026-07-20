import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sanitizeInput, validateEmail, validatePassword } from "@/lib/security";
import bcrypt from "bcryptjs";
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

// GET all staff members (Owner/Admin roles only)
export async function GET(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (admin.role !== "Owner" && admin.role !== "Admin") {
      return NextResponse.json({ error: "Forbidden: Insufficient Permissions" }, { status: 403 });
    }

    const db = await getDb();
    const staff = await db
      .collection("users")
      .find({}, { projection: { passwordHash: 0 } })
      .toArray();

    return NextResponse.json(staff);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a new staff account (Owner/Admin only)
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
    const { email, password, role, name } = sanitizedBody;

    if (!email || !password || !role || !name) {
      return NextResponse.json({ error: "Missing required staff registration parameters" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!validateEmail(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ 
        error: "Password must be at least 8 characters long, containing uppercase, lowercase, and a number." 
      }, { status: 400 });
    }

    // Role check validation
    const validRoles = ["Owner", "Admin", "Manager"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid staff role specified" }, { status: 400 });
    }

    const db = await getDb();
    const existing = await db.collection("users").findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json({ error: "A staff user with this email already exists" }, { status: 409 });
    }

    // Hash password and insert
    const passwordHash = await bcrypt.hash(password, 10);
    const newStaff = {
      email: cleanEmail,
      name: name.trim(),
      role,
      passwordHash,
      created_at: new Date().toISOString(),
    };

    await db.collection("users").insertOne(newStaff);

    // Logging activity log
    await db.collection("logs").insertOne({
      action: "Create Staff",
      user: admin.email,
      role: admin.role,
      date: new Date().toISOString(),
      details: `Created new staff login: ${cleanEmail} (${role}).`,
    });

    return NextResponse.json({ 
      success: true, 
      user: { email: cleanEmail, name: newStaff.name, role } 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a staff account (Owner only)
export async function DELETE(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (admin.role !== "Owner") {
      return NextResponse.json({ error: "Forbidden: Only Owners can revoke staff credentials" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Missing staff email" }, { status: 400 });
    }

    const targetEmail = email.toLowerCase().trim();

    if (targetEmail === admin.email) {
      return NextResponse.json({ error: "You cannot revoke your own Owner account" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("users").deleteOne({ email: targetEmail });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Staff account not found" }, { status: 404 });
    }

    // Logging activity log
    await db.collection("logs").insertOne({
      action: "Revoke Staff",
      user: admin.email,
      role: admin.role,
      date: new Date().toISOString(),
      details: `Revoked access and deleted staff login: ${targetEmail}.`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
