"use client";

import React, { useState, useEffect } from "react";
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
  ClipboardList
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
    login,
    logout,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus, 
    getSalesSummary,
    addCoupon,
    deleteCoupon,
    updateSettings
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
    | "notifications" 
    | "general" 
    | "seo" 
    | "admins"
    | "logs";

  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [activeSettingsSubtab, setActiveSettingsSubtab] = useState<"website" | "payment" | "shipping">("website");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    if (!name || !description || price <= 0 || stock < 0) return;

    const topArray = topNotes.split(",").map((n) => n.trim()).filter(Boolean);
    const heartArray = heartNotes.split(",").map((n) => n.trim()).filter(Boolean);
    const baseArray = baseNotes.split(",").map((n) => n.trim()).filter(Boolean);

    const result = await addProduct({
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
      imageUrl: "linear-gradient(135deg, #c5a880 0%, #533a1c 100%)"
    });

    if (result.success) {
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
    } else {
      alert(result.error || "Failed to add product listing");
    }
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
      <div className="max-w-md mx-auto py-16 px-6 glass-panel rounded-[36px] border border-white/60 shadow-xl mt-12 space-y-6">
        <div className="text-center space-y-2">
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
              placeholder="admin@naeemi.com"
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
              placeholder="••••••••"
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

        <div className="border-t border-stone-200/50 pt-4 text-center space-y-1">
          <p className="text-[10px] text-stone-400">Owner Access: owner@naeemi.com / NaeemiOwner123!</p>
          <p className="text-[10px] text-stone-400">Admin Access: admin@naeemi.com / NaeemiAdmin123!</p>
          <p className="text-[10px] text-stone-400">Manager Access: manager@naeemi.com / NaeemiManager123!</p>
        </div>
      </div>
    );
  }

  const handleMenuClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
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
            <div className="space-y-1">
              <h2 className="text-xl font-black text-stone-850 tracking-tight">Executive Stats overview</h2>
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
                <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Low Stock items</span>
                <span className="text-base font-extrabold text-stone-850">{lowStockCount} units</span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <h3 className="font-bold text-stone-800 text-sm">Recent Order Shipments</h3>
              {orders.length === 0 ? (
                <p className="text-xs text-stone-500 py-3 text-center">No orders placed yet.</p>
              ) : (
                orders.slice(0, 4).map((order) => (
                  <div key={order.id} className="p-3 bg-white/40 border border-stone-200/40 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-stone-800">{order.customerName}</p>
                      <p className="text-[10px] text-stone-400 truncate max-w-md">
                        {order.items.map(i => `${i.name} (${i.quantity}x)`).join(", ")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-amber-800">Rs. {order.totalAmount.toLocaleString()}</p>
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${getStatusBadgeColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Name</label>
                    <input
                      type="text" required placeholder="e.g. Zouq e Safar" value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Category</label>
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
                    <label className="text-xs font-semibold text-stone-600 block">Retail Price (Rs.)</label>
                    <input
                      type="number" required min="1" placeholder="e.g. 6200" value={price || ""}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600 block">Starting Stock Units</label>
                    <input
                      type="number" required min="0" placeholder="10" value={stock || ""}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600 block">Scent Description</label>
                  <textarea
                    required rows={2} placeholder="Describe essential elements..." value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs resize-none"
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
                              <button onClick={() => handleStartEditStock(prod)} className="text-stone-400 hover:text-stone-700" title="Restock">
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>
                        {(adminUser.role === "Owner" || adminUser.role === "Admin") && (
                          <td className="p-3 text-right">
                            <button onClick={() => handleDeleteProduct(prod.id)} className="text-stone-400 hover:text-rose-500 p-1">
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
          </div>
        )}

        {/* TAB 3: Orders log */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Customer Placed Orders</h2>
            
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-xs text-stone-500 py-6 text-center">No orders found.</p>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="glass-panel p-5 rounded-3xl space-y-3">
                    <div className="flex justify-between items-center border-b pb-2 flex-wrap gap-2">
                      <span className="font-extrabold text-xs text-stone-850">{ord.id} ({ord.date})</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full ${getStatusBadgeColor(ord.status)}`}>
                          {ord.status}
                        </span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleOrderStatusUpdate(ord.id, e.target.value as Order["status"])}
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
                      <div className="space-y-1">
                        <p className="font-bold text-stone-700">Recipient: {ord.customerName}</p>
                        <p className="text-stone-500">Contact: {ord.customerPhone}</p>
                        <p className="text-stone-500 leading-relaxed font-medium">Address: {ord.customerAddress}</p>
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
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Customer registry */}
        {activeTab === "customers" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Customer Database Registry</h2>
            <div className="glass-panel overflow-hidden rounded-3xl border border-stone-200/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/70 border-b text-[9px] font-bold text-stone-500 uppercase tracking-widest">
                    <th className="p-3">Client</th>
                    <th className="p-3">Mobile Contact</th>
                    <th className="p-3">Address list</th>
                    <th className="p-3 text-center">Orders</th>
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

        {/* TAB 8: Settings (Website / Payment / Shipping subtabs) */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Settings panel</h2>
            
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

            {activeSettingsSubtab === "website" && (
              <div className="glass-panel p-5 rounded-3xl space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-650 block">Website Store Name</label>
                  <input
                    type="text" value={settings.websiteName}
                    onChange={(e) => updateSettings({ websiteName: e.target.value })}
                    className="w-full max-w-md px-3.5 py-2 border rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-650 block">Slogan tagline</label>
                  <input
                    type="text" value={settings.tagline}
                    onChange={(e) => updateSettings({ tagline: e.target.value })}
                    className="w-full max-w-md px-3.5 py-2 border rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

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
                  <label className="text-xs font-bold text-stone-650 block">EasyPaisa Merchant Wallet Phone</label>
                  <input
                    type="text" value={settings.easyPaisaAccount}
                    onChange={(e) => updateSettings({ easyPaisaAccount: e.target.value })}
                    className="w-full max-w-xs px-3.5 py-2 border rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            {activeSettingsSubtab === "shipping" && (
              <div className="glass-panel p-5 rounded-3xl space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-650 block">Standard Courier Shipping fee (Rs.)</label>
                  <input
                    type="number" value={settings.shippingFee}
                    onChange={(e) => updateSettings({ shippingFee: Number(e.target.value) })}
                    className="w-full max-w-xs px-3.5 py-2 border rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-650 block">Free Shipping Limit Threshold (Rs.)</label>
                  <input
                    type="number" value={settings.freeShippingThreshold}
                    onChange={(e) => updateSettings({ freeShippingThreshold: Number(e.target.value) })}
                    className="w-full max-w-xs px-3.5 py-2 border rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 9: Email & Notification template */}
        {activeTab === "notifications" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Email Notifications</h2>
            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">Customer COD Purchase Confirmation template</label>
                <textarea
                  rows={4} value={settings.emailTemplateOrder}
                  onChange={(e) => updateSettings({ emailTemplateOrder: e.target.value })}
                  className="w-full px-3.5 py-2.5 border rounded-2xl text-xs resize-none focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: SEO Meta settings */}
        {activeTab === "seo" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">SEO optimization</h2>
            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">Meta Page Title</label>
                <input
                  type="text" value={settings.metaTitle}
                  onChange={(e) => updateSettings({ metaTitle: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">Meta Page description</label>
                <textarea
                  rows={3} value={settings.metaDescription}
                  onChange={(e) => updateSettings({ metaDescription: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs resize-none focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">Keywords tags (comma separated)</label>
                <input
                  type="text" value={settings.metaKeywords}
                  onChange={(e) => updateSettings({ metaKeywords: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: General contact details */}
        {activeTab === "general" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">General configurations</h2>
            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">Support Phone</label>
                <input
                  type="text" className="w-full max-w-xs px-3.5 py-2 border rounded-xl text-xs bg-stone-50"
                  disabled value="03092184760"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">Warehouse location</label>
                <input
                  type="text" className="w-full max-w-md px-3.5 py-2 border rounded-xl text-xs bg-stone-50"
                  disabled value="Gulberg III, Lahore, Pakistan"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: Admin Accounts */}
        {activeTab === "admins" && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-black text-stone-800 tracking-tight">Authorized Admin Accounts</h2>
            <div className="glass-panel p-5 rounded-3xl space-y-4">
              <h4 className="font-bold text-stone-800 text-xs">Registered Staff Logins</h4>
              <div className="divide-y text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <span>owner@naeemi.com</span>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border">Owner access</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span>admin@naeemi.com</span>
                  <span className="text-[9px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border">Admin access</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span>manager@naeemi.com</span>
                  <span className="text-[9px] font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border">Manager access</span>
                </div>
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
                          <td className="p-3 text-[11px] text-stone-600 font-normal leading-relaxed">{log.details}</td>
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
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["Owner", "Admin", "Manager"] },
    { id: "products", label: "Products Catalogue", icon: Package, roles: ["Owner", "Admin", "Manager"] },
    { id: "orders", label: "Orders Log", icon: ShoppingBag, roles: ["Owner", "Admin", "Manager"] },
    { id: "customers", label: "Customer Registry", icon: Users, roles: ["Owner", "Admin", "Manager"] },
    { id: "inventory", label: "Inventory & Alerts", icon: AlertTriangle, roles: ["Owner", "Admin", "Manager"] },
    { id: "coupons", label: "Coupons & Discounts", icon: Percent, roles: ["Owner", "Admin", "Manager"] },
    { id: "analytics", label: "Analytics Charts", icon: BarChart3, roles: ["Owner", "Admin", "Manager"] },
    { id: "settings", label: "Store Settings", icon: Settings, roles: ["Owner", "Admin"] },
    { id: "notifications", label: "Email Templates", icon: Mail, roles: ["Owner", "Admin"] },
    { id: "seo", label: "SEO Settings", icon: Globe, roles: ["Owner", "Admin"] },
    { id: "general", label: "General Settings", icon: Settings2, roles: ["Owner", "Admin", "Manager"] },
    { id: "admins", label: "Admin Access", icon: Key, roles: ["Owner", "Admin"] },
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
