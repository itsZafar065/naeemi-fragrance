import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";
import { sanitizeInput } from "@/lib/security";
import { sendOrderConfirmation, sendOrderStatusEmail } from "@/lib/email";
import { getPusherServer } from "@/lib/pusher";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

async function verifyAdminToken(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("naeemi_session="))
    ?.split("=")[1];

  if (!sessionCookie) return null;

  try {
    const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;
    const db = await getDb();
    const dbUser = await db.collection("users").findOne({ email: decoded.email.toLowerCase().trim() });
    if (!dbUser) return null;
    return { ...decoded, role: dbUser.role, name: dbUser.name };
  } catch (error) {
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
      logs = await db.collection("logs").find({}).sort({ date: -1 }).limit(100).toArray();
    }
    
    // Always load registered customers registry for admin view
    customers = await db
      .collection("customers")
      .find({}, { projection: { passwordHash: 0 } })
      .toArray();

    return NextResponse.json({ orders, logs, customers });
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
      paymentSlipUrl,
      couponCode
    } = sanitizedBody;

    if (!customerName || !customerPhone || !customerAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required order parameters" }, { status: 400 });
    }

    const db = await getDb();

    // Verify stock availability and recalculate subtotal on the server
    let calculatedSubtotal = 0;
    for (const item of items) {
      const prod = await db.collection("products").findOne({ id: item.perfumeId.toString() });
      if (!prod) {
        return NextResponse.json({ error: `Product ${item.name} not found.` }, { status: 404 });
      }
      if (prod.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${item.name}. Only ${prod.stock} left.` }, { status: 400 });
      }

      // Calculate server expected price depending on variant size comparison
      let expectedUnitPrice = prod.price;
      const baseVolume = prod.volume || "100ml";
      const orderedVolume = item.volume || "100ml";
      
      if (baseVolume === "100ml" && orderedVolume === "50ml") {
        expectedUnitPrice = Math.round(prod.price * 0.7);
      } else if (baseVolume === "50ml" && orderedVolume === "100ml") {
        expectedUnitPrice = Math.round(prod.price * 1.45);
      }

      calculatedSubtotal += expectedUnitPrice * Number(item.quantity);
      
      // Override client-provided item price with server-validated price
      item.price = expectedUnitPrice;
    }

    // Verify coupon code and fetch discount from database
    let discountPercent = 0;
    if (couponCode) {
      const dbCoupon = await db.collection("coupons").findOne({ code: couponCode.toUpperCase().trim() });
      if (dbCoupon) {
        discountPercent = Number(dbCoupon.discount);
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
      customerEmail: customerEmail || "",
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
      await db.collection("products").updateOne(
        { id: item.perfumeId.toString() },
        { $inc: { stock: -Number(item.quantity) } }
      );
    }

    await db.collection("orders").insertOne(newOrder);

    // Asynchronously dispatch SMTP confirmation email if configurations are set
    if (newOrder.customerEmail) {
      sendOrderConfirmation(newOrder.customerEmail, newOrder).catch((err) => {
        console.error(`Failed to send order confirmation for ${orderId}:`, err);
      });
    }

    // Real-time synchronization broadcast via Pusher
    const pusher = getPusherServer();
    if (pusher) {
      await pusher.trigger("naeemi-channel", "new-order", {
        order: newOrder
      }).catch((e) => console.error("Pusher trigger failed:", e));
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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

    // Asynchronously dispatch order status update notification to customer
    const updatedOrder = await db.collection("orders").findOne({ id: orderId });
    if (updatedOrder && updatedOrder.customerEmail) {
      sendOrderStatusEmail(updatedOrder, status).catch((err) => {
        console.error(`Failed to send order status email for ${orderId}:`, err);
      });
    }

    // Real-time synchronization broadcast via Pusher
    const pusher = getPusherServer();
    if (pusher) {
      await pusher.trigger("naeemi-channel", "order-status-updated", {
        orderId,
        status
      }).catch((e) => console.error("Pusher trigger failed:", e));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
