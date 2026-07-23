import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("Missing JWT_SECRET environment variable");
}
const SECRET = JWT_SECRET || "fallback_secret_key";

export async function POST(request: Request) {
  try {
    const db = await getDb();
    const sessionCookie = request.headers.get("cookie")
      ?.split("; ")
      .find(c => c.startsWith("naeemi_session="))
      ?.split("=")[1];

    let userEmail = "unknown";
    if (sessionCookie) {
      try {
        const decoded = jwt.verify(sessionCookie, SECRET) as any;
        userEmail = decoded.email;
      } catch (e) {}
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    
    // Clear cookie
    response.cookies.delete("naeemi_session");

    if (userEmail !== "unknown") {
      await db.collection("logs").insertOne({
        action: "Logout",
        user: userEmail,
        date: new Date().toISOString(),
        details: "Logged out from Admin Hub.",
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
