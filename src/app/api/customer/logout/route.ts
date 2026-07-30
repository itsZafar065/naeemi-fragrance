import { NextResponse } from "next/server";
import { serverErrorResponse } from "@/lib/api-response";
import jwt from "jsonwebtoken";
import { revokeJwt } from "@/lib/auth-tokens";
import { requireServerEnv } from "@/lib/env";

const JWT_SECRET = requireServerEnv("JWT_SECRET");

export async function POST(request: Request) {
  try {
    const sessionCookie = request.headers.get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("naeemi_customer_session="))
      ?.split("=")[1];

    if (sessionCookie) {
      try {
        const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;
        await revokeJwt(sessionCookie, decoded.exp);
      } catch {}
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    
    // Clear session cookie
    response.cookies.set({
      name: "naeemi_customer_session",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error: any) {
    return serverErrorResponse("/api/customer/logout");
  }
}
