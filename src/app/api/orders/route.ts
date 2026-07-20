import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";

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
    const { customerName, customerPhone, customerAddress, items, totalAmount } = body;

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
      customerPhone,
      customerAddress,
      items,
      totalAmount: Number(totalAmount),
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
    const { orderId, status } = body;

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
