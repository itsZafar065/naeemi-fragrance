import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { 
  sanitizeInput, 
  rateLimit, 
  validateEmail,
  validatePassword
} from "@/lib/security";
import { 
  sendEmailVerificationOtp, 
  sendWelcomeEmail 
} from "@/lib/email";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getPusherServer } from "@/lib/pusher";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("Missing JWT_SECRET environment variable");
}
const SECRET = JWT_SECRET || "fallback_secret_key";

// GET current customer session
export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("naeemi_customer_session="))
      ?.split("=")[1];

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false });
    }

    const decoded = jwt.verify(sessionCookie, SECRET) as any;

    // Fetch latest user data from DB to ensure it's fresh
    const db = await getDb();
    const ObjectId = require("mongodb").ObjectId;
    const customer = await db.collection("customers").findOne({ _id: new ObjectId(decoded.customerId) });

    if (!customer || customer.verified === false) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      customer: {
        id: customer._id.toString(),
        email: customer.email,
        name: customer.name,
        phone: customer.phone || "",
        address: customer.address || "",
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}

// POST login, signup, verification, and password reset actions
export async function POST(request: Request) {
  try {
    // 1. Rate limiting by IP to protect endpoints
    const clientIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!rateLimit(clientIp, 20, 60000)) { // 20 requests per minute
      return NextResponse.json({ error: "Too many requests. Please wait 1 minute." }, { status: 429 });
    }

    const body = await request.json();
    const sanitizedBody = sanitizeInput(body);
    const { action, email, password, name, phone, address, otp, newPassword } = sanitizedBody;

    if (!email || (action !== "verify_signup" && action !== "reset_password" && !password)) {
      return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    if (!validateEmail(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    const db = await getDb();

    if (action === "signup") {
      // Validation for signup
      if (!name || !phone) {
        return NextResponse.json({ error: "Name and Phone number are required for registration." }, { status: 400 });
      }

      if (!validatePassword(password)) {
        return NextResponse.json({ 
          error: "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number." 
        }, { status: 400 });
      }

      // Check if customer already exists
      const existingCustomer = await db.collection("customers").findOne({ email: cleanEmail });
      
      if (existingCustomer) {
        if (existingCustomer.verified === true) {
          return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
        }
        
        // If they already signed up but never verified, overwrite their details and password
        const passwordHash = await bcrypt.hash(password, 10);
        await db.collection("customers").updateOne(
          { email: cleanEmail },
          {
            $set: {
              name,
              phone,
              address: address || "",
              passwordHash,
              verified: false,
              created_at: new Date().toISOString(),
            }
          }
        );
      } else {
        // Create new unverified customer
        const passwordHash = await bcrypt.hash(password, 10);
        const newCustomer = {
          name,
          email: cleanEmail,
          phone,
          address: address || "",
          passwordHash,
          verified: false,
          created_at: new Date().toISOString(),
        };
        await db.collection("customers").insertOne(newCustomer);
      }

      // Generate 6-digit email verification OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

      // Store OTP and purge expired ones
      await db.collection("otps").deleteMany({ expiresAt: { $lt: new Date() } });
      await db.collection("otps").deleteMany({ email: cleanEmail, type: "email_verification" });
      await db.collection("otps").insertOne({
        email: cleanEmail,
        otp: generatedOtp,
        type: "email_verification",
        createdAt: new Date(),
        expiresAt,
      });

      // Send OTP verification email
      await sendEmailVerificationOtp(cleanEmail, name, generatedOtp);

      return NextResponse.json({
        success: true,
        needsVerification: true,
        email: cleanEmail,
        message: "A 6-digit verification code has been sent to your email."
      });

    } else if (action === "verify_signup") {
      if (!otp) {
        return NextResponse.json({ error: "Verification code is required." }, { status: 400 });
      }

      // Retrieve verification OTP from DB
      const activeOtp = await db.collection("otps").findOne({
        email: cleanEmail,
        otp: otp.trim(),
        type: "email_verification"
      });

      if (!activeOtp) {
        return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
      }

      if (new Date() > new Date(activeOtp.expiresAt)) {
        return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });
      }

      // Mark customer as verified in database
      await db.collection("customers").updateOne(
        { email: cleanEmail },
        { $set: { verified: true } }
      );

      // Delete verified OTP record
      await db.collection("otps").deleteMany({ email: cleanEmail, type: "email_verification" });

      const customer = await db.collection("customers").findOne({ email: cleanEmail });
      if (!customer) {
        return NextResponse.json({ error: "Customer not found." }, { status: 404 });
      }

      // Send brand Welcome Email
      await sendWelcomeEmail(cleanEmail, customer.name);

      // Real-time synchronization broadcast via Pusher
      const pusher = getPusherServer();
      if (pusher) {
        await pusher.trigger("naeemi-channel", "customer-registered", {
          customer: {
            id: customer._id.toString(),
            email: customer.email,
            name: customer.name,
            phone: customer.phone || "",
            address: customer.address || "",
          }
        }).catch((e) => console.error("Pusher trigger failed:", e));
      }

      // Create secure login JWT session
      const token = jwt.sign(
        {
          customerId: customer._id.toString(),
          email: cleanEmail,
          name: customer.name,
        },
        SECRET,
        { expiresIn: "30d" }
      );

      const response = NextResponse.json({
        success: true,
        customer: {
          id: customer._id.toString(),
          email: cleanEmail,
          name: customer.name,
          phone: customer.phone || "",
          address: customer.address || "",
        },
      });

      response.cookies.set({
        name: "naeemi_customer_session",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;

    } else if (action === "reset_password") {
      if (!otp || !newPassword) {
        return NextResponse.json({ error: "Verification code and new password are required." }, { status: 400 });
      }

      if (!validatePassword(newPassword)) {
        return NextResponse.json({ 
          error: "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number." 
        }, { status: 400 });
      }

      // Retrieve forgot password OTP
      const activeOtp = await db.collection("otps").findOne({
        email: cleanEmail,
        otp: otp.trim(),
        type: "forgot_password"
      });

      if (!activeOtp) {
        return NextResponse.json({ error: "Invalid password reset code." }, { status: 400 });
      }

      if (new Date() > new Date(activeOtp.expiresAt)) {
        return NextResponse.json({ error: "Password reset code has expired. Please request a new one." }, { status: 400 });
      }

      // Hash and update customer password
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await db.collection("customers").updateOne(
        { email: cleanEmail },
        { $set: { passwordHash } }
      );

      // Delete password reset OTP record
      await db.collection("otps").deleteMany({ email: cleanEmail, type: "forgot_password" });

      return NextResponse.json({
        success: true,
        message: "Password updated successfully. You can now login."
      });

    } else {
      // Default action: login
      const customer = await db.collection("customers").findOne({ email: cleanEmail });

      if (!customer) {
        const response = NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        response.cookies.delete("naeemi_customer_session");
        return response;
      }

      const isMatch = await bcrypt.compare(password, customer.passwordHash);
      if (!isMatch) {
        const response = NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        response.cookies.delete("naeemi_customer_session");
        return response;
      }

      // If unverified login attempt, trigger fresh OTP and block login until verified
      if (customer.verified === false) {
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await db.collection("otps").deleteMany({ expiresAt: { $lt: new Date() } });
        await db.collection("otps").deleteMany({ email: cleanEmail, type: "email_verification" });
        await db.collection("otps").insertOne({
          email: cleanEmail,
          otp: generatedOtp,
          type: "email_verification",
          createdAt: new Date(),
          expiresAt,
        });

        await sendEmailVerificationOtp(cleanEmail, customer.name, generatedOtp);

        return NextResponse.json({
          success: true,
          needsVerification: true,
          email: cleanEmail,
          message: "Your email is not verified yet. We have dispatched a new verification code to your email."
        });
      }

      // Create session cookie
      const token = jwt.sign(
        {
          customerId: customer._id.toString(),
          email: cleanEmail,
          name: customer.name,
        },
        SECRET,
        { expiresIn: "30d" }
      );

      const response = NextResponse.json({
        success: true,
        customer: {
          id: customer._id.toString(),
          email: cleanEmail,
          name: customer.name,
          phone: customer.phone || "",
          address: customer.address || "",
        },
      });

      response.cookies.set({
        name: "naeemi_customer_session",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT to update profile details (saved address/phone)
export async function PUT(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("naeemi_customer_session="))
      ?.split("=")[1];

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(sessionCookie, SECRET) as any;

    const body = await request.json();
    const sanitizedBody = sanitizeInput(body);
    const { name, phone, address } = sanitizedBody;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and Phone are required." }, { status: 400 });
    }

    const db = await getDb();
    const ObjectId = require("mongodb").ObjectId;

    await db.collection("customers").updateOne(
      { _id: new ObjectId(decoded.customerId) },
      {
        $set: {
          name,
          phone,
          address: address || "",
        }
      }
    );

    return NextResponse.json({
      success: true,
      customer: {
        id: decoded.customerId,
        email: decoded.email,
        name,
        phone,
        address: address || "",
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE permanently delete customer account from database
export async function DELETE(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const sessionCookie = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("naeemi_customer_session="))
      ?.split("=")[1];

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(sessionCookie, SECRET) as any;
    const db = await getDb();
    const ObjectId = require("mongodb").ObjectId;

    // Delete customer document from DB
    const deleteResult = await db.collection("customers").deleteOne({
      _id: new ObjectId(decoded.customerId)
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Delete associated OTPs if any
    await db.collection("otps").deleteMany({ email: decoded.email });

    const response = NextResponse.json({ success: true, message: "Account deleted permanently" });
    response.cookies.delete("naeemi_customer_session");
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
