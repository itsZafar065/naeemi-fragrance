import { NextResponse } from "next/server";
import { serverErrorResponse } from "@/lib/api-response";
import { getDb } from "@/lib/db";
import { rateLimitKey, sanitizeInput } from "@/lib/security";

// GET reviews for a specific product
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Missing productId query parameter" }, { status: 400 });
    }

    const db = await getDb();
    const reviews = await db
      .collection("reviews")
      .find({ productId: productId.toString() })
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json(reviews);
  } catch (error: any) {
    return serverErrorResponse("/api/reviews");
  }
}

// POST create a review for a specific product
export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!rateLimitKey(`review:${clientIp}`, 3, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many review submissions. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const sanitizedBody = sanitizeInput(body);
    const { productId, name, rating, text } = sanitizedBody;

    if (!productId || !name || !rating || !text) {
      return NextResponse.json({ error: "Missing required review fields" }, { status: 400 });
    }

    const cleanName = name.trim();
    const cleanText = text.trim();
    if (cleanName.length < 2 || cleanName.length > 80 || cleanText.length < 10 || cleanText.length > 1000) {
      return NextResponse.json({ error: "Review name or text length is invalid." }, { status: 400 });
    }

    const db = await getDb();

    // Verify product exists in database before accepting reviews
    const prod = await db.collection("products").findOne({ id: productId.toString() });
    if (!prod) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const newReview = {
      productId: productId.toString(),
      name: cleanName,
      rating: Math.max(1, Math.min(5, Number(rating))),
      text: cleanText,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      created_at: new Date().toISOString(),
    };

    await db.collection("reviews").insertOne(newReview);

    // Recalculate average rating of the product and update it in products collection
    const allReviews = await db.collection("reviews").find({ productId: productId.toString() }).toArray();
    const avgRating = allReviews.reduce((sum, r) => sum + Number(r.rating), 0) / allReviews.length;

    await db.collection("products").updateOne(
      { id: productId.toString() },
      { $set: { rating: parseFloat(avgRating.toFixed(1)) } }
    );

    return NextResponse.json({ success: true, review: newReview, avgRating });
  } catch (error: any) {
    return serverErrorResponse("/api/reviews");
  }
}
