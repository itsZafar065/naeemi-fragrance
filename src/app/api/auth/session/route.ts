import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";
import { requireServerEnv } from "@/lib/env";

const JWT_SECRET = requireServerEnv("JWT_SECRET");

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("naeemi_session="))
      ?.split("=")[1];

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;

    // Stateful validation check against database users collection
    const db = await getDb();
    const dbUser = await db.collection("users").findOne({ email: decoded.email.toLowerCase().trim() });
    
    if (!dbUser) {
      const response = NextResponse.json({ authenticated: false }, { status: 401 });
      response.cookies.delete("naeemi_session");
      return response;
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: dbUser.email,
        role: dbUser.role,
        name: dbUser.name,
      },
    });
  } catch (error) {
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    try {
      response.cookies.delete("naeemi_session");
    } catch (e) {}
    return response;
  }
}
