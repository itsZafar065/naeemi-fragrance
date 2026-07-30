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
      .find((c) => c.startsWith("naeemi_customer_session="))
      ?.split("=")[1];

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;
    const db = await getDb();

    // Verify customer exists and is verified in the DB before returning data
    const ObjectId = require("mongodb").ObjectId;
    const customer = await db.collection("customers").findOne({ _id: new ObjectId(decoded.customerId) });
    if (!customer || customer.verified === false) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all orders associated with this customer's email address
    const orders = await db
      .collection("orders")
      .find({ customerEmail: decoded.email })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
