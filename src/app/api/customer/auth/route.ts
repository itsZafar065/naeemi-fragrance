import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { 
  sanitizeInput, 
  rateLimit, 
  validateEmail,
  validatePassword
} from "@/lib/security";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

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

    const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;

    // Fetch latest user data from DB to ensure it's fresh
    const db = await getDb();
    const ObjectId = require("mongodb").ObjectId;
    const customer = await db.collection("customers").findOne({ _id: new ObjectId(decoded.customerId) });

    if (!customer) {
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

// POST login or signup customer
export async function POST(request: Request) {
  try {
    // 1. Rate limiting by IP
    const clientIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!rateLimit(clientIp, 20, 60000)) { // 20 requests per minute
      return NextResponse.json({ error: "Too many requests. Please wait 1 minute." }, { status: 429 });
    }

    const body = await request.json();
    const sanitizedBody = sanitizeInput(body);
    const { action, email, password, name, phone, address } = sanitizedBody;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!validateEmail(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
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
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      }

      // Hash password and save
      const passwordHash = await bcrypt.hash(password, 10);
      const newCustomer = {
        name,
        email: cleanEmail,
        phone,
        address: address || "",
        passwordHash,
        created_at: new Date().toISOString(),
      };

      const result = await db.collection("customers").insertOne(newCustomer);

      // Create JWT session
      const token = jwt.sign(
        {
          customerId: result.insertedId.toString(),
          email: cleanEmail,
          name,
        },
        JWT_SECRET,
        { expiresIn: "30d" } // Customers get 30 days session
      );

      const response = NextResponse.json({
        success: true,
        customer: {
          id: result.insertedId.toString(),
          email: cleanEmail,
          name,
          phone,
          address: address || "",
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
    } else {
      // Default: login
      const customer = await db.collection("customers").findOne({ email: cleanEmail });

      if (!customer) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, customer.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      // Create JWT session
      const token = jwt.sign(
        {
          customerId: customer._id.toString(),
          email: cleanEmail,
          name: customer.name,
        },
        JWT_SECRET,
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

    const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;

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
