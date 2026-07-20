import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

// Helper to verify admin token and returns claims
function verifyAdminToken(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("naeemi_session="))
    ?.split("=")[1];

  if (!sessionCookie) return null;

  try {
    const decoded = jwt.verify(sessionCookie, JWT_SECRET) as any;
    // Roles: 'Owner' | 'Admin' | 'Manager'
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET all products
export async function GET() {
  try {
    const db = await getDb();
    const products = await db.collection("products").find({}).toArray();
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create new product
export async function POST(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Role check: Only Owner and Admin can create products
    if (admin.role !== "Owner" && admin.role !== "Admin") {
      return NextResponse.json({ error: "Forbidden: Insufficient Permissions" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, volume, type, category, topNotes, heartNotes, baseNotes, stock, imageUrl } = body;

    if (!name || !price || !volume) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    const db = await getDb();
    const newProduct = {
      id: Date.now().toString(),
      name,
      description,
      price: Number(price),
      volume,
      type,
      category,
      topNotes: Array.isArray(topNotes) ? topNotes : [],
      heartNotes: Array.isArray(heartNotes) ? heartNotes : [],
      baseNotes: Array.isArray(baseNotes) ? baseNotes : [],
      stock: Number(stock) || 0,
      rating: 5.0,
      imageUrl: imageUrl || "linear-gradient(135deg, #ffd3b6 0%, #ff8b94 100%)",
    };

    await db.collection("products").insertOne(newProduct);

    // Logging activity log
    await db.collection("logs").insertOne({
      action: "Create Product",
      user: admin.email,
      role: admin.role,
      date: new Date().toISOString(),
      details: `Created new perfume listing: ${name} (${volume}).`,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update product stock or pricing
export async function PUT(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Role check: Owner, Admin, and Manager can edit/restock products
    if (admin.role !== "Owner" && admin.role !== "Admin" && admin.role !== "Manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("products").updateOne({ id: id.toString() }, { $set: updates });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Logging activity log
    await db.collection("logs").insertOne({
      action: "Update Product",
      user: admin.email,
      role: admin.role,
      date: new Date().toISOString(),
      details: `Updated product properties for ID ${id}: ${JSON.stringify(updates)}.`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE product listing
export async function DELETE(request: Request) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Role check: Only Owner and Admin can delete listings
    if (admin.role !== "Owner" && admin.role !== "Admin") {
      return NextResponse.json({ error: "Forbidden: Insufficient Permissions" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const db = await getDb();
    const product = await db.collection("products").findOne({ id: id.toString() });
    
    const result = await db.collection("products").deleteOne({ id: id.toString() });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Logging activity log
    await db.collection("logs").insertOne({
      action: "Delete Product",
      user: admin.email,
      role: admin.role,
      date: new Date().toISOString(),
      details: `Deleted perfume listing: ${product?.name || "ID " + id}.`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
