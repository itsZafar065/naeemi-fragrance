import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const db = await getDb();
    const user = await db.collection("users").findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      // Mitigate timing attack by running mock compare
      await bcrypt.compare(password, "$2a$10$abcdefghijklmnopqrstuv");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Sign session JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role, // 'Owner' | 'Admin' | 'Manager'
        name: user.name,
      },
      JWT_SECRET,
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
