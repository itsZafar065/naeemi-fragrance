import { NextResponse } from "next/server";
import { serverErrorResponse } from "@/lib/api-response";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";
import { requireServerEnv } from "@/lib/env";

const JWT_SECRET = requireServerEnv("JWT_SECRET");

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const sessionCookie = request.headers.get("cookie")
      ?.split("; ")
      .find(c => c.startsWith("naeemi_session="))
      ?.split("=")[1];

    let hadValidSession = false;
    if (sessionCookie) {
      try {
        jwt.verify(sessionCookie, JWT_SECRET);
        hadValidSession = true;
      } catch (e) {}
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    
    // Clear cookie
    response.cookies.delete("naeemi_session");

    if (hadValidSession) {
      await db.collection("logs").insertOne({
        action: "Logout",
        user: "[REDACTED]",
        date: new Date().toISOString(),
        details: "Logged out from Admin Hub.",
      });
    }

    return response;
  } catch (error: any) {
    return serverErrorResponse("/api/auth/logout");
  }
}
