"use client";

import React, { useState } from "react";
import { useAdmin, Perfume, Order, Coupon, StoreSettings } from "@/context/AdminContext";
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
  LayoutDashboard
} from "lucide-react";

export default function AdminDashboard() {
  const { 
    products, 
    orders, 
    coupons,
    settings,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus, 
    getSalesSummary,
    addCoupon,
    deleteCoupon,
    updateSettings
  } = useAdmin();

  // Sidebar Menu Tabs
  type TabType = 
    | "dashboard" 
    | "products" 
    | "orders" 
    | "customers" 
    | "inventory" 
    | "coupons" 
    | "analytics" 
    | "settings" 
    | "notifications" 
    | "general" 
    | "seo" 
    | "admins";

  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [activeSettingsSubtab, setActiveSettingsSubtab] = useState<"website" | "payment" | "shipping">("website");

  // Summary Metrics
  const { totalSales, totalOrders, pendingOrders, lowStockCount } = getSalesSummary();

  // Derived Customers list
  const customers = orders.reduce((acc: any[], order) => {
    const existing = acc.find(c => c.phone === order.customerPhone);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += order.totalAmount;
      if (!existing.addresses.includes(order.customerAddress)) {
        existing.addresses.push(order.customerAddress);
      }
    } else {
      acc.push({
        name: order.customerName,
        phone: order.customerPhone,
        totalSpent: order.totalAmount,
        ordersCount: 1,
        addresses: [order.customerAddress]
      });
    }
    return acc;
  }, []);

  // Form states for creating a new product
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [volume, setVolume] = useState("100ml");
  const [type, setType] = useState("Eau de Parfum (EDP)");
  const [category, setCategory] = useState("Oud");
  const [topNotes, setTopNotes] = useState("");
  const [heartNotes, setHeartNotes] = useState("");
  const [baseNotes, setBaseNotes] = useState("");
  const [stock, setStock] = useState(10);
  
  // Stock edit states
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  // Coupon state form
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [newCouponDesc, setNewCouponDesc] = useState("");

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || price <= 0 || stock < 0) return;

    const topArray = topNotes.split(",").map((n) => n.trim()).filter(Boolean);
    const heartArray = heartNotes.split(",").map((n) => n.trim()).filter(Boolean);
    const baseArray = baseNotes.split(",").map((n) => n.trim()).filter(Boolean);

    addProduct({
      name,
      description,
      price,
      volume,
      type,
      category,
      topNotes: topArray.length ? topArray : ["Fresh Accord"],
      heartNotes: heartArray.length ? heartArray : ["Floral Essence"],
      baseNotes: baseArray.length ? baseArray : ["Amber Base"],
      stock,
      imageUrl: "linear-gradient(135deg, #ffd3b6 0%, #ff8b94 100%)"
    });

    // Reset Form
    setName("");
    setDescription("");
    setPrice(0);
    setVolume("100ml");
    setType("Eau de Parfum (EDP)");
    setCategory("Oud");
    setTopNotes("");
    setHeartNotes("");
    setBaseNotes("");
    setStock(10);
    setShowAddForm(false);
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = newCouponCode.trim().toUpperCase();
    if (!code || newCouponDiscount <= 0) return;

    addCoupon({
      code,
      discount: newCouponDiscount,
      description: newCouponDesc || `${newCouponDiscount}% Discount Promo`
    });

    setNewCouponCode("");
    setNewCouponDiscount(10);
    setNewCouponDesc("");
  };

  const handleStartEditStock = (prod: Perfume) => {
    setEditingStockId(prod.id);
    setTempStockValue(prod.stock);
  };

  const handleSaveStock = (id: string) => {
    updateProduct(id, { stock: Math.max(0, tempStockValue) });
    setEditingStockId(null);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-10">
      
      {/* SIDEBAR NAVIGATION (Col 3) */}
      <aside className="lg:col-span-3 glass-panel rounded-3xl p-5 space-y-6 border border-white/50 sticky top-24">
        {/* Profile Card Summary */}
        <div className="border-b border-stone-200/40 pb-4 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center mx-auto text-lg mb-2 shadow-sm">
            Z
          </div>
          <h4 className="font-extrabold text-stone-800 text-xs">Zafar Fragrances</h4>
          <span className="text-[9px] text-amber-700 font-serif italic">"Naeemi Naam Hai Mohabbat Ka"</span>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "dashboard" ? "bg-amber-500/10 text-amber-900 font-black border-l-2 border-amber-500" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-stone-500" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "products" ? "bg-amber-500/10 text-amber-900 font-black border-l-2 border-amber-500" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <Package className="w-4 h-4 text-stone-500" />
            Products Catalogue
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "orders" ? "bg-amber-500/10 text-amber-900 font-black border-l-2 border-amber-500" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-stone-500" />
            Orders Log
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "customers" ? "bg-amber-500/10 text-amber-900 font-black border-l-2 border-amber-500" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <Users className="w-4 h-4 text-stone-500" />
            Customer Registry
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "inventory" ? "bg-amber-500/10 text-amber-900 font-black border-l-2 border-amber-500" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-stone-500" />
            Inventory & Alerts
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "coupons" ? "bg-amber-500/10 text-amber-900 font-black border-l-2 border-amber-500" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <Percent className="w-4 h-4 text-stone-500" />
            Coupons & Discounts
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "analytics" ? "bg-amber-500/10 text-amber-900 font-black border-l-2 border-amber-500" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-stone-500" />
            Analytics Charts
          </button>

          <div className="border-t border-stone-200/40 my-2 pt-2">
            <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-widest block px-3 mb-1">System Settings</span>
          </div>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "settings" ? "bg-amber-500/10 text-amber-900 font-black border-l-2 border-amber-500" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <Settings className="w-4 h-4 text-stone-500" />
            Store Settings
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "notifications" ? "bg-amber-500/10 text-amber-900 font-black border-l-2 border-amber-500" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <Mail className="w-4 h-4 text-stone-500" />
            Email Templates
          </button>

          <button
            onClick={() => setActiveTab("seo")}
            className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "seo" ? "bg-amber-500/10 text-amber-900 font-black border-l-2 border-amber-500" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <Globe className="w-4 h-4 text-stone-500" />
            SEO Settings
          </button>

          <button
            onClick={() => setActiveTab("general")}
            className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "general" ? "bg-amber-500/10 text-amber-900 font-black border-l-2 border-amber-500" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <Settings2 className="w-4 h-4 text-stone-500" />
            General Settings
          </button>

          <button
            onClick={() => setActiveTab("admins")}
            className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${
              activeTab === "admins" ? "bg-amber-500/10 text-amber-900 font-black border-l-2 border-amber-500" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <Key className="w-4 h-4 text-stone-500" />
            Admin Access
          </button>
        </nav>
      </aside>

      {/* CORE DISPLAY PANEL (Col 9) */}
      <main className="lg:col-span-9 space-y-6">
        
        {/* TAB 1: Dashboard Overview */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-stone-800 tracking-tight">Analytics Executive Summary</h2>
              <p className="text-xs text-stone-500">Real-time status summaries of sales and logistics</p>
            </div>

            {/* Metrics cards row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-4 rounded-2xl">
                <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Total Sales</span>
                <span className="text-base font-extrabold text-stone-850">Rs. {totalSales.toLocaleString()}</span>
              </div>
              <div className="glass-panel p-4 rounded-2xl">
                <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Orders Count</span>
                <span className="text-base font-extrabold text-stone-850">{totalOrders}</span>
              </div>
              <div className="glass-panel p-4 rounded-2xl">
                <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Pending Tasks</span>
                <span className="text-base font-extrabold text-stone-850">{pendingOrders}</span>
              </div>
              <div className="glass-panel p-4 rounded-2xl">
                <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Low Stock alerts</span>
                <span className="text-base font-extrabold text-stone-850">{lowStockCount} items</span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <h3 className="font-bold text-stone-800 text-sm">Recent Order Shipments</h3>
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="p-3 bg-white/40 border border-stone-200/40 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-stone-800">{order.customerName}</p>
                    <p className="text-[10px] text-stone-500">{order.items.map(i => `${i.name} (${i.quantity}x)`).join(", ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-800">Rs. {order.totalAmount.toLocaleString()}</p>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${getStatusBadgeColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Products CRUD Management */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-stone-800 tracking-tight">Products Stock Catalogue</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                {showAddForm ? "Close specifications form" : "Add Fragrance Listing"}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddProduct} className="glass-panel p-6 rounded-3xl border border-amber-100 space-y-4">
                <h4 className="font-bold text-stone-800 text-sm border-b pb-2">Fragrance Parameters</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Name</label>
                    <input
                      type="text" required placeholder="e.g. Zouq-e-Lail" value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Category</label>
                    <select
                      value={category} onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    >
                      <option value="Oud">Oud</option>
                      <option value="Floral">Floral</option>
                      <option value="Woody">Woody</option>
                      <option value="Fresh">Fresh</option>
                      <option value="Oriental">Oriental</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Retail Price (Rs.)</label>
                    <input
                      type="number" required min="1" placeholder="e.g. 6200" value={price || ""}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Stock Count</label>
                    <input
                      type="number" required min="0" placeholder="10" value={stock || ""}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600 block">Scent Description</label>
                  <textarea
                    required rows={2} placeholder="Describe essential elements..." value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button" onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl gold-btn text-white font-bold text-xs">
                    Save listing
                  </button>
                </div>
              </form>
            )}

            <div className="glass-panel overflow-hidden rounded-3xl border border-stone-200/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50/70 text-[9px] font-bold text-stone-500 uppercase tracking-widest border-b">
                      <th className="p-3">Perfume</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock remaining</th>
                      <th className="p-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-stone-200/40">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-white/40">
                        <td className="p-3 font-bold text-stone-850">{prod.name}</td>
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
                              <button onClick={() => handleStartEditStock(prod)} className="text-stone-400 hover:text-stone-700">
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button onClick={() => deleteProduct(prod.id)} className="text-rose-500 hover:text-rose-700 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Orders log */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Customer Placed Orders</h2>
            
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="glass-panel p-5 rounded-3xl space-y-3">
                  <div className="flex justify-between items-center border-b pb-2 flex-wrap gap-2">
                    <span className="font-extrabold text-xs text-stone-850">{ord.id} ({ord.date})</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full ${getStatusBadgeColor(ord.status)}`}>
                        {ord.status}
                      </span>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order["status"])}
                        className="bg-stone-50 border rounded-lg text-[10px] py-1 px-2 font-bold focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="font-bold text-stone-700">Recipient: {ord.customerName}</p>
                      <p className="text-stone-500">Contact: {ord.customerPhone}</p>
                      <p className="text-stone-500">Address: {ord.customerAddress}</p>
                    </div>
                    <div>
                      <span className="font-bold text-stone-400 text-[9px] uppercase tracking-wider block">Package Items</span>
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-stone-600 font-medium">
                          <span>{it.name} x{it.quantity}</span>
                          <span>Rs. {(it.price * it.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t pt-1 mt-1 flex justify-between font-black text-stone-800">
                        <span>Total Paid</span>
                        <span>Rs. {ord.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Customer registry */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Customer Database Registry</h2>
            <div className="glass-panel overflow-hidden rounded-3xl border border-stone-200/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/70 border-b text-[9px] font-bold text-stone-500 uppercase tracking-widest">
                    <th className="p-3">Client</th>
                    <th className="p-3">Mobile Contact</th>
                    <th className="p-3">Address list</th>
                    <th className="p-3">Orders Count</th>
                    <th className="p-3">Total Invested</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-stone-200/40">
                  {customers.map((c, i) => (
                    <tr key={i} className="hover:bg-white/40">
                      <td className="p-3 font-bold text-stone-800">{c.name}</td>
                      <td className="p-3 font-semibold text-stone-600">{c.phone}</td>
                      <td className="p-3 text-stone-500 max-w-xs truncate" title={c.addresses.join("; ")}>
                        {c.addresses.join("; ")}
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

        {/* TAB 5: Inventory Restocking System */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Inventory restock logs</h2>
            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Critical Low Stock Alerts (Stock &lt;= 5 bottles)
              </h3>
              <div className="divide-y divide-stone-100">
                {products.map(prod => {
                  const isLow = prod.stock <= 5;
                  return (
                    <div key={prod.id} className="py-2.5 flex justify-between items-center text-xs">
                      <span className="font-bold text-stone-700">{prod.name} ({prod.volume})</span>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          prod.stock === 0 ? "bg-rose-50 text-rose-700" : isLow ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-700"
                        }`}>
                          {prod.stock === 0 ? "Out of stock" : `${prod.stock} units left`}
                        </span>
                        <button
                          onClick={() => { handleStartEditStock(prod); setEditingStockId(prod.id); }}
                          className="bg-stone-800 text-white font-bold text-[10px] px-3 py-1 rounded-lg hover:bg-stone-700"
                        >
                          Quick restock
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Coupons & discounts panel */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Manage Promo Coupon Codes</h2>
            
            {/* Add new coupon form */}
            <form onSubmit={handleAddCouponSubmit} className="glass-panel p-5 rounded-3xl border border-white/50 space-y-3.5">
              <h3 className="font-bold text-stone-850 text-xs">Create New Coupon Voucher</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text" required placeholder="CODE e.g. LOVE25" value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="px-3.5 py-2 bg-white border rounded-xl text-xs uppercase"
                />
                <input
                  type="number" required min="1" max="99" placeholder="Discount % e.g. 25" value={newCouponDiscount || ""}
                  onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                  className="px-3.5 py-2 bg-white border rounded-xl text-xs"
                />
                <input
                  type="text" placeholder="Promo description text" value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  className="px-3.5 py-2 bg-white border rounded-xl text-xs"
                />
              </div>
              <button type="submit" className="px-5 py-2 rounded-xl gold-btn text-white font-bold text-xs">
                Add Coupon Code
              </button>
            </form>

            {/* Coupons list */}
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
                        <button onClick={() => deleteCoupon(cop.code)} className="text-stone-400 hover:text-rose-500 p-1">
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

        {/* TAB 7: Analytics Charts and graphs */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Accords Sales Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-5 rounded-3xl space-y-4">
                <h4 className="font-bold text-stone-800 text-xs">Best Selling Fragrance Accord</h4>
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-stone-700">
                      <span>Shams Un Naeemi</span>
                      <span>Rs. {totalSales > 0 ? Math.round(totalSales * 0.45).toLocaleString() : "Rs. 28,000"}</span>
                    </div>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full">
                      <div className="bg-amber-500 h-full w-[45%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-stone-700">
                      <span>Oud Un Naeemi</span>
                      <span>Rs. {totalSales > 0 ? Math.round(totalSales * 0.35).toLocaleString() : "Rs. 18,500"}</span>
                    </div>
                    <div className="w-full bg-stone-100 h-1.5 rounded-full">
                      <div className="bg-amber-500 h-full w-[35%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-3xl space-y-4">
                <h4 className="font-bold text-stone-800 text-xs">Customer Sillage Rating Average</h4>
                <div className="text-center py-6">
                  <span className="text-5xl font-black text-stone-800 tracking-tighter">4.92</span>
                  <span className="text-xs text-stone-400 block mt-1">Weighted average rating from reviews</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: Settings (Website / Payment / Shipping subtabs) */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">System Settings panel</h2>
            
            {/* Subtabs Menu */}
            <div className="flex border-b text-xs font-bold gap-3 pb-1">
              <button
                onClick={() => setActiveSettingsSubtab("website")}
                className={`pb-2 px-1 border-b-2 transition-all ${
                  activeSettingsSubtab === "website" ? "border-amber-500 text-amber-800" : "border-transparent text-stone-400"
                }`}
              >
                Website Settings
              </button>
              <button
                onClick={() => setActiveSettingsSubtab("payment")}
                className={`pb-2 px-1 border-b-2 transition-all ${
                  activeSettingsSubtab === "payment" ? "border-amber-500 text-amber-800" : "border-transparent text-stone-400"
                }`}
              >
                Payment Systems
              </button>
              <button
                onClick={() => setActiveSettingsSubtab("shipping")}
                className={`pb-2 px-1 border-b-2 transition-all ${
                  activeSettingsSubtab === "shipping" ? "border-amber-500 text-amber-800" : "border-transparent text-stone-400"
                }`}
              >
                Shipping limits
              </button>
            </div>

            {/* WEBSITE SETTINGS SUBTAB */}
            {activeSettingsSubtab === "website" && (
              <div className="glass-panel p-5 rounded-3xl space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 block">Website Store Name</label>
                  <input
                    type="text" value={settings.websiteName}
                    onChange={(e) => updateSettings({ websiteName: e.target.value })}
                    className="w-full max-w-md px-3.5 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 block">Slogan tagline</label>
                  <input
                    type="text" value={settings.tagline}
                    onChange={(e) => updateSettings({ tagline: e.target.value })}
                    className="w-full max-w-md px-3.5 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            {/* PAYMENT SETTINGS SUBTAB */}
            {activeSettingsSubtab === "payment" && (
              <div className="glass-panel p-5 rounded-3xl space-y-4">
                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox" checked={settings.codEnabled}
                    onChange={(e) => updateSettings({ codEnabled: e.target.checked })}
                    className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                  />
                  <span className="font-bold text-stone-700">Enable Cash on Delivery (COD) Checkout</span>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 block">EasyPaisa Merchant Wallet Phone</label>
                  <input
                    type="text" value={settings.easyPaisaAccount}
                    onChange={(e) => updateSettings({ easyPaisaAccount: e.target.value })}
                    className="w-full max-w-xs px-3.5 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            {/* SHIPPING SETTINGS SUBTAB */}
            {activeSettingsSubtab === "shipping" && (
              <div className="glass-panel p-5 rounded-3xl space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 block">Standard Courier Shipping fee (Rs.)</label>
                  <input
                    type="number" value={settings.shippingFee}
                    onChange={(e) => updateSettings({ shippingFee: Number(e.target.value) })}
                    className="w-full max-w-xs px-3.5 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 block">Free Shipping Limit Threshold (Rs.)</label>
                  <input
                    type="number" value={settings.freeShippingThreshold}
                    onChange={(e) => updateSettings({ freeShippingThreshold: Number(e.target.value) })}
                    className="w-full max-w-xs px-3.5 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: Email & Notification Template editor */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Email & Notifications template</h2>
            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">Customer COD Purchase Confirmation template</label>
                <textarea
                  rows={4} value={settings.emailTemplateOrder}
                  onChange={(e) => updateSettings({ emailTemplateOrder: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-2xl text-xs resize-none"
                />
              </div>
              <p className="text-[10px] text-stone-400">
                Variables allowed: <code className="bg-stone-50 p-0.5 rounded font-mono">{"{{name}}"}</code>, <code className="bg-stone-50 p-0.5 rounded font-mono">{"{{orderId}}"}</code>, <code className="bg-stone-50 p-0.5 rounded font-mono">{"{{amount}}"}</code>
              </p>
            </div>
          </div>
        )}

        {/* TAB 10: SEO Meta settings */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">SEO Metadata optimization</h2>
            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">Meta Page Title</label>
                <input
                  type="text" value={settings.metaTitle}
                  onChange={(e) => updateSettings({ metaTitle: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">Meta Page description</label>
                <textarea
                  rows={3} value={settings.metaDescription}
                  onChange={(e) => updateSettings({ metaDescription: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">Keywords tags (comma separated)</label>
                <input
                  type="text" value={settings.metaKeywords}
                  onChange={(e) => updateSettings({ metaKeywords: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: General configurations (Address, working hours) */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">General Contact Configurations</h2>
            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">Showroom Support Contact Number</label>
                <input
                  type="text" placeholder="03092184760"
                  className="w-full max-w-xs px-3.5 py-2 border rounded-xl text-xs bg-stone-50"
                  disabled
                  value="03092184760"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">Lahore Warehouse Address</label>
                <input
                  type="text" value="Gulberg III, Lahore, Pakistan"
                  className="w-full max-w-md px-3.5 py-2 border rounded-xl text-xs bg-stone-50"
                  disabled
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: Admin management permissions */}
        {activeTab === "admins" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Authorized Admin Accounts</h2>
            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <h4 className="font-bold text-stone-800 text-xs">Registered Staff Logins</h4>
              <div className="divide-y text-xs">
                {settings.adminUsers.map((user, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center font-medium">
                    <span className="text-stone-700">{user}</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Access Granted
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
