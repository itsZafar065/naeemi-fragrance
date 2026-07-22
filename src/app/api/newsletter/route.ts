import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sanitizeInput, validateEmail } from "@/lib/security";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sanitizedBody = sanitizeInput(body);
    const { email } = sanitizedBody;

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!validateEmail(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email address format" }, { status: 400 });
    }

    const db = await getDb();
    
    // Check if already subscribed
    const existing = await db.collection("newsletter_subscribers").findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json({ success: true, message: "You are already subscribed to our list!" });
    }

    await db.collection("newsletter_subscribers").insertOne({
      email: cleanEmail,
      subscribed_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Thank you for subscribing to our scent newsletter!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
