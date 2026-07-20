"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

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
  customerEmail?: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  paymentSlipUrl?: string | null;
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

export interface AdminUser {
  email: string;
  role: "Owner" | "Admin" | "Manager";
  name: string;
}

export interface SystemLog {
  _id?: string;
  action: string;
  user: string;
  role?: string;
  date: string;
  details: string;
}

interface AdminContextType {
  products: Perfume[];
  orders: Order[];
  coupons: Coupon[];
  settings: StoreSettings;
  adminUser: AdminUser | null;
  systemLogs: SystemLog[];
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  addProduct: (product: Omit<Perfume, "id" | "rating">) => Promise<{ success: boolean; error?: string }>;
  updateProduct: (id: string, updatedProduct: Partial<Perfume>) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  placeOrder: (customerName: string, customerEmail: string, customerPhone: string, customerAddress: string, items: OrderItem[], totalAmount: number, paymentSlipUrl?: string | null) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<{ success: boolean; error?: string }>;
  getSalesSummary: () => { totalSales: number; totalOrders: number; pendingOrders: number; lowStockCount: number };
  addCoupon: (coupon: Coupon) => Promise<{ success: boolean; error?: string }>;
  deleteCoupon: (code: string) => Promise<{ success: boolean; error?: string }>;
  updateSettings: (settings: Partial<StoreSettings>) => void;
  staffUsers: AdminUser[];
  addStaff: (user: any) => Promise<{ success: boolean; error?: string }>;
  deleteStaff: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const DEFAULT_SETTINGS: StoreSettings = {
  websiteName: "Naeemi Fragrance",
  tagline: "Naeemi Naam Hai Mohabbat Ka",
  codEnabled: true,
  easyPaisaAccount: "03092184760",
  shippingFee: 250,
  freeShippingThreshold: 6000,
  metaTitle: "Naeemi Fragrance | Premium Scent & Oud Store",
  metaDescription: "Explore luxury fragrances including Shams Un Naeemi, Oud Un Naeemi, and Qaswa.",
  metaKeywords: "Naeemi Fragrance, Shams Un Naeemi, Oud Un Naeemi, Qaswa",
  emailTemplateOrder: "Dear {{name}}, Thank you for placing your order.",
  adminUsers: ["owner@naeemi.com", "admin@naeemi.com", "manager@naeemi.com"],
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Perfume[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [staffUsers, setStaffUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  const settingsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load Initial Public Data & Check Session
  useEffect(() => {
    async function initData() {
      try {
        setLoading(true);
        // 1. Fetch Products
        const prodRes = await fetch("/api/products");
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }

        // 2. Fetch Settings
        const settingsRes = await fetch("/api/settings");
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData && Object.keys(settingsData).length > 0) {
            setSettings(settingsData);
          }
        }

        // 3. Fetch Coupons
        const couponsRes = await fetch("/api/coupons");
        if (couponsRes.ok) {
          const couponsData = await couponsRes.json();
          setCoupons(couponsData);
        }

        // 4. Check Auth Session
        const sessionRes = await fetch("/api/auth/session");
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData.authenticated) {
            setAdminUser(sessionData.user);
            // 5. Fetch Admin Data (Orders & Logs)
            await fetchAdminData();
          }
        }
      } catch (err) {
        console.error("Failed to initialize database connection:", err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const ordersRes = await fetch("/api/orders");
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders || []);
        setSystemLogs(data.logs || []);
      }
      
      const staffRes = await fetch("/api/admins");
      if (staffRes.ok) {
        const staffData = await staffRes.json();
        setStaffUsers(staffData || []);
      }
    } catch (e) {
      console.error("Failed to fetch admin dashboard records:", e);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Authentication failed." };
      }

      const data = await res.json();
      setAdminUser(data.user);
      await fetchAdminData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAdminUser(null);
      setOrders([]);
      setSystemLogs([]);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const refreshSession = async () => {
    const res = await fetch("/api/auth/session");
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated) {
        setAdminUser(data.user);
        await fetchAdminData();
      } else {
        setAdminUser(null);
      }
    }
  };

  const addProduct = async (product: Omit<Perfume, "id" | "rating">) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Failed to add product." };
      }

      const data = await res.json();
      setProducts([...products, data.product]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Perfume>) => {
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updatedProduct }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Failed to update product." };
      }

      setProducts(products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Failed to delete product." };
      }

      setProducts(products.filter((p) => p.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const placeOrder = async (
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    customerAddress: string,
    items: OrderItem[],
    totalAmount: number,
    paymentSlipUrl?: string | null
  ) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          customerName, 
          customerEmail, 
          customerPhone, 
          customerAddress, 
          items, 
          totalAmount,
          paymentSlipUrl: paymentSlipUrl || null
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Failed to place order." };
      }

      const data = await res.json();

      // Refresh product stock local state after checkout
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
      setProducts(updatedProducts);

      return { success: true, orderId: data.orderId };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Failed to update order status." };
      }

      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
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

  const addCoupon = async (coupon: Coupon): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coupon),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Failed to create coupon." };
      }

      setCoupons([...coupons, coupon]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteCoupon = async (code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/coupons?code=${code}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Failed to delete coupon." };
      }

      setCoupons(coupons.filter((c) => c.code !== code));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateSettings = (updatedFields: Partial<StoreSettings>) => {
    const updated = { ...settings, ...updatedFields };
    setSettings(updated);

    // Debounced update to MongoDB to prevent rapid keypress API flood
    if (settingsTimeoutRef.current) clearTimeout(settingsTimeoutRef.current);

    settingsTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
      } catch (err) {
        console.error("Failed to save settings modifications to database:", err);
      }
    }, 1000);
  };

  const addStaff = async (user: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Failed to create staff account." };
      }

      const data = await res.json();
      setStaffUsers([...staffUsers, data.user]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteStaff = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/admins?email=${email}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, error: errorData.error || "Failed to revoke staff credentials." };
      }

      setStaffUsers(staffUsers.filter((u) => u.email !== email));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        coupons,
        settings,
        adminUser,
        systemLogs,
        loading,
        login,
        logout,
        refreshSession,
        addProduct,
        updateProduct,
        deleteProduct,
        placeOrder,
        updateOrderStatus,
        getSalesSummary,
        addCoupon,
        deleteCoupon,
        updateSettings,
        staffUsers,
        addStaff,
        deleteStaff,
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
