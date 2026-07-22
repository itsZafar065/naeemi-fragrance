import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  try {
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
