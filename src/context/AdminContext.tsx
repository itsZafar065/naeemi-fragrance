"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Perfume {
  id: string;
  name: string;
  description: string;
  price: number;
  volume: string;
  type: string;
  category: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  stock: number;
  rating: number;
  imageUrl: string;
}

export interface OrderItem {
  perfumeId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
}

export interface Coupon {
  code: string;
  discount: number;
  description: string;
}

export interface StoreSettings {
  websiteName: string;
  tagline: string;
  codEnabled: boolean;
  easyPaisaAccount: string;
  shippingFee: number;
  freeShippingThreshold: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  emailTemplateOrder: string;
  adminUsers: string[];
}

interface AdminContextType {
  products: Perfume[];
  orders: Order[];
  coupons: Coupon[];
  settings: StoreSettings;
  addProduct: (product: Omit<Perfume, "id" | "rating">) => void;
  updateProduct: (id: string, updatedProduct: Partial<Perfume>) => void;
  deleteProduct: (id: string) => void;
  placeOrder: (customerName: string, customerPhone: string, customerAddress: string, items: OrderItem[], totalAmount: number) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  getSalesSummary: () => { totalSales: number; totalOrders: number; pendingOrders: number; lowStockCount: number };
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  updateSettings: (settings: Partial<StoreSettings>) => void;
}

const DEFAULT_PRODUCTS: Perfume[] = [
  {
    id: "1",
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
    imageUrl: "linear-gradient(135deg, #fbc531 0%, #f1c40f 100%)",
  },
  {
    id: "2",
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
    imageUrl: "linear-gradient(135deg, #c5a880 0%, #533a1c 100%)",
  },
  {
    id: "3",
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
    imageUrl: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
  },
  {
    id: "4",
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
    imageUrl: "linear-gradient(135deg, #1e272e 0%, #485460 100%)",
  },
  {
    id: "5",
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
    imageUrl: "linear-gradient(135deg, #ffd3b6 0%, #ff8b94 100%)",
  },
  {
    id: "6",
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
    imageUrl: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
  },
  {
    id: "7",
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
    imageUrl: "linear-gradient(135deg, #e84118 0%, #c23616 100%)",
  },
  {
    id: "8",
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
    imageUrl: "linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)",
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ORD-1001",
    customerName: "Salman Khan",
    customerPhone: "03001234567",
    customerAddress: "House 24, Block C, Gulberg III, Lahore",
    items: [
      { perfumeId: "2", name: "Oud Un Naeemi", quantity: 1, price: 8500 }
    ],
    totalAmount: 8500,
    status: "Delivered",
    date: "2026-07-18"
  },
  {
    id: "ORD-1002",
    customerName: "Ayesha Ahmed",
    customerPhone: "03339876543",
    customerAddress: "Apartment 4B, Ocean Heights, Clifton, Karachi",
    items: [
      { perfumeId: "6", name: "Musk e Naeemi", quantity: 2, price: 5900 }
    ],
    totalAmount: 11800,
    status: "Pending",
    date: "2026-07-20"
  }
];

const DEFAULT_COUPONS: Coupon[] = [
  { code: "NAEEMI10", discount: 10, description: "10% Off for Naeemi Fragrance launches" },
  { code: "MOHABBAT20", discount: 20, description: "20% Off - Naam Hai Mohabbat Ka promo" },
];

const DEFAULT_SETTINGS: StoreSettings = {
  websiteName: "Naeemi Fragrance",
  tagline: "Naeemi Naam Hai Mohabbat Ka",
  codEnabled: true,
  easyPaisaAccount: "03092184760",
  shippingFee: 250,
  freeShippingThreshold: 6000,
  metaTitle: "Naeemi Fragrance | Premium Scent & Oud Store",
  metaDescription: "Explore luxury fragrances including Shams Un Naeemi, Oud Un Naeemi, and Qaswa. Crafted for high sillage and longevity.",
  metaKeywords: "Naeemi Fragrance, Shams Un Naeemi, Oud Un Naeemi, Qaswa, Lahore Perfumes",
  emailTemplateOrder: "Dear {{name}}, Thank you for placing your order {{orderId}} for Rs. {{amount}}. Your shipment will arrive shortly.",
  adminUsers: ["admin@naeemi.com", "zafar@naeemi.com"],
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Perfume[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

  // Load from LocalStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem("naeemi_products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.setItem("naeemi_products", JSON.stringify(DEFAULT_PRODUCTS));
    }

    const savedOrders = localStorage.getItem("naeemi_orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(DEFAULT_ORDERS);
      localStorage.setItem("naeemi_orders", JSON.stringify(DEFAULT_ORDERS));
    }

    const savedCoupons = localStorage.getItem("naeemi_coupons");
    if (savedCoupons) {
      setCoupons(JSON.parse(savedCoupons));
    } else {
      setCoupons(DEFAULT_COUPONS);
      localStorage.setItem("naeemi_coupons", JSON.stringify(DEFAULT_COUPONS));
    }

    const savedSettings = localStorage.getItem("naeemi_settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem("naeemi_settings", JSON.stringify(DEFAULT_SETTINGS));
    }
  }, []);

  const saveProducts = (updated: Perfume[]) => {
    setProducts(updated);
    localStorage.setItem("naeemi_products", JSON.stringify(updated));
  };

  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    localStorage.setItem("naeemi_orders", JSON.stringify(updated));
  };

  const addProduct = (product: Omit<Perfume, "id" | "rating">) => {
    const newProduct: Perfume = {
      ...product,
      id: Date.now().toString(),
      rating: 5.0,
    };
    saveProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Perfume>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p));
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  const placeOrder = (
    customerName: string,
    customerPhone: string,
    customerAddress: string,
    items: OrderItem[],
    totalAmount: number
  ) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerPhone,
      customerAddress,
      items,
      totalAmount,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    // Deduct stock
    const updatedProducts = products.map((prod) => {
      const orderItem = items.find((item) => item.perfumeId === prod.id);
      if (orderItem) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - orderItem.quantity),
        };
      }
      return prod;
    });

    saveProducts(updatedProducts);
    saveOrders([newOrder, ...orders]);
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    saveOrders(updated);
  };

  const getSalesSummary = () => {
    const totalSales = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === "Pending").length;
    const lowStockCount = products.filter((p) => p.stock <= 5).length;

    return {
      totalSales,
      totalOrders,
      pendingOrders,
      lowStockCount,
    };
  };

  const addCoupon = (coupon: Coupon) => {
    const updated = [...coupons, coupon];
    setCoupons(updated);
    localStorage.setItem("naeemi_coupons", JSON.stringify(updated));
  };

  const deleteCoupon = (code: string) => {
    const updated = coupons.filter((c) => c.code !== code);
    setCoupons(updated);
    localStorage.setItem("naeemi_coupons", JSON.stringify(updated));
  };

  const updateSettings = (updatedFields: Partial<StoreSettings>) => {
    const updated = { ...settings, ...updatedFields };
    setSettings(updated);
    localStorage.setItem("naeemi_settings", JSON.stringify(updated));
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        coupons,
        settings,
        addProduct,
        updateProduct,
        deleteProduct,
        placeOrder,
        updateOrderStatus,
        getSalesSummary,
        addCoupon,
        deleteCoupon,
        updateSettings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
