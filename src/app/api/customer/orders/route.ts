import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("naeemi_customer_session="))
      ?.split("=")[1];

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;
    const db = await getDb();

    // Find all orders associated with this customer's email address
    const orders = await db
      .collection("orders")
      .find({ customerEmail: decoded.email })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
