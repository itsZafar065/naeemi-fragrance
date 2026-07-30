import { NextResponse } from "next/server";
import { serverErrorResponse } from "@/lib/api-response";
import { getDb } from "@/lib/db";
import { rateLimitKey } from "@/lib/security";

export async function GET(request: Request) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!rateLimitKey(`coupon-validate:${clientIp}`, 20, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many coupon checks. Please try again later." }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Missing coupon code parameter" }, { status: 400 });
    }

    const cleanCode = code.toUpperCase().trim();
    const db = await getDb();
    const dbCoupon = await db.collection("coupons").findOne({ code: cleanCode });

    if (!dbCoupon) {
      return NextResponse.json({ valid: false, error: "Invalid discount coupon code." });
    }

    return NextResponse.json({
      valid: true,
      code: dbCoupon.code,
      discount: Number(dbCoupon.discount),
      description: dbCoupon.description || ""
    });
  } catch (error: any) {
    return serverErrorResponse("/api/coupons/validate");
  }
}
