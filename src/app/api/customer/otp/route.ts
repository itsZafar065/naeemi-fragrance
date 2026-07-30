import { NextResponse } from "next/server";
import { serverErrorResponse } from "@/lib/api-response";
import { getDb } from "@/lib/db";
import { generateOtp, hashOtp, sanitizeInput, rateLimit, rateLimitKey, validateEmail } from "@/lib/security";
import { sendEmailVerificationOtp, sendForgotPasswordOtp } from "@/lib/email";
import { requireServerEnv } from "@/lib/env";

const JWT_SECRET = requireServerEnv("JWT_SECRET");

// POST handler to generate and dispatch OTP
export async function POST(request: Request) {
  try {
    // Apply IP-based rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!rateLimit(clientIp, 5, 60000)) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
    }

    const body = await request.json();
    const sanitizedBody = sanitizeInput(body);
    const { email, type, name } = sanitizedBody;

    if (!email || !type) {
      return NextResponse.json({ error: "Email and OTP type are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!validateEmail(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    if (type === "forgot_password" && !rateLimitKey(`forgot-password:${clientIp}`, 3, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many password reset attempts. Please wait 1 hour." }, { status: 429 });
    }

    if (type === "email_verification" && !rateLimitKey(`email-verification:${clientIp}`, 5, 60000)) {
      return NextResponse.json({ error: "Too many verification attempts. Please wait 1 minute." }, { status: 429 });
    }

    const db = await getDb();

    // Verification-specific checks
    if (type === "forgot_password") {
      const customer = await db.collection("customers").findOne({ email: cleanEmail });
      if (!customer) {
        return NextResponse.json({ error: "No account exists with this email address." }, { status: 404 });
      }
      if (customer.verified === false) {
        return NextResponse.json({ error: "This account's email is not verified yet. Please sign up again." }, { status: 400 });
      }
    } else if (type === "email_verification") {
      const customer = await db.collection("customers").findOne({ email: cleanEmail });
      if (customer && customer.verified === true) {
        return NextResponse.json({ error: "This email is already verified. Please login instead." }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid OTP type specified." }, { status: 400 });
    }

    // Generate 6-digit numeric OTP code
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // Remove any existing active OTP codes of the same type for this email and purge expired ones
    await db.collection("otps").deleteMany({ expiresAt: { $lt: new Date() } });
    await db.collection("otps").deleteMany({ email: cleanEmail, type });

    // Save new OTP code
    await db.collection("otps").insertOne({
      email: cleanEmail,
      otpHash: hashOtp(otp, JWT_SECRET),
      type,
      createdAt: new Date(),
      expiresAt,
    });

    // Send email using custom responsive brand templates
    if (type === "email_verification") {
      const displayName = name || cleanEmail.split("@")[0];
      await sendEmailVerificationOtp(cleanEmail, displayName, otp);
    } else {
      const customer = await db.collection("customers").findOne({ email: cleanEmail });
      const displayName = customer ? customer.name : cleanEmail.split("@")[0];
      await sendForgotPasswordOtp(cleanEmail, displayName, otp);
    }

    return NextResponse.json({ success: true, message: "Verification OTP code sent successfully." });
  } catch (error: any) {
    return serverErrorResponse("/api/customer/otp");
  }
}
