"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdmin, Perfume, Order, Coupon, StoreSettings, SystemLog } from "@/context/AdminContext";
import { 
  TrendingUp, 
  ShoppingBag, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle,
  Truck,
  XCircle,
  Package,
  Layers,
  ChevronDown,
  Users,
  Percent,
  BarChart3,
  Settings,
  Mail,
  Search,
  Key,
  Globe,
  Settings2,
  Phone,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  ClipboardList,
  ArrowLeft,
  Download
} from "lucide-react";

export default function AdminDashboard() {
  const { 
    products, 
    orders, 
    coupons,
    settings,
    adminUser,
    systemLogs,
    loading,
    registeredCustomers,
    login,
    logout,
    refreshSession,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus, 
    getSalesSummary,
    addCoupon,
    deleteCoupon,
    updateSettings,
    staffUsers,
    addStaff,
    deleteStaff
  } = useAdmin();

  // Authentication credentials states
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Tab State
  type TabType = 
    | "dashboard" 
    | "products" 
    | "orders" 
    | "customers" 
    | "inventory" 
    | "coupons" 
    | "analytics" 
    | "settings" 
    | "admins"
    | "logs";

  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [activeSettingsSubtab, setActiveSettingsSubtab] = useState<"website" | "payment" | "shipping" | "notifications" | "seo" | "storeinfo">("website");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Local settings editor state (to avoid lag/caret jumping and allow explicit saves)
  const [localSettings, setLocalSettings] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSaveSettings = async (updatedFieldsSubset: any) => {
    setSaveLoading(true);
    try {
      const dbPayload = { ...settings, ...updatedFieldsSubset };
      delete dbPayload._id; // Strip immutable database fields to prevent mongo write block

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dbPayload),
      });

      if (res.ok) {
        updateSettings(updatedFieldsSubset, false);
        alert("Settings saved successfully to the database!");
      } else {
        alert("Failed to save settings. Please try again.");
      }
    } catch (err) {
      console.error("Settings save error:", err);
      alert("Error saving settings.");
    } finally {
      setSaveLoading(false);
    }
  };

  // Summary Metrics
  const { totalSales, totalOrders, pendingOrders, lowStockCount } = getSalesSummary();

  // Real registered customers mapped with calculated orders count & spent
  const processedCustomers = registeredCustomers.map((cust) => {
    const custOrders = orders.filter((o) => o.customerPhone === cust.phone || (cust.email && o.customerEmail?.toLowerCase() === cust.email.toLowerCase()));
    const totalSpent = custOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const addresses = custOrders.reduce((acc: string[], o) => {
      if (!acc.includes(o.customerAddress)) acc.push(o.customerAddress);
      return acc;
    }, cust.address ? [cust.address] : []);
    
    return {
      name: cust.name,
      email: cust.email,
      phone: cust.phone || "—",
      addresses,
      ordersCount: custOrders.length,
      totalSpent
    };
  });

  // Form states for creating a new product
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [regularPrice, setRegularPrice] = useState<number | "">("");
  const [salePrice, setSalePrice] = useState<number | "">("");
  const [volume, setVolume] = useState("100ml");
  const [type, setType] = useState("Eau de Parfum (EDP)");
  const [category, setCategory] = useState("Oud");
  const [topNotes, setTopNotes] = useState("");
  const [heartNotes, setHeartNotes] = useState("");
  const [baseNotes, setBaseNotes] = useState("");
  const [stock, setStock] = useState(10);
  const [imagePath, setImagePath] = useState("/shams.webp");
  const [variantsList, setVariantsList] = useState<any[]>([]);

  // Variant addition states
  const [varVolume, setVarVolume] = useState("");
  const [varPrice, setVarPrice] = useState<number | "">("");
  const [varRegularPrice, setVarRegularPrice] = useState<number | "">("");
  const [varStock, setVarStock] = useState<number>(10);
  const [varSku, setVarSku] = useState("");
  
  // Stock edit states
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  // Full product editing specifications states
  const [editingProduct, setEditingProduct] = useState<Perfume | null>(null);
  const [editName, setEditName] = useState("");
  const [editSku, setEditSku] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLongDescription, setEditLongDescription] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editRegularPrice, setEditRegularPrice] = useState<number | "">("");
  const [editSalePrice, setEditSalePrice] = useState<number | "">("");
  const [editVolume, setEditVolume] = useState("100ml");
  const [editType, setEditType] = useState("Eau de Parfum (EDP)");
  const [editCategory, setEditCategory] = useState("Oud");
  const [editTopNotes, setEditTopNotes] = useState("");
  const [editHeartNotes, setEditHeartNotes] = useState("");
  const [editBaseNotes, setEditBaseNotes] = useState("");
  const [editStock, setEditStock] = useState(10);
  const [editImagePath, setEditImagePath] = useState("");
  const [editVariantsList, setEditVariantsList] = useState<any[]>([]);

  // Variant addition states for editing
  const [editVarVolume, setEditVarVolume] = useState("");
  const [editVarPrice, setEditVarPrice] = useState<number | "">("");
  const [editVarRegularPrice, setEditVarRegularPrice] = useState<number | "">("");
  const [editVarStock, setEditVarStock] = useState<number>(10);
  const [editVarSku, setEditVarSku] = useState("");

  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [newCouponDesc, setNewCouponDesc] = useState("");

  // Staff creation form states
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPassword, setNewStaffPassword] = useState("");
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<"Admin" | "Manager">("Manager");
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const formatLogDetails = (details: string) => {
    if (!details) return "";
    if (details.includes("Updated product properties for ID")) {
      try {
        const jsonStart = details.indexOf("{");
        if (jsonStart !== -1) {
          let jsonStr = details.substring(jsonStart).trim();
          if (jsonStr.endsWith(".")) {
            jsonStr = jsonStr.slice(0, -1).trim();
          }
          const parsed = JSON.parse(jsonStr);
          const idMatch = details.match(/ID (\w+)/);
          const id = idMatch ? idMatch[1] : "";
          
          const items = [];
          if (parsed.name) items.push(`Name: "${parsed.name}"`);
          if (parsed.price !== undefined) items.push(`Price: Rs. ${Number(parsed.price).toLocaleString()}`);
          if (parsed.regularPrice !== undefined) items.push(`Regular: Rs. ${Number(parsed.regularPrice).toLocaleString()}`);
          if (parsed.salePrice !== undefined) items.push(`Sale: Rs. ${Number(parsed.salePrice).toLocaleString()}`);
          if (parsed.stock !== undefined) items.push(`Stock: ${parsed.stock} units`);
          if (parsed.sku) items.push(`SKU: "${parsed.sku}"`);
          if (parsed.volume) items.push(`Volume: "${parsed.volume}"`);
          
          return `Updated product properties for ID ${id}: ${items.length > 0 ? items.join(", ") : "no text changes"}.`;
        }
      } catch (e) {
        // Fallback to raw string if parsing fails
      }
    }
    return details;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;

    setAuthLoading(true);
    setAuthError("");
    const result = await login(emailInput, passwordInput);
    setAuthLoading(false);

    if (!result.success) {
      setAuthError(result.error || "Invalid username or password.");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrice = salePrice ? Number(salePrice) : price ? Number(price) : 0;
    if (!name || !description || finalPrice <= 0 || stock < 0) return;

    const topArray = topNotes.split(",").map((n) => n.trim()).filter(Boolean);
    const heartArray = heartNotes.split(",").map((n) => n.trim()).filter(Boolean);
    const baseArray = baseNotes.split(",").map((n) => n.trim()).filter(Boolean);

    const result = await addProduct({
      name,
      sku: sku || "",
      description,
      longDescription: longDescription || "",
      price: finalPrice,
      regularPrice: regularPrice ? Number(regularPrice) : undefined,
      salePrice: salePrice ? Number(salePrice) : undefined,
      volume,
      type,
      category,
      topNotes: topArray.length ? topArray : ["Fresh Accord"],
      heartNotes: heartArray.length ? heartArray : ["Floral Essence"],
      baseNotes: baseArray.length ? baseArray : ["Amber Base"],
      stock,
      imageUrl: imagePath || "/shams.webp",
      variants: variantsList
    });

    if (result.success) {
      setName("");
      setSku("");
      setDescription("");
      setLongDescription("");
      setPrice(0);
      setRegularPrice("");
      setSalePrice("");
      setVolume("100ml");
      setType("Eau de Parfum (EDP)");
      setCategory("Oud");
      setTopNotes("");
      setHeartNotes("");
      setBaseNotes("");
      setStock(10);
      setImagePath("/shams.webp");
      setVariantsList([]);
      setShowAddForm(false);
    } else {
      alert(result.error || "Failed to add product listing");
    }
  };

  const handleStartEditProduct = (prod: Perfume) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditSku(prod.sku || "");
    setEditDescription(prod.description);
    setEditLongDescription(prod.longDescription || "");
    setEditPrice(prod.price);
    setEditRegularPrice(prod.regularPrice || "");
    setEditSalePrice(prod.salePrice || "");
    setEditVolume(prod.volume || "100ml");
    setEditType(prod.type || "Eau de Parfum (EDP)");
    setEditCategory(prod.category || "Oud");
    setEditTopNotes(prod.topNotes?.join(", ") || "");
    setEditHeartNotes(prod.heartNotes?.join(", ") || "");
    setEditBaseNotes(prod.baseNotes?.join(", ") || "");
    setEditStock(prod.stock);
    setEditImagePath(prod.imageUrl);
    setEditVariantsList(prod.variants || []);
  };

  const handleEditProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const finalPrice = editSalePrice ? Number(editSalePrice) : editPrice ? Number(editPrice) : 0;
    if (!editName || !editDescription || finalPrice <= 0 || editStock < 0) return;

    const topArray = editTopNotes.split(",").map((n) => n.trim()).filter(Boolean);
    const heartArray = editHeartNotes.split(",").map((n) => n.trim()).filter(Boolean);
    const baseArray = editBaseNotes.split(",").map((n) => n.trim()).filter(Boolean);

    const result = await updateProduct(editingProduct.id, {
      name: editName,
      sku: editSku,
      description: editDescription,
      longDescription: editLongDescription,
      price: finalPrice,
      regularPrice: editRegularPrice ? Number(editRegularPrice) : undefined,
      salePrice: editSalePrice ? Number(editSalePrice) : undefined,
      volume: editVolume,
      type: editType,
      category: editCategory,
      topNotes: topArray,
      heartNotes: heartArray,
      baseNotes: baseArray,
      stock: editStock,
      imageUrl: editImagePath,
      variants: editVariantsList
    });

    if (result.success) {
      setEditingProduct(null);
    } else {
      alert(result.error || "Failed to update product specifications.");
    }
  };

  const handleAddCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = newCouponCode.trim().toUpperCase();
    if (!code || newCouponDiscount <= 0) return;

    const result = await addCoupon({
      code,
      discount: newCouponDiscount,
      description: newCouponDesc || `${newCouponDiscount}% Discount Promo`
    });

    if (result.success) {
      setNewCouponCode("");
      setNewCouponDiscount(10);
      setNewCouponDesc("");
    } else {
      alert(result.error || "Failed to create coupon voucher");
    }
  };

  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail || !newStaffPassword || !newStaffName) return;

    const result = await addStaff({
      email: newStaffEmail,
      password: newStaffPassword,
      name: newStaffName,
      role: newStaffRole,
    });

    if (result.success) {
      setNewStaffEmail("");
      setNewStaffPassword("");
      setNewStaffName("");
      setNewStaffRole("Manager");
      setShowStaffForm(false);
      alert("Staff credentials registered successfully!");
    } else {
      alert(result.error || "Failed to create staff account");
    }
  };

  const handleExportOrdersCSV = () => {
    if (orders.length === 0) return;
    
    const headers = ["Order ID", "Date", "Customer Name", "Email", "Phone", "Address", "Items Summary", "Total Amount (Rs)", "Status", "Payment Slip"];
    const rows = orders.map((ord) => {
      const itemsSummary = ord.items.map((it) => `${it.name} (${it.quantity}x)`).join(" | ");
      return [
        ord.id,
        ord.date,
        `"${ord.customerName.replace(/"/g, '""')}"`,
        ord.customerEmail || "N/A",
        `"${ord.customerPhone}"`,
        `"${ord.customerAddress.replace(/"/g, '""')}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        ord.totalAmount,
        ord.status,
        ord.paymentSlipUrl || "COD"
      ];
    });

    const csvString = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `naeemi_orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleStartEditStock = (prod: Perfume) => {
    setEditingStockId(prod.id);
    setTempStockValue(prod.stock);
  };

  const handleSaveStock = async (id: string) => {
    const result = await updateProduct(id, { stock: Math.max(0, tempStockValue) });
    if (result.success) {
      setEditingStockId(null);
    } else {
      alert(result.error || "Failed to restock perfume inventory");
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, status: Order["status"]) => {
    const result = await updateOrderStatus(orderId, status);
    if (!result.success) {
      alert(result.error || "Failed to update order status");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fragrance listing?")) return;
    const result = await deleteProduct(id);
    if (!result.success) {
      alert(result.error);
    }
  };

  const getStatusBadgeColor = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
    }
  };

  // Auth gate check
  if (!adminUser) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 glass-panel rounded-[36px] border border-white/60 shadow-xl mt-12 space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center border-b pb-3 border-stone-200/50">
          <Link href="/more" className="text-stone-500 hover:text-amber-700 text-xs font-bold flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest">Portal Access</span>
        </div>

        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-stone-800 font-serif">Staff Access Portal</h2>
          <p className="text-xs text-stone-500">Sign in to manage Naeemi Fragrance shop operations</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-xl text-center">
              {authError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">Email Address</label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">Password</label>
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-3 rounded-xl gold-btn font-bold text-xs"
          >
            {authLoading ? "Authenticating Scent Vault..." : "Sign In Securely"}
          </button>
        </form>

        <div className="border-t border-stone-200/50 pt-4 text-center">
          <p className="text-[10px] text-stone-450 italic">Naeemi Fragrances secure operations terminal.</p>
        </div>
      </div>
    );
  }

  const handleMenuClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    // Auto-refresh fresh orders and log statistics in background on tab navigation
    if (tab === "dashboard" || tab === "orders" || tab === "logs" || tab === "customers") {
      refreshSession().catch(() => {});
    }
  };

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-10">
      
      {/* MOBILE HEADER BUTTONS */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white/70 backdrop-blur-md border border-stone-200 rounded-2xl">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5 text-stone-700 cursor-pointer" onClick={() => setMobileSidebarOpen(true)} />
          <span className="font-extrabold text-xs text-stone-850">
            Hub: {activeTab.toUpperCase()}
          </span>
        </div>
        <button onClick={logout} className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-500" title="Logout">
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* MOBILE COLLAPSIBLE DRAWER SIDEBAR */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-xs" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-72 h-full bg-[#faf7f2] p-5 shadow-2xl flex flex-col justify-between overflow-y-auto border-r">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="font-extrabold text-stone-800 text-sm">Naeemi Operations</h3>
                <X className="w-5 h-5 text-stone-500 cursor-pointer" onClick={() => setMobileSidebarOpen(false)} />
              </div>
              <nav className="flex flex-col gap-1">
                {renderSidebarMenu(activeTab, handleMenuClick, adminUser.role)}
              </nav>
            </div>
            <button
              onClick={() => { logout(); setMobileSidebarOpen(false); }}
              className="py-2.5 w-full bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout Session
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR NAVIGATION (Col 3) */}
      <aside className="hidden lg:block lg:col-span-3 glass-panel rounded-3xl p-5 space-y-6 border border-white/50 sticky top-24">
        {/* Profile Card Summary */}
        <div className="border-b border-stone-200/40 pb-4 text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-amber-600 text-white font-extrabold flex items-center justify-center mx-auto text-base shadow-sm">
            {adminUser.name[0]}
          </div>
          <h4 className="font-extrabold text-stone-800 text-xs truncate" title={adminUser.name}>
            {adminUser.name}
          </h4>
          <span className="text-[10px] bg-amber-500/10 text-amber-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
            {adminUser.role} Portal
          </span>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-1">
          {renderSidebarMenu(activeTab, handleMenuClick, adminUser.role)}
        </nav>

        {/* Logout bottom */}
        <div className="border-t border-stone-200/40 pt-4">
          <button
            onClick={logout}
            className="w-full py-2 px-3 hover:bg-rose-50 hover:text-rose-700 text-stone-500 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5"
          >
            <LogOut className="w-4 h-4" />
            Logout Hub
          </button>
        </div>
      </aside>

      {/* CORE DISPLAY PANEL (Col 9) */}
      <main className="lg:col-span-9 space-y-6 max-h-[85vh] overflow-y-auto pr-1">
        
        {/* TAB 1: Dashboard Overview */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-stone-850 tracking-tight font-serif">Naeemi Operations Dashboard</h2>
                <p className="text-xs text-stone-500 font-medium">Naeemi Fragrances sales statistics, stock levels, and logistics overview.</p>
              </div>
              <div className="text-right text-[10px] text-stone-450 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                Logged in as: <span className="text-amber-800 font-extrabold">{adminUser.role}</span>
              </div>
            </div>

            {/* Metrics cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Total Sales */}
              <div className="glass-panel p-5 rounded-3xl border border-white/60 shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider block">Total Sales</span>
                    <span className="text-xl font-extrabold text-stone-850 tracking-tight">Rs. {totalSales.toLocaleString()}</span>
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3.5 flex items-center gap-1.5 text-[9px] font-bold text-stone-550">
                  <span className="text-emerald-600">↑ 12%</span>
                  <span>vs last week performance</span>
                </div>
              </div>

              {/* Orders count */}
              <div className="glass-panel p-5 rounded-3xl border border-white/60 shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider block">Orders Placed</span>
                    <span className="text-xl font-extrabold text-stone-850 tracking-tight">{totalOrders} Orders</span>
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-700">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3.5 flex items-center gap-1.5 text-[9px] font-bold text-stone-550">
                  <span className="text-blue-700">{pendingOrders} Pending</span>
                  <span>awaiting courier dispatch</span>
                </div>
              </div>

              {/* Active Coupons */}
              <div className="glass-panel p-5 rounded-3xl border border-white/60 shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider block">Active Vouchers</span>
                    <span className="text-xl font-extrabold text-stone-850 tracking-tight">{coupons.length} Active</span>
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700">
                    <Percent className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3.5 flex items-center gap-1.5 text-[9px] font-bold text-stone-550">
                  <span>Available for checkout discounts</span>
                </div>
              </div>

              {/* Low Stock alerts */}
              <div className="glass-panel p-5 rounded-3xl border border-white/60 shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider block">Low Stock Alert</span>
                    <span className="text-xl font-extrabold text-stone-855 tracking-tight">{lowStockCount} Items</span>
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-700 animate-pulse">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3.5 flex items-center gap-1.5 text-[9px] font-bold text-stone-550">
                  {lowStockCount > 0 ? (
                    <span className="text-rose-700 font-bold">Needs restock attention</span>
                  ) : (
                    <span className="text-emerald-700 font-bold">Inventory levels normal</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section: Recent Orders & Activity logs grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Orders log list (Col 7) */}
              <div className="lg:col-span-7 glass-panel p-5 rounded-3xl space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-bold text-stone-800 text-sm">Recent Store Orders</h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-[10px] font-bold text-amber-700 hover:text-amber-600 transition-colors"
                  >
                    View All Orders
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-stone-500 py-6 text-center">No orders registered yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 4).map((order) => (
                      <div
                        key={order.id}
                        className="p-3.5 bg-white/40 border border-stone-200/40 rounded-2xl flex justify-between items-center text-xs hover:bg-white/60 transition-all cursor-pointer group"
                        onClick={() => {
                          setOrderSearchQuery(order.id);
                          setActiveTab("orders");
                        }}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-850 group-hover:text-amber-700 transition-colors">{order.customerName}</span>
                            <span className="text-[9px] text-stone-400 font-semibold">{order.id}</span>
                          </div>
                          <p className="text-[10px] text-stone-500 font-medium truncate max-w-xs md:max-w-md">
                            {order.items.map((i) => `${i.name} (${i.quantity}x)`).join(", ")}
                          </p>
                        </div>
                        <div className="text-right shrink-0 space-y-1">
                          <p className="font-extrabold text-stone-800">Rs. {order.totalAmount.toLocaleString()}</p>
                          <span className={`text-[8px] font-bold px-2 py-0.5 rounded border block text-center ${getStatusBadgeColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Staff Activity Logs (Col 5) */}
              <div className="lg:col-span-5 glass-panel p-5 rounded-3xl space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-bold text-stone-800 text-sm">Security Audit Activity</h3>
                  <button
                    onClick={() => setActiveTab("logs")}
                    className="text-[10px] font-bold text-amber-700 hover:text-amber-600 transition-colors"
                  >
                    Audits Feed
                  </button>
                </div>

                {systemLogs.length === 0 ? (
                  <p className="text-xs text-stone-500 py-6 text-center">No logs generated.</p>
                ) : (
                  <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                    {systemLogs.slice(0, 5).map((log, idx) => (
                      <div key={idx} className="text-xs space-y-1 relative pl-4 border-l border-stone-200">
                        <div className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 border border-[#faf7f2]" />
                        <div className="flex justify-between text-[10px] text-stone-400 font-bold">
                          <span>{log.user.split("@")[0]} ({log.role})</span>
                          <span>{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="font-bold text-stone-750 text-[11px] leading-snug">{log.action}</p>
                        <p className="text-[10px] text-stone-500 font-normal leading-relaxed">{formatLogDetails(log.details)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Products Catalogue CRUD */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-xl font-black text-stone-800 tracking-tight">Stock Catalogue</h2>
              {(adminUser.role === "Owner" || adminUser.role === "Admin") && (
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  {showAddForm ? "Close specifications form" : "Add Fragrance"}
                </button>
              )}
            </div>

            {showAddForm && (
              <form onSubmit={handleAddProduct} className="glass-panel p-6 rounded-3xl border border-amber-100 space-y-4">
                <h4 className="font-bold text-stone-855 text-xs border-b pb-2">Fragrance Parameters</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Name *</label>
                    <input
                      type="text" required placeholder="e.g. Zouq e Safar" value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Category *</label>
                    <select
                      value={category} onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                    >
                      <option value="Oud">Oud</option>
                      <option value="Floral">Floral</option>
                      <option value="Woody">Woody</option>
                      <option value="Fresh">Fresh</option>
                      <option value="Oriental">Oriental</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Product SKU</label>
                    <input
                      type="text" placeholder="e.g. NAE-ZOUQ-01" value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Fallback Price (Rs.) *</label>
                    <input
                      type="number" required min="1" placeholder="e.g. 6200" value={price || ""}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Retail Price (Regular - Rs.)</label>
                    <input
                      type="number" placeholder="e.g. 7000" value={regularPrice}
                      onChange={(e) => setRegularPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Sale Price (Selling - Rs.)</label>
                    <input
                      type="number" placeholder="e.g. 5999" value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value !== "" ? Number(e.target.value) : "")}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Fallback Stock *</label>
                    <input
                      type="number" required min="0" placeholder="10" value={stock || ""}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600 block">Scent Summary (Short Description) *</label>
                  <textarea
                    required rows={2} placeholder="Describe essential scent profile highlights..." value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600 block">Scent Details (Detailed Long Description)</label>
                  <textarea
                    rows={4} placeholder="Describe complete notes composition, details, application instructions..." value={longDescription}
                    onChange={(e) => setLongDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600 block">Image Path/Filename (e.g. /shams.webp) *</label>
                  <input
                    type="text" required placeholder="/shams.webp" value={imagePath}
                    onChange={(e) => setImagePath(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                {/* Variants Manager Container */}
                <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 space-y-3">
                  <label className="text-xs font-bold text-stone-700 block">Perfume Volume & Size Variants (e.g. 5ml, 12ml, 50ml, 100ml)</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 items-end">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 block uppercase">Volume (Size)</label>
                      <input type="text" placeholder="e.g. 12ml" value={varVolume} onChange={(e) => setVarVolume(e.target.value)} className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 block uppercase">Sale Price (Rs.)</label>
                      <input type="number" placeholder="1200" value={varPrice} onChange={(e) => setVarPrice(e.target.value !== "" ? Number(e.target.value) : "")} className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 block uppercase">Retail Price (Regular)</label>
                      <input type="number" placeholder="1500" value={varRegularPrice} onChange={(e) => setVarRegularPrice(e.target.value !== "" ? Number(e.target.value) : "")} className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-500 block uppercase">Stock Units</label>
                      <input type="number" placeholder="20" value={varStock} onChange={(e) => setVarStock(Number(e.target.value))} className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none" />
                    </div>
                    <div className="space-y-1 col-span-2 md:col-span-1">
                      <button type="button" onClick={() => {
                        if (!varVolume || !varPrice) return;
                        setVariantsList([...variantsList, {
                          volume: varVolume,
                          price: Number(varPrice),
                          regularPrice: varRegularPrice ? Number(varRegularPrice) : undefined,
                          stock: Number(varStock),
                          sku: varSku || `${sku || name}-${varVolume}`
                        }]);
                        setVarVolume("");
                        setVarPrice("");
                        setVarRegularPrice("");
                        setVarStock(10);
                        setVarSku("");
                      }} className="w-full py-2.5 gold-btn text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
                        Add Variant
                      </button>
                    </div>
                  </div>
                  {variantsList.length > 0 && (
                    <div className="pt-2 divide-y divide-stone-200 text-xs">
                      {variantsList.map((v, idx) => (
                        <div key={idx} className="py-2 flex justify-between items-center">
                          <span className="font-semibold text-stone-700">{v.volume} - Rs. {v.price} {v.regularPrice ? <span className="line-through text-stone-400 ml-1">Rs. {v.regularPrice}</span> : null} (Stock: {v.stock})</span>
                          <button type="button" onClick={() => setVariantsList(variantsList.filter((_, i) => i !== idx))} className="text-rose-600 hover:text-rose-700 font-bold text-[10px] cursor-pointer">
                            Remove Variant
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button" onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl gold-btn text-white font-bold text-xs">
                    Save Product
                  </button>
                </div>
              </form>
            )}

            <div className="glass-panel overflow-hidden rounded-3xl border border-stone-200/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50/70 text-[9px] font-bold text-stone-500 uppercase tracking-widest border-b">
                      <th className="p-3">Image</th>
                      <th className="p-3">Perfume</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock remaining</th>
                      {(adminUser.role === "Owner" || adminUser.role === "Admin") && (
                        <th className="p-3 text-right">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-stone-200/40">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-white/40">
                        <td className="p-3">
                          {prod.imageUrl && prod.imageUrl.startsWith("linear-gradient") ? (
                            <div className="w-8 h-8 rounded border" style={{ background: prod.imageUrl }} />
                          ) : (
                            <img src={prod.imageUrl} alt={prod.name} className="w-8 h-8 rounded border object-contain bg-white" />
                          )}
                        </td>
                        <td className="p-3 font-bold text-stone-855">{prod.name}</td>
                        <td className="p-3 text-stone-500">{prod.type}</td>
                        <td className="p-3 font-extrabold text-stone-700">Rs. {prod.price.toLocaleString()}</td>
                        <td className="p-3">
                          {editingStockId === prod.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number" value={tempStockValue}
                                onChange={(e) => setTempStockValue(Number(e.target.value))}
                                className="w-12 px-1 py-0.5 border text-xs"
                              />
                              <button onClick={() => handleSaveStock(prod.id)} className="bg-emerald-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded">
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold">{prod.stock} units</span>
                              <button onClick={() => handleStartEditStock(prod)} className="text-stone-400 hover:text-stone-700" title="Restock">
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>
                        {(adminUser.role === "Owner" || adminUser.role === "Admin") && (
                          <td className="p-3 text-right flex items-center justify-end gap-2">
                            <button onClick={() => handleStartEditProduct(prod)} className="text-stone-400 hover:text-amber-800 p-1" title="Edit Scent Specs">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteProduct(prod.id)} className="text-stone-400 hover:text-rose-500 p-1" title="Delete listing">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Overlay: Full Scent Catalog specifications CRUD editor */}
            {editingProduct && (
              <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
                <div className="bg-white rounded-3xl p-6 border border-stone-200/50 shadow-2xl max-w-3xl w-full my-8 relative max-h-[90vh] overflow-y-auto space-y-4 animate-scaleUp">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-stone-855 text-sm uppercase tracking-wider">Edit Fragrance Specifications</h3>
                    <button type="button" onClick={() => setEditingProduct(null)} className="text-stone-400 hover:text-stone-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleEditProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Name *</label>
                        <input
                          type="text" required value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Category *</label>
                        <select
                          value={editCategory} onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                        >
                          <option value="Oud">Oud</option>
                          <option value="Floral">Floral</option>
                          <option value="Woody">Woody</option>
                          <option value="Fresh">Fresh</option>
                          <option value="Oriental">Oriental</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Product SKU</label>
                        <input
                          type="text" placeholder="e.g. NAE-ZOUQ-01" value={editSku}
                          onChange={(e) => setEditSku(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Fallback Price (Rs.) *</label>
                        <input
                          type="number" required min="1" value={editPrice || ""}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Retail Price (Regular - Rs.)</label>
                        <input
                          type="number" value={editRegularPrice}
                          onChange={(e) => setEditRegularPrice(e.target.value !== "" ? Number(e.target.value) : "")}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Sale Price (Selling - Rs.)</label>
                        <input
                          type="number" value={editSalePrice}
                          onChange={(e) => setEditSalePrice(e.target.value !== "" ? Number(e.target.value) : "")}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Fallback Stock *</label>
                        <input
                          type="number" required min="0" value={editStock || ""}
                          onChange={(e) => setEditStock(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Scent Volume *</label>
                        <input
                          type="text" required value={editVolume}
                          onChange={(e) => setEditVolume(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Scent Concentration Type *</label>
                        <select
                          value={editType} onChange={(e) => setEditType(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                        >
                          <option value="Extrait de Parfum">Extrait de Parfum (Pure Scent)</option>
                          <option value="Eau de Parfum (EDP)">Eau de Parfum (EDP)</option>
                          <option value="Eau de Toilette (EDT)">Eau de Toilette (EDT)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Top Notes (comma-separated)</label>
                        <input
                          type="text" value={editTopNotes} onChange={(e) => setEditTopNotes(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Heart Notes (comma-separated)</label>
                        <input
                          type="text" value={editHeartNotes} onChange={(e) => setEditHeartNotes(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Base Notes (comma-separated)</label>
                        <input
                          type="text" value={editBaseNotes} onChange={(e) => setEditBaseNotes(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-600 block">Scent Summary (Short Description) *</label>
                      <textarea
                        required rows={2} value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-600 block">Scent Details (Detailed Long Description)</label>
                      <textarea
                        rows={3} value={editLongDescription}
                        onChange={(e) => setEditLongDescription(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-stone-600 block">Image Path/Filename (e.g. /shams.webp) *</label>
                      <input
                        type="text" required value={editImagePath}
                        onChange={(e) => setEditImagePath(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    {/* Variants Manager Container */}
                    <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 space-y-3">
                      <label className="text-xs font-bold text-stone-700 block">Perfume Volume & Size Variants</label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 items-end">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 block uppercase">Volume</label>
                          <input type="text" placeholder="e.g. 12ml" value={editVarVolume} onChange={(e) => setEditVarVolume(e.target.value)} className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 block uppercase">Sale Price (Rs.)</label>
                          <input type="number" placeholder="1200" value={editVarPrice} onChange={(e) => setEditVarPrice(e.target.value !== "" ? Number(e.target.value) : "")} className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 block uppercase">Retail Price</label>
                          <input type="number" placeholder="1500" value={editVarRegularPrice} onChange={(e) => setEditVarRegularPrice(e.target.value !== "" ? Number(e.target.value) : "")} className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-stone-500 block uppercase">Stock Units</label>
                          <input type="number" placeholder="20" value={editVarStock} onChange={(e) => setEditVarStock(Number(e.target.value))} className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none" />
                        </div>
                        <div className="space-y-1 col-span-2 md:col-span-1">
                          <button type="button" onClick={() => {
                            if (!editVarVolume || !editVarPrice) return;
                            setEditVariantsList([...editVariantsList, {
                              volume: editVarVolume,
                              price: Number(editVarPrice),
                              regularPrice: editVarRegularPrice ? Number(editVarRegularPrice) : undefined,
                              stock: Number(editVarStock),
                              sku: editVarSku || `${editSku || editName}-${editVarVolume}`
                            }]);
                            setEditVarVolume("");
                            setEditVarPrice("");
                            setEditVarRegularPrice("");
                            setEditVarStock(10);
                            setEditVarSku("");
                          }} className="w-full py-2.5 gold-btn text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
                            Add Variant
                          </button>
                        </div>
                      </div>
                      {editVariantsList.length > 0 && (
                        <div className="pt-2 divide-y divide-stone-200 text-xs">
                          {editVariantsList.map((v, idx) => (
                            <div key={idx} className="py-2 flex justify-between items-center">
                              <span className="font-semibold text-stone-700">{v.volume} - Rs. {v.price} {v.regularPrice ? <span className="line-through text-stone-400 ml-1">Rs. {v.regularPrice}</span> : null} (Stock: {v.stock})</span>
                              <button type="button" onClick={() => setEditVariantsList(editVariantsList.filter((_, i) => i !== idx))} className="text-rose-600 hover:text-rose-700 font-bold text-[10px] cursor-pointer">
                                Remove Variant
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button" onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-2 rounded-xl gold-btn text-white font-bold text-xs">
                        Save Scent Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Orders log */}
        {activeTab === "orders" && (() => {
          const filteredOrders = orders.filter(
            (ord) =>
              ord.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
              ord.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
              ord.customerPhone.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
              ord.customerAddress.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
              (ord.customerEmail && ord.customerEmail.toLowerCase().includes(orderSearchQuery.toLowerCase()))
          );

          return (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-stone-850 tracking-tight font-serif">Customer Placed Orders</h2>
                  <p className="text-xs text-stone-500 font-medium">Aap yahan se customer ke orders track aur updates kar sakte hain.</p>
                </div>
                <div className="flex items-center gap-3">
                  {orderSearchQuery && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-200/20">
                      {filteredOrders.length} matching {filteredOrders.length === 1 ? "order" : "orders"}
                    </span>
                  )}
                  <button
                    onClick={handleExportOrdersCSV}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Orders CSV
                  </button>
                </div>
              </div>

              {/* Live Search Order Input */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search orders by name, ID, phone, email, address..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none shadow-xs"
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
              </div>
              
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <p className="text-xs text-stone-500 py-6 text-center">No matching orders found.</p>
                ) : (
                  filteredOrders.map((ord) => (
                    <div key={ord.id} className="glass-panel p-5 rounded-3xl border border-stone-200/50 hover:border-amber-500/30 transition-all space-y-4">
                      {/* Card Header */}
                      <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-extrabold text-sm text-stone-850">{ord.id}</span>
                          <span className="text-[10px] text-stone-400 font-semibold">{ord.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => handleOrderStatusUpdate(ord.id, e.target.value as Order["status"])}
                            className={`border text-[10px] py-1 px-2.5 rounded-xl font-bold focus:outline-none transition-colors ${
                              ord.status === "Delivered" 
                                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                : ord.status === "Cancelled"
                                ? "bg-rose-50 border-rose-200 text-rose-800"
                                : ord.status === "Shipped"
                                ? "bg-blue-50 border-blue-200 text-blue-800"
                                : "bg-amber-50 border-amber-205 text-amber-800"
                            }`}
                          >
                            <option value="Pending">Pending Validation</option>
                            <option value="Shipped">Dispatched Courier</option>
                            <option value="Delivered">Delivered Order</option>
                            <option value="Cancelled">Cancelled Order</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Card Columns */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                        {/* Customer Info (Col 5) */}
                        <div className="md:col-span-5 space-y-2 border-r pr-4 border-stone-200/40">
                          <span className="font-extrabold text-stone-400 text-[8px] uppercase tracking-widest block">Recipient Details</span>
                          <p className="font-bold text-stone-800 text-sm">{ord.customerName}</p>
                          {ord.customerEmail && <p className="text-stone-500 font-medium">Email: {ord.customerEmail}</p>}
                          <p className="text-stone-600 font-semibold">Contact: {ord.customerPhone}</p>
                          <p className="text-stone-500 leading-relaxed font-medium">Address: {ord.customerAddress}</p>
                          
                          {/* Payment Slip Attachment */}
                          {ord.paymentSlipUrl && (
                            <div className="pt-2">
                              <span className="text-[8px] font-extrabold text-stone-400 uppercase tracking-widest block mb-1">EasyPaisa Transaction Receipt</span>
                              <a href={ord.paymentSlipUrl} target="_blank" rel="noreferrer" className="inline-block relative group">
                                <img src={ord.paymentSlipUrl} alt="Receipt Screenshot" className="w-20 h-20 object-cover rounded-xl border border-stone-200 hover:opacity-85 transition-all" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] text-white font-bold rounded-xl transition-all">
                                  Expand Image
                                </div>
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Items list table (Col 7) */}
                        <div className="md:col-span-7 flex flex-col justify-between">
                          <div className="space-y-2">
                            <span className="font-extrabold text-stone-400 text-[8px] uppercase tracking-widest block">Package Items</span>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse text-[11px] font-medium text-stone-600">
                                <thead>
                                  <tr className="border-b text-[8px] font-bold text-stone-400 uppercase tracking-widest">
                                    <th className="pb-1.5">Item Scent</th>
                                    <th className="pb-1.5 text-center">Qty</th>
                                    <th className="pb-1.5 text-right">Price</th>
                                    <th className="pb-1.5 text-right">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {ord.items.map((it, idx) => (
                                    <tr key={idx} className="border-b border-stone-100/50">
                                      <td className="py-2 text-stone-800 font-bold">{it.name}</td>
                                      <td className="py-2 text-center font-bold text-stone-500">{it.quantity}</td>
                                      <td className="py-2 text-right">Rs. {it.price.toLocaleString()}</td>
                                      <td className="py-2 text-right font-bold text-stone-800">Rs. {(it.price * it.quantity).toLocaleString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          
                          <div className="border-t pt-2 mt-4 flex justify-between items-center font-black text-stone-850">
                            <span className="text-[10px] text-stone-400 uppercase tracking-wider">Total Invested Amount:</span>
                            <span className="text-base text-amber-800 font-serif">Rs. {ord.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })()}

        {/* TAB 4: Customer registry */}
        {activeTab === "customers" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Customer Database Registry</h2>
            <div className="glass-panel overflow-hidden rounded-3xl border border-stone-200/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/70 border-b text-[9px] font-bold text-stone-500 uppercase tracking-widest">
                    <th className="p-3">Client</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Mobile Contact</th>
                    <th className="p-3">Address list</th>
                    <th className="p-3 text-center">Orders</th>
                    <th className="p-3">Total Invested</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-stone-200/40">
                  {processedCustomers.map((c, i) => (
                    <tr key={i} className="hover:bg-white/40">
                      <td className="p-3 font-bold text-stone-800">{c.name}</td>
                      <td className="p-3 font-semibold text-stone-500">{c.email}</td>
                      <td className="p-3 font-semibold text-stone-600">{c.phone}</td>
                      <td className="p-3 text-stone-500 max-w-xs truncate" title={c.addresses.join("; ")}>
                        {c.addresses.join("; ") || "—"}
                      </td>
                      <td className="p-3 text-center font-bold">{c.ordersCount}</td>
                      <td className="p-3 font-extrabold text-amber-800">Rs. {c.totalSpent.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Inventory Restocking */}
        {activeTab === "inventory" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Inventory Restocking System</h2>
            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Critical Low Stock Alerts (Stock &lt;= 5 bottles)
              </h3>
              <div className="divide-y divide-stone-100">
                {products.map(prod => {
                  const isLow = prod.stock <= 5;
                  const isEditingThis = editingStockId === prod.id;
                  return (
                    <div key={prod.id} className="py-2.5 flex justify-between items-center text-xs">
                      <span className="font-bold text-stone-700">{prod.name} ({prod.volume})</span>
                      <div className="flex items-center gap-3">
                        {isEditingThis ? (
                          <div className="flex items-center gap-1.5 animate-fadeIn">
                            <input
                              type="number"
                              value={tempStockValue}
                              onChange={(e) => setTempStockValue(Number(e.target.value))}
                              className="w-16 px-2 py-1 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveStock(prod.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingStockId(null)}
                              className="bg-stone-200 text-stone-600 font-bold text-[10px] px-3 py-1.5 rounded-lg border border-stone-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              prod.stock === 0 ? "bg-rose-50 text-rose-700" : isLow ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-700"
                            }`}>
                              {prod.stock === 0 ? "Out of stock" : `${prod.stock} units left`}
                            </span>
                            <button
                              onClick={() => { handleStartEditStock(prod); }}
                              className="bg-stone-800 text-white font-bold text-[10px] px-3 py-1 rounded-lg hover:bg-stone-700"
                            >
                              Quick restock
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Coupons management */}
        {activeTab === "coupons" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Voucher Management</h2>
            
            <form onSubmit={handleAddCouponSubmit} className="glass-panel p-5 rounded-3xl border border-white/50 space-y-3.5">
              <h3 className="font-bold text-stone-850 text-xs">Create New Coupon Voucher</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text" required placeholder="CODE e.g. GOLD25" value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="px-3.5 py-2.5 bg-white border rounded-xl text-xs uppercase"
                />
                <input
                  type="number" required min="1" max="99" placeholder="Discount % e.g. 25" value={newCouponDiscount || ""}
                  onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                  className="px-3.5 py-2.5 bg-white border rounded-xl text-xs"
                />
                <input
                  type="text" placeholder="Description text" value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  className="px-3.5 py-2.5 bg-white border rounded-xl text-xs"
                />
              </div>
              <button type="submit" className="px-5 py-2 rounded-xl gold-btn text-white font-bold text-xs">
                Add Coupon Code
              </button>
            </form>

            <div className="glass-panel rounded-3xl overflow-hidden border">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b text-[9px] font-bold text-stone-500 uppercase tracking-widest">
                    <th className="p-3">Coupon Code</th>
                    <th className="p-3">Discount Value</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y">
                  {coupons.map((cop) => (
                    <tr key={cop.code} className="hover:bg-white/40">
                      <td className="p-3 font-extrabold text-amber-800">{cop.code}</td>
                      <td className="p-3 font-bold text-stone-800">{cop.discount}% OFF</td>
                      <td className="p-3 text-stone-500">{cop.description}</td>
                      <td className="p-3 text-right">
                        <button onClick={async () => {
                          const result = await deleteCoupon(cop.code);
                          if (!result.success) alert(result.error || "Failed to delete coupon");
                        }} className="text-stone-400 hover:text-rose-500 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: Analytics Charts */}
        {activeTab === "analytics" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Accords Sales Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-5 rounded-3xl space-y-4">
                <h4 className="font-bold text-stone-800 text-xs">Top Accord Categories</h4>
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-stone-750">
                      <span>Shams Un Naeemi</span>
                      <span>Rs. {totalSales > 0 ? Math.round(totalSales * 0.45).toLocaleString() : "Rs. 28,000"}</span>
                    </div>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full">
                      <div className="bg-amber-500 h-full w-[45%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-stone-755">
                      <span>Oud Un Naeemi</span>
                      <span>Rs. {totalSales > 0 ? Math.round(totalSales * 0.35).toLocaleString() : "Rs. 18,500"}</span>
                    </div>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full">
                      <div className="bg-amber-500 h-full w-[35%]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-panel p-5 rounded-3xl flex flex-col justify-center items-center text-center">
                <span className="text-4xl font-extrabold text-stone-800">4.92 / 5.0</span>
                <span className="text-xs text-stone-400 mt-1">Average user review score</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: Settings (Unified System Settings panel) */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-stone-850 tracking-tight font-serif">System Settings</h2>
              <p className="text-xs text-stone-500 font-medium">Naeemi Fragrance website configurations, payment details, courier shipping rates, email templates, and SEO configurations.</p>
            </div>

            {/* Inner Subtabs Navigation Bar */}
            <div className="flex flex-wrap border-b text-[11px] font-bold gap-3 pb-1.5">
              <button
                onClick={() => setActiveSettingsSubtab("website")}
                className={`pb-2 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeSettingsSubtab === "website" ? "border-amber-500 text-amber-800 font-extrabold" : "border-transparent text-stone-400"
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                Website Info
              </button>
              <button
                onClick={() => setActiveSettingsSubtab("payment")}
                className={`pb-2 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeSettingsSubtab === "payment" ? "border-amber-500 text-amber-800" : "border-transparent text-stone-400"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Payment Options
              </button>
              <button
                onClick={() => setActiveSettingsSubtab("shipping")}
                className={`pb-2 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeSettingsSubtab === "shipping" ? "border-amber-500 text-amber-800" : "border-transparent text-stone-400"
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                Courier Fees
              </button>
              <button
                onClick={() => setActiveSettingsSubtab("notifications")}
                className={`pb-2 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeSettingsSubtab === "notifications" ? "border-amber-500 text-amber-800" : "border-transparent text-stone-400"
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Email Alerts
              </button>
              <button
                onClick={() => setActiveSettingsSubtab("seo")}
                className={`pb-2 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeSettingsSubtab === "seo" ? "border-amber-500 text-amber-800" : "border-transparent text-stone-400"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                SEO Metadata
              </button>
              <button
                onClick={() => setActiveSettingsSubtab("storeinfo")}
                className={`pb-2 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeSettingsSubtab === "storeinfo" ? "border-amber-500 text-amber-800" : "border-transparent text-stone-400"
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                Store Contact & Location
              </button>
            </div>

            {/* Render Inner Subtab views */}
            {localSettings && (
              <div className="space-y-4">
                {/* 1. Website Info */}
                {activeSettingsSubtab === "website" && (
                  <div className="glass-panel p-5 rounded-3xl space-y-4 animate-fadeIn">
                    <h3 className="font-bold text-stone-800 text-xs border-b pb-2">Website Settings</h3>
                    <div className="space-y-3 font-medium text-stone-700 text-xs">
                      <div className="space-y-1">
                        <label className="text-stone-600 block">Website Brand Name</label>
                        <input
                          type="text"
                          value={localSettings.websiteName || ""}
                          onChange={(e) => setLocalSettings({ ...localSettings, websiteName: e.target.value })}
                          className="w-full max-w-md px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-stone-600 block">Brand Tagline</label>
                        <input
                          type="text"
                          value={localSettings.tagline || ""}
                          onChange={(e) => setLocalSettings({ ...localSettings, tagline: e.target.value })}
                          className="w-full max-w-md px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleSaveSettings({ websiteName: localSettings.websiteName, tagline: localSettings.tagline })}
                      disabled={saveLoading}
                      className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-all disabled:bg-stone-300"
                    >
                      {saveLoading ? "Saving Changes..." : "Save Website Info"}
                    </button>
                  </div>
                )}

                {/* 2. Payment Options */}
                {activeSettingsSubtab === "payment" && (
                  <div className="glass-panel p-5 rounded-3xl space-y-4 animate-fadeIn">
                    <h3 className="font-bold text-stone-800 text-xs border-b pb-2">Payment Methods Settings</h3>
                    <div className="space-y-3.5 font-medium text-stone-700 text-xs">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="cod_enabled_checkbox"
                          checked={localSettings.codEnabled ?? true}
                          onChange={(e) => setLocalSettings({ ...localSettings, codEnabled: e.target.checked })}
                          className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                        />
                        <label htmlFor="cod_enabled_checkbox" className="font-bold text-stone-700 cursor-pointer">
                          Enable Cash on Delivery (COD) Option
                        </label>
                      </div>
                      <div className="space-y-1">
                        <label className="text-stone-600 block">EasyPaisa Merchant Wallet Phone Number</label>
                        <input
                          type="text"
                          value={localSettings.easyPaisaAccount || ""}
                          onChange={(e) => setLocalSettings({ ...localSettings, easyPaisaAccount: e.target.value })}
                          className="w-full max-w-xs px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none"
                          placeholder="e.g. 03001234567"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleSaveSettings({ codEnabled: localSettings.codEnabled, easyPaisaAccount: localSettings.easyPaisaAccount })}
                      disabled={saveLoading}
                      className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-all disabled:bg-stone-300"
                    >
                      {saveLoading ? "Saving Changes..." : "Save Payment Details"}
                    </button>
                  </div>
                )}

                {/* 3. Courier Fees */}
                {activeSettingsSubtab === "shipping" && (
                  <div className="glass-panel p-5 rounded-3xl space-y-4 animate-fadeIn">
                    <h3 className="font-bold text-stone-800 text-xs border-b pb-2">Shipping & Logistics Rates</h3>
                    <div className="space-y-3 font-medium text-stone-700 text-xs">
                      <div className="space-y-1">
                        <label className="text-stone-600 block">Standard Courier Shipping fee (Rs.)</label>
                        <input
                          type="number"
                          value={localSettings.shippingFee ?? 0}
                          onChange={(e) => setLocalSettings({ ...localSettings, shippingFee: Number(e.target.value) })}
                          className="w-full max-w-xs px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-stone-600 block">Free Shipping Limit Threshold (Rs.)</label>
                        <input
                          type="number"
                          value={localSettings.freeShippingThreshold ?? 0}
                          onChange={(e) => setLocalSettings({ ...localSettings, freeShippingThreshold: Number(e.target.value) })}
                          className="w-full max-w-xs px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleSaveSettings({ shippingFee: Number(localSettings.shippingFee), freeShippingThreshold: Number(localSettings.freeShippingThreshold) })}
                      disabled={saveLoading}
                      className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-all disabled:bg-stone-300"
                    >
                      {saveLoading ? "Saving Changes..." : "Save Shipping Limits"}
                    </button>
                  </div>
                )}

                {/* 4. Email Templates */}
                {activeSettingsSubtab === "notifications" && (
                  <div className="glass-panel p-5 rounded-3xl space-y-4 animate-fadeIn">
                    <div className="space-y-1 border-b pb-2">
                      <h3 className="font-bold text-stone-800 text-xs">Order Confirmation Email Template</h3>
                      <p className="text-[10px] text-stone-500 font-normal leading-relaxed">
                        Yahan aap us email ka content edit kar sakte hain jo customer ko order check-out ke baad confirm mail ke roop me bheja jata hai. 
                        Dynamic placeholders jaise <strong className="text-amber-800">&#123;&#123;name&#125;&#125;</strong> (Customer Name), 
                        <strong className="text-amber-800">&#123;&#123;orderId&#125;&#125;</strong> (Order ID reference), aur 
                        <strong className="text-amber-800">&#123;&#123;amount&#125;&#125;</strong> (Total billing Rs. amount) automatically dynamic fields se replace ho jayenge.
                      </p>
                    </div>
                    <div className="space-y-1.5 font-medium text-stone-700 text-xs">
                      <label className="text-stone-600 block">Purchase Confirmation Email Body</label>
                      <textarea
                        rows={6}
                        value={localSettings.emailTemplateOrder || ""}
                        onChange={(e) => setLocalSettings({ ...localSettings, emailTemplateOrder: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-2xl resize-none focus:outline-none leading-relaxed"
                        placeholder="Aap ka template yahan likhein..."
                      />
                    </div>
                    <button
                      onClick={() => handleSaveSettings({ emailTemplateOrder: localSettings.emailTemplateOrder })}
                      disabled={saveLoading}
                      className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-all disabled:bg-stone-300"
                    >
                      {saveLoading ? "Saving Changes..." : "Save Email Template"}
                    </button>
                  </div>
                )}

                {/* 5. SEO Page Metadata */}
                {activeSettingsSubtab === "seo" && (
                  <div className="glass-panel p-5 rounded-3xl space-y-4 animate-fadeIn">
                    <h3 className="font-bold text-stone-800 text-xs border-b pb-2">Search Engine Optimization (SEO)</h3>
                    <div className="space-y-3 font-medium text-stone-700 text-xs">
                      <div className="space-y-1">
                        <label className="text-stone-600 block">Meta Page Title (Tab Title)</label>
                        <input
                          type="text"
                          value={localSettings.metaTitle || ""}
                          onChange={(e) => setLocalSettings({ ...localSettings, metaTitle: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-stone-600 block">Meta Page Description</label>
                        <textarea
                          rows={3}
                          value={localSettings.metaDescription || ""}
                          onChange={(e) => setLocalSettings({ ...localSettings, metaDescription: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-2xl resize-none focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-stone-600 block">SEO Keywords Tags (comma separated)</label>
                        <input
                          type="text"
                          value={localSettings.metaKeywords || ""}
                          onChange={(e) => setLocalSettings({ ...localSettings, metaKeywords: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleSaveSettings({ metaTitle: localSettings.metaTitle, metaDescription: localSettings.metaDescription, metaKeywords: localSettings.metaKeywords })}
                      disabled={saveLoading}
                      className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-all disabled:bg-stone-300"
                    >
                      {saveLoading ? "Saving Changes..." : "Save SEO Details"}
                    </button>
                  </div>
                )}

                {/* 6. Store Contacts & Location */}
                {activeSettingsSubtab === "storeinfo" && (
                  <div className="glass-panel p-5 rounded-3xl space-y-4 animate-fadeIn">
                    <h3 className="font-bold text-stone-800 text-xs border-b pb-2">Support Contacts & Warehouse</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-stone-600">
                      <div className="p-3 bg-stone-50 border rounded-2xl space-y-1">
                        <span className="text-[9px] text-stone-400 uppercase tracking-widest font-extrabold block">Support Phone Hotline</span>
                        <p className="text-stone-800 text-xs">03092184760</p>
                      </div>
                      <div className="p-3 bg-stone-50 border rounded-2xl space-y-1">
                        <span className="text-[9px] text-stone-400 uppercase tracking-widest font-extrabold block">Central Scent Warehouse</span>
                        <p className="text-stone-800 text-xs">Bin Qasim Town Karachi Pakistan</p>
                      </div>
                    </div>
                    <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-[10px] text-stone-500 leading-relaxed">
                      <strong>Note:</strong> Support contacts aur central warehouse address configurations currently hardcoded hain logistics security protocols ke tehat.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 12: Admin Accounts */}
        {activeTab === "admins" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-xl font-black text-stone-800 tracking-tight">Authorized Admin Accounts</h2>
              {(adminUser.role === "Owner" || adminUser.role === "Admin") && (
                <button
                  onClick={() => setShowStaffForm(!showStaffForm)}
                  className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  {showStaffForm ? "Close Form" : "Add Staff User"}
                </button>
              )}
            </div>

            {showStaffForm && (
              <form onSubmit={handleAddStaffSubmit} className="glass-panel p-5 rounded-3xl border border-amber-100 space-y-4 max-w-lg">
                <h3 className="font-bold text-stone-850 text-xs border-b pb-2">Add New Staff Member</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Full Name</label>
                    <input
                      type="text" required placeholder="e.g. Ali Nawaz" value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Email Address</label>
                    <input
                      type="email" required placeholder="e.g. ali@naeemi.com" value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Access Password</label>
                    <input
                      type="password" required placeholder="Min 8 chars, A-Z, a-z, 0-9" value={newStaffPassword}
                      onChange={(e) => setNewStaffPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Access Role</label>
                    <select
                      value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                    >
                      <option value="Admin">Admin (Full catalogue/orders access)</option>
                      <option value="Manager">Manager (View lists & update order status)</option>
                    </select>
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button" onClick={() => setShowStaffForm(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl gold-btn text-white font-bold text-xs">
                    Register Staff
                  </button>
                </div>
              </form>
            )}

            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <h4 className="font-bold text-stone-800 text-xs border-b pb-2">Registered Staff Logins</h4>
              <div className="divide-y text-xs">
                {staffUsers.map((staff) => (
                  <div key={staff.email} className="py-3 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <span className="font-bold text-stone-855">{staff.name}</span>
                      <p className="text-[10px] text-stone-400">{staff.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        staff.role === "Owner" 
                          ? "bg-amber-50 text-amber-800 border-amber-200" 
                          : staff.role === "Admin" 
                          ? "bg-blue-50 text-blue-800 border-blue-200" 
                          : "bg-stone-50 text-stone-700 border-stone-200"
                      }`}>
                        {staff.role} Access
                      </span>
                      {adminUser.role === "Owner" && staff.email !== adminUser.email && (
                        <button
                          onClick={async () => {
                            if (confirm(`Are you sure you want to revoke access for ${staff.name}?`)) {
                              const res = await deleteStaff(staff.email);
                              if (!res.success) alert(res.error || "Failed to delete staff user");
                            }
                          }}
                          className="text-[10px] font-bold text-rose-600 hover:underline"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 13: Activity Logs (Owner/Admin only) */}
        {activeTab === "logs" && (adminUser.role === "Owner" || adminUser.role === "Admin") && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-black text-stone-800 tracking-tight flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-600" />
              Security Audit Activity Logs
            </h2>

            <div className="glass-panel overflow-hidden rounded-3xl border border-stone-200/50">
              <div className="overflow-x-auto max-h-[60vh]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50/70 border-b text-[9px] font-bold text-stone-500 uppercase tracking-widest">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">User Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-stone-200/40 font-medium text-stone-700">
                    {systemLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-stone-400">No logs registered.</td>
                      </tr>
                    ) : (
                      systemLogs.map((log, index) => (
                        <tr key={index} className="hover:bg-white/40">
                          <td className="p-3 font-semibold text-stone-500 text-[10px] whitespace-nowrap">{new Date(log.date).toLocaleString()}</td>
                          <td className="p-3 font-bold text-stone-800">{log.user}</td>
                          <td className="p-3">
                            <span className="text-[8px] font-bold bg-stone-100 px-1.5 py-0.5 rounded">
                              {log.role || "Admin"}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-amber-900">{log.action}</td>
                          <td className="p-3 text-[11px] text-stone-600 font-normal leading-relaxed">{formatLogDetails(log.details)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Sidebar Menu Render Helper
function renderSidebarMenu(activeTab: string, onClick: (tab: any) => void, role: string) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard, roles: ["Owner", "Admin", "Manager"] },
    { id: "products", label: "Products Catalogue", icon: Package, roles: ["Owner", "Admin", "Manager"] },
    { id: "orders", label: "Orders Log", icon: ShoppingBag, roles: ["Owner", "Admin", "Manager"] },
    { id: "customers", label: "Customer Registry", icon: Users, roles: ["Owner", "Admin", "Manager"] },
    { id: "inventory", label: "Inventory stock levels", icon: AlertTriangle, roles: ["Owner", "Admin", "Manager"] },
    { id: "coupons", label: "Discount Vouchers", icon: Percent, roles: ["Owner", "Admin", "Manager"] },
    { id: "analytics", label: "Analytics Charts", icon: BarChart3, roles: ["Owner", "Admin", "Manager"] },
    { id: "settings", label: "System Settings", icon: Settings, roles: ["Owner", "Admin"] },
    { id: "admins", label: "Admin Access control", icon: Key, roles: ["Owner", "Admin"] },
    { id: "logs", label: "Audit Action Logs", icon: ClipboardList, roles: ["Owner", "Admin"] },
  ];

  return menuItems
    .filter((item) => item.roles.includes(role))
    .map((item) => {
      const Icon = item.icon;
      const isActive = activeTab === item.id;
      return (
        <button
          key={item.id}
          onClick={() => onClick(item.id)}
          className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
            isActive 
              ? "bg-amber-500/10 text-amber-900 font-black border-l-2 border-amber-500 pl-3.5" 
              : "text-stone-600 hover:bg-stone-50"
          }`}
        >
          <Icon className={`w-4 h-4 ${isActive ? "text-amber-600" : "text-stone-400"}`} />
          {item.label}
        </button>
      );
    });
}
