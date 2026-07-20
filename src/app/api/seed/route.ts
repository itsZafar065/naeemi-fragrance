import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

const DEFAULT_PRODUCTS = [
  {
    name: "Shams Un Naeemi",
    description: "A bright, celestial warmth blending luxurious Saffron, Golden Amber, and warm Vanilla. Renders an inviting, royal projection.",
    price: 6800,
    volume: "100ml",
    type: "Eau de Parfum (EDP)",
    category: "Oriental",
    topNotes: ["Saffron", "Bergamot"],
    heartNotes: ["Rose Accord", "Jasmine"],
    baseNotes: ["Golden Amber", "Vanilla", "Musk"],
    stock: 18,
    rating: 4.9,
    imageUrl: "/shams.jpeg",
  },
  {
    name: "Oud Un Naeemi",
    description: "The signature masterpiece of the house. Majestic Cambodian Oud refined with velvet Damascus Rose and soft sandalwood undertones.",
    price: 8500,
    volume: "100ml",
    type: "Extrait de Parfum",
    category: "Oud",
    topNotes: ["Damascus Rose", "Saffron"],
    heartNotes: ["Cambodian Oud", "Patchouli"],
    baseNotes: ["Sandalwood", "Ambergris", "Vanilla"],
    stock: 25,
    rating: 5.0,
    imageUrl: "/oud.jpeg",
  },
  {
    name: "Qaswa",
    description: "An intense, sophisticated leather composition blended with cardamom spices, black violet, and rich smoky vetiver base.",
    price: 7200,
    volume: "50ml",
    type: "Eau de Parfum (EDP)",
    category: "Oriental",
    topNotes: ["Cardamom", "Black Violet"],
    heartNotes: ["Leather Accord", "Tuscan Orris"],
    baseNotes: ["Smoky Vetiver", "Amber", "Cedarwood"],
    stock: 15,
    rating: 4.8,
    imageUrl: "/qaswa.jpeg",
  },
  {
    name: "Oud Albaloshi",
    description: "A complex woody and spicy journey featuring dark agarwood notes, zesty pink pepper, raw oakmoss, and deep sea ambergris.",
    price: 8900,
    volume: "100ml",
    type: "Extrait de Parfum",
    category: "Oud",
    topNotes: ["Pink Pepper", "Bergamot"],
    heartNotes: ["Agarwood", "Patchouli"],
    baseNotes: ["Oakmoss", "Ambergris", "White Musk"],
    stock: 12,
    rating: 4.9,
    imageUrl: "/albaloshi.jpeg",
  },
  {
    name: "Gul e Najaf",
    description: "A delicate floral accord presenting pure white roses, morning jasmine, powdery iris roots, and clean luxurious musk.",
    price: 6400,
    volume: "100ml",
    type: "Eau de Parfum (EDP)",
    category: "Floral",
    topNotes: ["White Rose", "Mandarin"],
    heartNotes: ["French Jasmine", "Orris Root"],
    baseNotes: ["Clean White Musk", "Vanilla"],
    stock: 20,
    rating: 4.7,
    imageUrl: "/najaf.jpeg",
  },
  {
    name: "Musk e Naeemi",
    description: "The ultimate clean scent. A powdery, velvety cushion of pure white musk, fresh lily of the valley, and soft vanilla extract.",
    price: 5900,
    volume: "100ml",
    type: "Eau de Parfum (EDP)",
    category: "Fresh",
    topNotes: ["Lily of the Valley", "Anise"],
    heartNotes: ["Pure White Musk", "Powder Accord"],
    baseNotes: ["Madagascar Vanilla", "Amber"],
    stock: 30,
    rating: 4.8,
    imageUrl: "/musk.jpeg",
  },
  {
    name: "Gul e Quds",
    description: "A powerful combination of rich red roses, luxury saffron threads, earth patchouli leaves, and a touch of golden amber.",
    price: 7800,
    volume: "100ml",
    type: "Eau de Parfum (EDP)",
    category: "Floral",
    topNotes: ["Saffron", "Spicy Accords"],
    heartNotes: ["Damascus Rose", "Patchouli"],
    baseNotes: ["Golden Amber", "Sandalwood"],
    stock: 9,
    rating: 4.9,
    imageUrl: "/quds.jpeg",
  },
  {
    name: "Zouq e Safar",
    description: "An adventurous citrus freshness combining zesty Italian bergamot, fresh grapefruit, vetiver roots, and a cedar dry down.",
    price: 5500,
    volume: "100ml",
    type: "Eau de Toilette (EDT)",
    category: "Fresh",
    topNotes: ["Italian Bergamot", "Grapefruit"],
    heartNotes: ["Sea Accord", "Ginger"],
    baseNotes: ["Cedarwood", "Vetiver Root", "Musk"],
    stock: 4,
    rating: 4.6,
    imageUrl: "/safar.jpeg",
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reset = searchParams.get("reset") === "true";

    const db = await getDb();

    if (reset) {
      // Clear out the database collections to force refresh seed
      await db.collection("products").deleteMany({});
      await db.collection("users").deleteMany({});
      await db.collection("coupons").deleteMany({});
      await db.collection("settings").deleteMany({});
    }

    // 1. Seed Products if empty
    const productsCount = await db.collection("products").countDocuments();
    if (productsCount === 0) {
      const productsToInsert = DEFAULT_PRODUCTS.map((p, idx) => ({
        ...p,
        id: (idx + 1).toString(),
      }));
      await db.collection("products").insertMany(productsToInsert);
    }

    // 2. Seed Users if empty
    const usersCount = await db.collection("users").countDocuments();
    if (usersCount === 0) {
      const ownerPasswordHash = await bcrypt.hash("NaeemiOwner123!", 10);
      const adminPasswordHash = await bcrypt.hash("NaeemiAdmin123!", 10);
      const managerPasswordHash = await bcrypt.hash("NaeemiManager123!", 10);

      const usersToInsert = [
        {
          email: "owner@naeemi.com",
          passwordHash: ownerPasswordHash,
          role: "Owner",
          name: "Zafar Owner",
          created_at: new Date().toISOString(),
        },
        {
          email: "admin@naeemi.com",
          passwordHash: adminPasswordHash,
          role: "Admin",
          name: "Zafar Admin",
          created_at: new Date().toISOString(),
        },
        {
          email: "manager@naeemi.com",
          passwordHash: managerPasswordHash,
          role: "Manager",
          name: "Zafar Manager",
          created_at: new Date().toISOString(),
        }
      ];
      await db.collection("users").insertMany(usersToInsert);
    }

    // 3. Seed Coupons if empty
    const couponsCount = await db.collection("coupons").countDocuments();
    if (couponsCount === 0) {
      const couponsToInsert = [
        { code: "NAEEMI10", discount: 10, description: "10% Off for Naeemi launches" },
        { code: "MOHABBAT20", discount: 20, description: "20% Off - Naam Hai Mohabbat Ka promo" },
      ];
      await db.collection("coupons").insertMany(couponsToInsert);
    }

    // 4. Seed Settings if empty
    const settingsCount = await db.collection("settings").countDocuments();
    if (settingsCount === 0) {
      const defaultSettings = {
        websiteName: "Naeemi Fragrance",
        tagline: "Naeemi Naam Hai Mohabbat Ka",
        codEnabled: true,
        easyPaisaAccount: "03092184760",
        shippingFee: 250,
        freeShippingThreshold: 6000,
        metaTitle: "Naeemi Fragrance | Premium Scent & Oud Store",
        metaDescription: "Explore luxury fragrances including Shams Un Naeemi, Oud Un Naeemi, and Qaswa.",
        metaKeywords: "Naeemi Fragrance, Shams Un Naeemi, Oud Un Naeemi, Qaswa",
        emailTemplateOrder: "Dear {{name}}, Thank you for placing your order {{orderId}} for Rs. {{amount}}.",
        adminUsers: ["admin@naeemi.com", "zafar@naeemi.com"],
      };
      await db.collection("settings").insertOne(defaultSettings);
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
