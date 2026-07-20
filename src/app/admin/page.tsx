"use client";

import React, { useState } from "react";
import { useAdmin, Perfume, Order } from "@/context/AdminContext";
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
  ChevronDown
} from "lucide-react";

export default function AdminDashboard() {
  const { 
    products, 
    orders, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus, 
    getSalesSummary 
  } = useAdmin();

  // Summary Metrics
  const { totalSales, totalOrders, pendingOrders, lowStockCount } = getSalesSummary();

  // Tabs: 'dashboard' | 'products' | 'orders'
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders">("dashboard");

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

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || price <= 0 || stock < 0) return;

    // Convert notes from comma-separated string to arrays
    const topArray = topNotes.split(",").map((n) => n.trim()).filter(Boolean);
    const heartArray = heartNotes.split(",").map((n) => n.trim()).filter(Boolean);
    const baseArray = baseNotes.split(",").map((n) => n.trim()).filter(Boolean);

    // Randomize luxury gradient backdrop for illustration
    const gradients = [
      "linear-gradient(135deg, #c5a880 0%, #533a1c 100%)",
      "linear-gradient(135deg, #ffd3b6 0%, #ff8b94 100%)",
      "linear-gradient(135deg, #fbc531 0%, #e84118 100%)",
      "linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)",
      "linear-gradient(135deg, #e4a853 0%, #6e400b 100%)",
      "linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)",
      "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)"
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

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
      imageUrl: randomGradient
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
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-stone-800 tracking-tight">
          Admin Operations Hub
        </h1>
        <p className="text-xs text-stone-500">
          Manage stock, examine order sheets, and review sales charts.
        </p>
      </div>

      {/* Analytics Counter Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="text-base font-extrabold text-stone-800">
              Rs. {totalSales.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100 shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-base font-extrabold text-stone-800">{totalOrders}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100 shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              Pending Orders
            </span>
            <span className="text-base font-extrabold text-stone-800">{pendingOrders}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            lowStockCount > 0 
              ? "bg-rose-50 text-rose-700 border-rose-100 animate-bounce" 
              : "bg-emerald-50 text-emerald-700 border-emerald-100"
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
              Low Inventory Alert
            </span>
            <span className="text-base font-extrabold text-stone-800">{lowStockCount} items</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu Header */}
      <div className="border-b border-stone-200 flex gap-4">
        {(["dashboard", "products", "orders"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 px-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-0.5 ${
              activeTab === tab
                ? "border-amber-600 text-amber-800"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB 1: General Business Stats */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Slogan Branding Box */}
          <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-stone-800 text-md font-serif">Naeemi Fragrances</h3>
              <p className="text-xs text-amber-700 italic font-serif">"Naeemi Naam Hai Mohabbat Ka"</p>
            </div>
            <div className="text-xs text-stone-600 max-w-md">
              Secure client-side records. Keep this screen private. Use this layout to review customer deliveries and manage inventories.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick stock warning panel */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-stone-600" />
                Critical Low Stock Listings
              </h3>
              
              {products.filter(p => p.stock <= 5).length === 0 ? (
                <p className="text-xs text-emerald-600 font-semibold bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-center">
                  ✓ All products are adequately stocked!
                </p>
              ) : (
                <div className="divide-y divide-stone-100">
                  {products.filter(p => p.stock <= 5).map((prod) => (
                    <div key={prod.id} className="py-2.5 flex justify-between items-center text-xs">
                      <span className="font-bold text-stone-700">{prod.name} ({prod.volume})</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                          {prod.stock === 0 ? "Out of stock" : `${prod.stock} left`}
                        </span>
                        <button
                          onClick={() => { setActiveTab("products"); handleStartEditStock(prod); }}
                          className="text-[10px] text-amber-700 hover:underline font-bold"
                        >
                          Restock
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick metrics graph placeholder representation */}
            <div className="glass-panel p-6 rounded-3xl space-y-4">
              <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-stone-600" />
                Accords Inventory Distribution
              </h3>
              <div className="space-y-3 pt-2">
                {Array.from(new Set(products.map(p => p.category))).map((cat) => {
                  const count = products.filter(p => p.category === cat).length;
                  const percent = Math.round((count / products.length) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs text-stone-600">
                        <span className="font-bold">{cat} Accord</span>
                        <span>{count} listings ({percent}%)</span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Product Catalogue Manager */}
      {activeTab === "products" && (
        <div className="space-y-6">
          {/* Header & Add Button */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stone-800 text-md">Stock Catalogue</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              {showAddForm ? "Close Form" : "Add Fragrance"}
            </button>
          </div>

          {/* Create Product Form */}
          {showAddForm && (
            <form onSubmit={handleAddProduct} className="glass-panel p-6 rounded-3xl border border-amber-100 space-y-4">
              <h4 className="font-bold text-stone-800 text-sm border-b pb-2">New Fragrance Specifications</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600 block">Perfume Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Oud Al-Arab"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600 block">Scent Accord (Category)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Oud">Oud</option>
                    <option value="Floral">Floral</option>
                    <option value="Woody">Woody</option>
                    <option value="Citrus">Citrus</option>
                    <option value="Oriental">Oriental</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600 block">Volume</label>
                  <select
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none"
                  >
                    <option value="50ml">50ml</option>
                    <option value="100ml">100ml</option>
                    <option value="200ml">200ml</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600 block">Concentration</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none"
                  >
                    <option value="Extrait de Parfum">Extrait de Parfum</option>
                    <option value="Eau de Parfum (EDP)">Eau de Parfum (EDP)</option>
                    <option value="Eau de Toilette (EDT)">Eau de Toilette (EDT)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600 block">Retail Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 7500"
                    value={price || ""}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600 block">Starting Stock Units</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 20"
                    value={stock || ""}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-600 block">Product Story / Scent Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe the mood, ingredients, and projection characteristics..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none resize-none"
                />
              </div>

              {/* Note Arrays inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600 block">Top Notes (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Lemon, Mint, Basil"
                    value={topNotes}
                    onChange={(e) => setTopNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600 block">Heart Notes (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Jasmine, Rose, Lavender"
                    value={heartNotes}
                    onChange={(e) => setHeartNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600 block">Base Notes (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Oud, Sandalwood, Musk"
                    value={baseNotes}
                    onChange={(e) => setBaseNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gold-btn text-white font-bold text-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          )}

          {/* Products Inventory List */}
          <div className="glass-panel overflow-hidden rounded-3xl border border-stone-200/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/70 border-b border-stone-200/50 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Fragrance</th>
                    <th className="py-3 px-4">Type / Volume</th>
                    <th className="py-3 px-4">Accord</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200/40 text-xs">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-white/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-stone-800">
                        {prod.name}
                      </td>
                      <td className="py-3.5 px-4 text-stone-500">
                        {prod.type} ({prod.volume})
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                          {prod.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-700">
                        Rs. {prod.price.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        {editingStockId === prod.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={tempStockValue}
                              onChange={(e) => setTempStockValue(Number(e.target.value))}
                              className="w-16 px-1.5 py-1 bg-white border border-stone-300 rounded focus:outline-none text-xs"
                            />
                            <button
                              onClick={() => handleSaveStock(prod.id)}
                              className="px-2 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded hover:bg-emerald-700 transition-colors"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${
                              prod.stock === 0 
                                ? "text-rose-600 font-bold" 
                                : prod.stock <= 5 
                                ? "text-amber-600" 
                                : "text-stone-700"
                            }`}>
                              {prod.stock} units
                            </span>
                            <button
                              onClick={() => handleStartEditStock(prod)}
                              className="text-stone-400 hover:text-stone-700"
                              title="Edit Stock"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete Listing"
                        >
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

      {/* TAB 3: Client Order Sheets */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <h3 className="font-bold text-stone-800 text-md">Customer Orders Log</h3>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white/40 border border-stone-200/50 rounded-3xl text-stone-500 space-y-2">
              <ShoppingBag className="w-10 h-10 text-stone-300 stroke-[1.5] mx-auto" />
              <p className="text-xs font-medium">No sales orders registered yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="glass-panel p-5 rounded-3xl border border-white/50 space-y-4 text-stone-700"
                >
                  {/* Order header row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/40 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-stone-800 text-sm">{order.id}</span>
                      <span className="text-[10px] text-stone-400 font-bold">{order.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusBadgeColor(order.status)}`}>
                        {order.status}
                      </span>

                      {/* Dropdown status update */}
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
                          className="appearance-none bg-stone-100/80 border border-stone-200 hover:border-stone-300 rounded-xl pl-3 pr-8 py-1.5 text-[11px] font-bold text-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="Pending">Set Pending</option>
                          <option value="Shipped">Set Shipped</option>
                          <option value="Delivered">Set Delivered</option>
                          <option value="Cancelled">Set Cancelled</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Customer and products row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                    {/* Customer Info */}
                    <div className="md:col-span-5 space-y-1 bg-white/40 border border-white/50 p-3.5 rounded-2xl">
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block">Customer Info</span>
                      <p className="font-bold text-stone-800">{order.customerName}</p>
                      <p className="text-stone-500 font-semibold">{order.customerPhone}</p>
                      <p className="text-stone-500 leading-relaxed mt-1 font-medium">{order.customerAddress}</p>
                    </div>

                    {/* Order Items */}
                    <div className="md:col-span-7 space-y-2">
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block">Cart Package</span>
                      <div className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-stone-700 font-medium">
                            <span className="text-stone-800">
                              {item.name} <span className="text-stone-400 font-bold">x {item.quantity}</span>
                            </span>
                            <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-stone-200/50 pt-2 flex justify-between items-center">
                        <span className="font-bold text-stone-800">Total Bill</span>
                        <span className="font-extrabold text-amber-700 text-sm">
                          Rs. {order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
