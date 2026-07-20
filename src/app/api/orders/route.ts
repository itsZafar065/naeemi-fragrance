import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";
import { sanitizeInput } from "@/lib/security";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

function verifyAdminToken(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("naeemi_session="))
    ?.split("=")[1];

  if (!sessionCookie) return null;

  try {
    const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// SMTP Confirmation Email Dispatcher
async function sendConfirmationEmail(customerEmail: string, orderId: string, customerName: string, amount: number) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass || !customerEmail) {
    console.log("SMTP environment credentials or recipient email missing. Email dispatch skipped.");
    return;
  }

  try {
    const db = await getDb();
    const settings = await db.collection("settings").findOne({});
    const template = settings?.emailTemplateOrder || "Dear {{name}}, Thank you for placing order {{orderId}} for Rs. {{amount}}.";

    // Compile templates variables
    const emailBody = template
      .replace(/{{name}}/g, customerName)
      .replace(/{{orderId}}/g, orderId)
      .replace(/{{amount}}/g, amount.toLocaleString());

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Naeemi Fragrance" <${user}>`,
      to: customerEmail,
      subject: `Naeemi Order Confirmation - ${orderId}`,
      text: emailBody,
      html: `<div style="font-family: sans-serif; padding: 25px; background-color: #faf7f2; border: 1px solid #d4af37; border-radius: 16px; color: #1c1917; max-width: 500px; mx-auto;">
        <h2 style="color: #aa7c11; font-family: serif; border-bottom: 1px solid #e8dec9; pb-10;">Naeemi Fragrances</h2>
        <p style="font-size: 13px; line-height: 1.6; color: #444;">${emailBody.replace(/\n/g, "<br />")}</p>
        <hr style="border: 0; border-top: 1px solid #e8dec9; margin-top: 25px; margin-bottom: 15px;" />
        <span style="font-size: 10px; color: #aa7c11; font-weight: bold; letter-spacing: 0.15em; uppercase">Naeemi Naam Hai Mohabbat Ka</span>
      </div>`,
    });
    console.log(`Confirmation email successfully delivered to ${customerEmail} for order ${orderId}`);
  } catch (error) {
    console.error("Nodemailer dispatcher failed:", error);
  }
}

// GET all orders & system logs (Admin only)
export async function GET(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const orders = await db.collection("orders").find({}).sort({ date: -1 }).toArray();
    
    // Fetch logs (Owner/Admin only)
    let logs: any[] = [];
    if (admin.role === "Owner" || admin.role === "Admin") {
      logs = await db.collection("logs").find({}).sort({ date: -1 }).limit(100).toArray();
    }

    return NextResponse.json({ orders, logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a new checkout order (Public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sanitizedBody = sanitizeInput(body);
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      customerAddress, 
      items, 
      totalAmount,
      paymentSlipUrl 
    } = sanitizedBody;

    if (!customerName || !customerPhone || !customerAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required order parameters" }, { status: 400 });
    }

    const db = await getDb();

    // Verify stock availability
    for (const item of items) {
      const prod = await db.collection("products").findOne({ id: item.perfumeId.toString() });
      if (!prod) {
        return NextResponse.json({ error: `Product ${item.name} not found.` }, { status: 404 });
      }
      if (prod.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${item.name}. Only ${prod.stock} left.` }, { status: 400 });
      }
    }

    // Process order
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      customerName,
      customerEmail: customerEmail || "",
      customerPhone,
      customerAddress,
      items,
      totalAmount: Number(totalAmount),
      paymentSlipUrl: paymentSlipUrl || null,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    // Deduct stocks
    for (const item of items) {
      await db.collection("products").updateOne(
        { id: item.perfumeId.toString() },
        { $inc: { stock: -Number(item.quantity) } }
      );
    }

    await db.collection("orders").insertOne(newOrder);

    // Asynchronously dispatch SMTP confirmation email if configurations are set
    if (newOrder.customerEmail) {
      sendConfirmationEmail(newOrder.customerEmail, orderId, customerName, newOrder.totalAmount);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update order status (Admin only)
export async function PUT(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Role check: Owner, Admin, and Manager can edit order status
    if (admin.role !== "Owner" && admin.role !== "Admin" && admin.role !== "Manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const sanitizedBody = sanitizeInput(body);
    const { orderId, status } = sanitizedBody;

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("orders").updateOne(
      { id: orderId },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Activity Log
    await db.collection("logs").insertOne({
      action: "Update Order",
      user: admin.email,
      role: admin.role,
      date: new Date().toISOString(),
      details: `Updated order status for ${orderId} to '${status}'.`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
