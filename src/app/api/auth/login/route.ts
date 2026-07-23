import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { 
  sanitizeInput, 
  rateLimit, 
  checkBruteForce, 
  registerFailedAttempt, 
  resetFailedAttempts, 
  validateEmail 
} from "@/lib/security";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("Missing JWT_SECRET environment variable");
}
const SECRET = JWT_SECRET || "fallback_secret_key";

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check by client IP
    const clientIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!rateLimit(clientIp, 10, 60000)) { // limit 10 requests per minute
      return NextResponse.json({ error: "Too many login attempts. Please wait 1 minute." }, { status: 429 });
    }

    const body = await request.json();
    const sanitizedBody = sanitizeInput(body);
    const { email, password } = sanitizedBody;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!validateEmail(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // 2. Brute Force Protection check
    const bruteCheck = checkBruteForce(cleanEmail);
    if (!bruteCheck.allowed) {
      return NextResponse.json({ 
        error: `Account temporarily locked due to failed logins. Please retry in ${bruteCheck.waitTimeMinutes} minutes.` 
      }, { status: 423 });
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ email: cleanEmail });

    if (!user) {
      registerFailedAttempt(cleanEmail);
      await bcrypt.compare(password, "$2a$10$abcdefghijklmnopqrstuv"); // timing mitigation
      const response = NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      response.cookies.delete("naeemi_session");
      return response;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      registerFailedAttempt(cleanEmail);
      const response = NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      response.cookies.delete("naeemi_session");
      return response;
    }

    // Reset failed counter on success
    resetFailedAttempts(cleanEmail);

    // Sign session JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role, // 'Owner' | 'Admin' | 'Manager'
        name: user.name,
      },
      SECRET,
      { expiresIn: "7d" } // Persistent remember login
    );

    // Create session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });

    response.cookies.set({
      name: "naeemi_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Activity Log
    await db.collection("logs").insertOne({
      action: "Login",
      user: user.email,
      role: user.role,
      date: new Date().toISOString(),
      details: "Successfully logged into Admin Hub.",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
