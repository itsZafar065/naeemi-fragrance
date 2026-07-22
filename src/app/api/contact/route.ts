import { NextResponse } from "next/server";
import { sanitizeInput, rateLimit, validateEmail } from "@/lib/security";
import { sendContactInquiry } from "@/lib/email";

// POST handler to submit inquiry message
export async function POST(request: Request) {
  try {
    // 1. Rate limiting by IP to prevent contact form spamming (max 3 submissions per 5 minutes)
    const clientIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!rateLimit(clientIp, 3, 5 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many contact submissions. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const sanitizedBody = sanitizeInput(body);
    const { name, email, phone, message } = sanitizedBody;

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!validateEmail(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email address format." }, { status: 400 });
    }

    if (name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters long." }, { status: 400 });
    }

    if (message.trim().length < 10) {
      return NextResponse.json({ error: "Message must be at least 10 characters long." }, { status: 400 });
    }

    // Dispatch SMTP email notification to the business owner
    await sendContactInquiry(name.trim(), cleanEmail, phone.trim(), message.trim());

    return NextResponse.json({
      success: true,
      message: "Thank you. Your inquiry has been sent to our customer care team."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
