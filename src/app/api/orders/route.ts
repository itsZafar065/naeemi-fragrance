import { NextResponse } from "next/server";
import { serverErrorResponse } from "@/lib/api-response";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";
import { sanitizeInput } from "@/lib/security";
import { sendOrderConfirmation, sendOrderStatusEmail } from "@/lib/email";
import { getPusherServer } from "@/lib/pusher";
import { requireServerEnv } from "@/lib/env";
import { isJwtRevoked } from "@/lib/auth-tokens";

const JWT_SECRET = requireServerEnv("JWT_SECRET");
const ALLOWED_ORDER_STATUSES = new Set(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]);

function getBaseProductId(rawId: unknown, volume: unknown): string {
  const id = String(rawId || "");
  const selectedVolume = typeof volume === "string" ? volume.trim() : "";
  if (selectedVolume && id.endsWith(`-${selectedVolume}`)) {
    return id.slice(0, -selectedVolume.length - 1);
  }
  return id;
}

async function verifyAdminToken(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("naeemi_session="))
    ?.split("=")[1];

  if (!sessionCookie) return null;

  try {
    if (await isJwtRevoked(sessionCookie)) return null;
    const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;
    const db = await getDb();
    const ObjectId = require("mongodb").ObjectId;
    const dbUser = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) });
    if (!dbUser) return null;
    return { userId: decoded.userId, email: dbUser.email, role: dbUser.role, name: dbUser.name };
  } catch (error) {
    return null;
  }
}

async function getVerifiedCustomerFromSession(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("naeemi_customer_session="))
    ?.split("=")[1];

  if (!sessionCookie) return null;

  try {
    if (await isJwtRevoked(sessionCookie)) return null;
    const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;
    const db = await getDb();
    const ObjectId = require("mongodb").ObjectId;
    const customer = await db.collection("customers").findOne({ _id: new ObjectId(decoded.customerId) });
    if (!customer || customer.verified === false) return null;
    return {
      customerId: customer._id.toString(),
      email: customer.email,
      name: customer.name,
    };
  } catch {
    return null;
  }
}

// GET all orders & system logs (Admin only)
export async function GET(request: Request) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const orders = await db.collection("orders").find({}).sort({ date: -1 }).toArray();
    
    // Fetch logs & customers list (Owner/Admin only)
    let logs: any[] = [];
    let customers: any[] = [];
    if (admin.role === "Owner" || admin.role === "Admin") {
      const rawLogs = await db.collection("logs").find({}).sort({ date: -1 }).limit(100).toArray();
      logs = rawLogs.map((log) => ({
        _id: log._id,
        action: log.action,
        user: "[REDACTED]",
        role: log.role,
        date: log.date,
        details: log.details || "",
      }));
    }
    
    if (admin.role === "Owner" || admin.role === "Admin") {
      customers = await db
        .collection("customers")
        .find({}, { projection: { _id: 0, passwordHash: 0 } })
        .toArray();
    }

    return NextResponse.json({ orders, logs, customers });
  } catch (error: any) {
    return serverErrorResponse("/api/orders");
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
      paymentSlipUrl,
      couponCode
    } = sanitizedBody;

    if (!customerName || !customerPhone || !customerAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required order parameters" }, { status: 400 });
    }

    const db = await getDb();
    const sessionCustomer = await getVerifiedCustomerFromSession(request);
    const normalizedCustomerEmail = sessionCustomer
      ? sessionCustomer.email
      : typeof customerEmail === "string"
        ? customerEmail.toLowerCase().trim()
        : "";

    // Verify stock availability and recalculate subtotal on the server
    let calculatedSubtotal = 0;
    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        return NextResponse.json({ error: "Invalid item quantity." }, { status: 400 });
      }

      const baseProductId = getBaseProductId(item.perfumeId, item.volume);
      const prod = await db.collection("products").findOne({ id: baseProductId });
      if (!prod) {
        return NextResponse.json({ error: `Product ${item.name} not found.` }, { status: 404 });
      }

      // Calculate server expected price depending on variant size comparison
      let expectedUnitPrice = prod.price;
      let expectedStock = prod.stock;
      const baseVolume = prod.volume || "100ml";
      const orderedVolume = item.volume || "100ml";
      const selectedVariant = Array.isArray(prod.variants)
        ? prod.variants.find((variant: any) => variant.volume === orderedVolume)
        : null;
      
      if (selectedVariant) {
        expectedUnitPrice = Number(selectedVariant.price);
        expectedStock = Number(selectedVariant.stock);
      } else if (baseVolume === "100ml" && orderedVolume === "50ml") {
        expectedUnitPrice = Math.round(prod.price * 0.7);
      } else if (baseVolume === "50ml" && orderedVolume === "100ml") {
        expectedUnitPrice = Math.round(prod.price * 1.45);
      }

      if (!Number.isFinite(expectedUnitPrice) || expectedUnitPrice <= 0) {
        return NextResponse.json({ error: "Invalid product pricing configuration." }, { status: 400 });
      }

      if (expectedStock < quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${item.name}. Only ${expectedStock} left.` }, { status: 400 });
      }

      calculatedSubtotal += expectedUnitPrice * quantity;
      
      // Override client-provided item price with server-validated price
      item.price = expectedUnitPrice;
      item.quantity = quantity;
      item.perfumeId = baseProductId;
    }

    // Verify coupon code and fetch discount from database
    let discountPercent = 0;
    if (couponCode) {
      const dbCoupon = await db.collection("coupons").findOne({ code: couponCode.toUpperCase().trim() });
      if (dbCoupon) {
        discountPercent = Number(dbCoupon.discount);
        if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 90) {
          return NextResponse.json({ error: "Invalid coupon configuration." }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: "Invalid coupon code provided." }, { status: 400 });
      }
    }

    // Calculate final total amount
    const shippingFee = calculatedSubtotal > 6000 ? 0 : 250;
    const discountAmount = Math.round(calculatedSubtotal * (discountPercent / 100));
    const expectedTotal = calculatedSubtotal - discountAmount + shippingFee;

    // Enforce pricing match validation within 2 Rs margin for safe decimal rounding
    if (Math.abs(Number(totalAmount) - expectedTotal) > 2) {
      return NextResponse.json({ error: "Checkout payment total mismatch. Transaction rejected." }, { status: 400 });
    }

    // Process order
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      customerName,
      customerId: sessionCustomer?.customerId || null,
      customerEmail: normalizedCustomerEmail,
      customerPhone,
      customerAddress,
      items,
      totalAmount: expectedTotal, // Use recalculated validated total
      paymentSlipUrl: paymentSlipUrl || null,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    // Deduct stocks
    for (const item of items) {
      const orderedVolume = item.volume || "100ml";
      const product = await db.collection("products").findOne({ id: item.perfumeId.toString() });
      const hasVariant = Array.isArray(product?.variants) && product.variants.some((variant: any) => variant.volume === orderedVolume);
      const updateResult = hasVariant
        ? await db.collection("products").updateOne(
            {
              id: item.perfumeId.toString(),
              variants: { $elemMatch: { volume: orderedVolume, stock: { $gte: Number(item.quantity) } } },
            },
            { $inc: { "variants.$.stock": -Number(item.quantity) } }
          )
        : await db.collection("products").updateOne(
            { id: item.perfumeId.toString(), stock: { $gte: Number(item.quantity) } },
            { $inc: { stock: -Number(item.quantity) } }
          );

      if (updateResult.modifiedCount === 0) {
        return NextResponse.json({ error: "Stock changed before checkout completed. Please refresh your cart." }, { status: 409 });
      }
    }

    await db.collection("orders").insertOne(newOrder);

    // Asynchronously dispatch SMTP confirmation email if configurations are set
    if (newOrder.customerEmail) {
      sendOrderConfirmation(newOrder.customerEmail, newOrder).catch(() => {
        console.error(`Failed to send order confirmation for ${orderId}.`);
      });
    }

    // Real-time synchronization broadcast via Pusher
    const pusher = getPusherServer();
    if (pusher) {
      await pusher.trigger("naeemi-channel", "new-order", {
        orderId
      }).catch(() => console.error("Pusher trigger failed."));
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    return serverErrorResponse("/api/orders");
  }
}

// PUT update order status (Admin only)
export async function PUT(request: Request) {
  try {
    const admin = await verifyAdminToken(request);
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

    if (!ALLOWED_ORDER_STATUSES.has(status)) {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
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
      user: "[REDACTED]",
      role: admin.role,
      date: new Date().toISOString(),
      details: `Updated order status for ${orderId} to '${status}'.`,
    });

    // Asynchronously dispatch order status update notification to customer
    const updatedOrder = await db.collection("orders").findOne({ id: orderId });
    if (updatedOrder && updatedOrder.customerEmail) {
      sendOrderStatusEmail(updatedOrder, status).catch(() => {
        console.error(`Failed to send order status email for ${orderId}.`);
      });
    }

    // Real-time synchronization broadcast via Pusher
    const pusher = getPusherServer();
    if (pusher) {
      await pusher.trigger("naeemi-channel", "order-status-updated", {
        orderId,
        status
      }).catch(() => console.error("Pusher trigger failed."));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return serverErrorResponse("/api/orders");
  }
}
