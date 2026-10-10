import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";
import { requireServerEnv } from "@/lib/env";
import { isJwtRevoked } from "@/lib/auth-tokens";

const JWT_SECRET = requireServerEnv("JWT_SECRET");

export async function GET(request: Request) {
  try {
    let sessionCookie: string | undefined;

    try {
      const cookieStore = await cookies();
      sessionCookie = cookieStore.get("naeemi_session")?.value;
    } catch {
      // Fallback if cookies() helper fails
    }

    if (!sessionCookie) {
      const cookieHeader = request.headers.get("cookie") || "";
      const match = cookieHeader.match(/(?:^|;\s*)naeemi_session=([^;]+)/);
      sessionCookie = match ? match[1] : undefined;
    }

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    if (await isJwtRevoked(sessionCookie)) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;

    // Stateful validation check against database users collection
    const db = await getDb();
    const ObjectId = require("mongodb").ObjectId;
    const dbUser = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) });
    
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
  } catch (error: any) {
    const isJwtError = error?.name === "JsonWebTokenError" || error?.name === "TokenExpiredError";
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    if (isJwtError) {
      try {
        response.cookies.delete("naeemi_session");
      } catch (e) {}
    }
    return response;
  }
}
