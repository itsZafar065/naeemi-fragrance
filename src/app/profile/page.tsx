"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/context/CustomerContext";
import { 
  User, 
  ShoppingBag, 
  LogOut, 
  Edit2, 
  Lock, 
  Calendar, 
  CheckCircle2, 
  Loader,
  Sparkles,
  Shield,
  Truck,
  RotateCcw
} from "lucide-react";

interface OrderItem {
  perfumeId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  date: string;
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const { customer, loading, login, signup, logout, updateProfile } = useCustomer();
  
  // Tab state for auth
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  
  // Auth Form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Profile Edit inputs
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Sync edit profile fields when customer logs in or edits
  useEffect(() => {
    if (customer) {
      setEditName(customer.name);
      setEditPhone(customer.phone);
      setEditAddress(customer.address);
      fetchOrders();
    }
  }, [customer]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await fetch("/api/customer/orders");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        }
      }
    } catch (err) {
      console.error("Error loading customer orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setFormSubmitting(true);

    if (authTab === "login") {
      const res = await login(email, password);
      if (res.success) {
        setAuthSuccess("Successfully logged in!");
        setEmail("");
        setPassword("");
      } else {
        setAuthError(res.error || "Invalid credentials.");
      }
    } else {
      const res = await signup(name, email, password, phone, address);
      if (res.success) {
        setAuthSuccess("Account successfully registered!");
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setAddress("");
      } else {
        setAuthError(res.error || "Registration failed.");
      }
    }
    setFormSubmitting(false);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");
    setEditSubmitting(true);

    const res = await updateProfile(editName, editPhone, editAddress);
    if (res.success) {
      setEditSuccess("Profile updated successfully!");
      setIsEditing(false);
    } else {
      setEditError(res.error || "Update failed.");
    }
    setEditSubmitting(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200/50";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200/50";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200/50";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200/50";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200/50";
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 md:py-10 px-4 md:px-6 text-stone-800 animate-fadeIn">
      {loading ? (
        <div className="glass-panel p-16 rounded-[36px] border border-white/50 flex flex-col items-center justify-center space-y-4">
          <Loader className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Checking Session...</p>
        </div>
      ) : customer ? (
        // ==========================================
        // --- CUSTOMER IS LOGGED IN (DASHBOARD) ---
        // ==========================================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: VIP Profile Card & Shipping Details (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* VIP Card */}
            <div className="glass-panel p-6 rounded-[28px] border border-white/50 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shadow-inner shrink-0">
                  <User className="w-7 h-7" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="font-extrabold text-stone-850 text-base leading-tight">{customer.name}</h2>
                  <span className="text-[9px] bg-amber-600/10 text-amber-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider block w-fit">
                    Naeemi VIP Member
                  </span>
                </div>
              </div>
              <button 
                onClick={() => logout()}
                className="p-2.5 rounded-xl hover:bg-stone-100/50 text-stone-550 hover:text-rose-600 transition-colors flex items-center gap-1.5 text-xs font-bold border border-stone-200/30 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Shipping Details form */}
            <div className="glass-panel p-6 rounded-[28px] border border-white/50 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-200/30 pb-3">
                <h3 className="font-extrabold text-xs text-stone-850 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-600" />
                  Shipping Profile
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                )}
              </div>

              {editError && (
                <div className="bg-rose-50 text-rose-800 text-[11px] font-medium p-3 rounded-xl border border-rose-200/50 text-center">
                  {editError}
                </div>
              )}
              {editSuccess && (
                <div className="bg-emerald-50 text-emerald-800 text-[11px] font-medium p-3 rounded-xl border border-emerald-200/50 text-center">
                  {editSuccess}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">Default Shipping Address</label>
                    <textarea
                      required
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 min-h-[70px] leading-relaxed"
                    />
                  </div>
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="submit"
                      disabled={editSubmitting}
                      className="flex-1 btn-primary py-2.5 rounded-xl text-xs font-bold shadow-md shadow-amber-500/10 cursor-pointer"
                    >
                      {editSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditName(customer.name);
                        setEditPhone(customer.phone);
                        setEditAddress(customer.address);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-3 border-b border-stone-200/20 pb-2.5">
                    <span className="text-stone-400 font-semibold">Email</span>
                    <span className="col-span-2 font-bold text-stone-750">{customer.email}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-stone-200/20 pb-2.5">
                    <span className="text-stone-400 font-semibold">Phone</span>
                    <span className="col-span-2 font-bold text-stone-750">{customer.phone || "—"}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-stone-400 font-semibold text-left">Address</span>
                    <span className="col-span-2 font-semibold text-stone-705 leading-relaxed">{customer.address || "No address saved. Add one to speed up checkout!"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Order History & Tracking list (col-span-7) */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-[28px] border border-white/50 space-y-4 shadow-sm min-h-[450px]">
            <h3 className="font-extrabold text-xs text-stone-850 uppercase tracking-widest flex items-center gap-2 border-b border-stone-200/30 pb-3">
              <ShoppingBag className="w-4.5 h-4.5 text-amber-600" />
              Order History & Tracking
            </h3>

            {ordersLoading ? (
              <div className="py-20 text-center space-y-2 flex flex-col items-center">
                <Loader className="w-7 h-7 text-amber-500 animate-spin" />
                <span className="text-[11px] text-stone-450 uppercase font-bold tracking-wider">Syncing orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-20 text-center text-stone-450 text-xs leading-relaxed space-y-3">
                <p>No orders placed on this account yet.</p>
                <Link href="/shop" className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-block border border-amber-600/30 px-4 py-2 rounded-xl bg-amber-50/20">
                  Browse Fragrances & Place Your First Order →
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="p-4 bg-white/50 border border-stone-200/30 rounded-2xl space-y-3 hover:bg-white/80 transition-all text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-extrabold text-amber-600 text-sm block">{order.id}</span>
                        <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5 font-medium">
                          <Calendar className="w-3.5 h-3.5" /> {order.date}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="border-t border-stone-200/20 pt-2.5 text-[11px] text-stone-600 space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between font-semibold">
                          <span>{item.name} <strong className="text-stone-400 font-bold ml-1">x{item.quantity}</strong></span>
                          <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-stone-200/20 pt-2 flex justify-between items-center font-bold text-stone-850">
                      <span>Total Amount:</span>
                      <span className="text-sm text-stone-900">Rs. {order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // ==========================================
        // --- CUSTOMER NOT LOGGED IN (AUTH SCREEN) ---
        // ==========================================
        <div className="grid grid-cols-1 md:grid-cols-12 rounded-[32px] overflow-hidden border border-white/60 bg-white/20 backdrop-blur-md shadow-xl min-h-[580px] max-w-5xl mx-auto items-stretch">
          
          {/* LEFT SIDE: Dynamic Forms (col-span-12 on Mobile, col-span-6 on Desktop) */}
          <div className="md:col-span-6 p-6 sm:p-10 flex flex-col justify-center space-y-6">
            
            {/* Mobile Header Image Overlay (Only visible on mobile) */}
            <div className="block md:hidden relative w-full h-32 rounded-2xl overflow-hidden border border-amber-500/20 shadow-sm mb-4">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/heroimg.webp')` }}
              />
              <div className="absolute inset-0 bg-stone-950/70" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 space-y-1.5 animate-fadeIn">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-[#faf7f2] border border-amber-500/30 flex items-center justify-center p-0.5 shadow-sm">
                  <img src="/logo.svg" className="w-full h-full object-cover" alt="Logo" />
                </div>
                <div className="text-center">
                  <h2 className="font-serif text-xs font-extrabold text-white tracking-widest uppercase">NAEEMI FRAGRANCE</h2>
                  <p className="text-[7.5px] text-amber-400 font-bold uppercase tracking-[0.2em] leading-none mt-0.5">Naeemi Naam Hai Mohabbat Ka</p>
                </div>
              </div>
            </div>

            {/* Desktop Brand Header Label */}
            <div className="hidden md:block space-y-1">
              <h2 className="font-extrabold text-stone-850 text-xl tracking-wide uppercase font-serif">Customer Portal</h2>
              <p className="text-xs text-stone-450">Login or sign up to experience luxury Oud orders tracking.</p>
            </div>

            {/* Tab Selector */}
            <div className="flex bg-stone-100/60 p-1 rounded-2xl border border-stone-200/20">
              <button
                onClick={() => { setAuthTab("login"); setAuthError(""); setAuthSuccess(""); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  authTab === "login"
                    ? "bg-white text-amber-600 shadow-[0_4px_12px_rgba(212,175,55,0.06)] border border-stone-200/30"
                    : "text-stone-500 hover:text-stone-850"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthTab("signup"); setAuthError(""); setAuthSuccess(""); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  authTab === "signup"
                    ? "bg-white text-amber-600 shadow-[0_4px_12px_rgba(212,175,55,0.06)] border border-stone-200/30"
                    : "text-stone-500 hover:text-stone-850"
                }`}
              >
                Create Account
              </button>
            </div>

            {authError && (
              <div className="bg-rose-50 text-rose-800 text-[11px] font-semibold p-3.5 rounded-xl border border-rose-200/50 text-center animate-fadeIn">
                {authError}
              </div>
            )}
            {authSuccess && (
              <div className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold p-3.5 rounded-xl border border-emerald-200/50 text-center animate-fadeIn">
                {authSuccess}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authTab === "signup" && (
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Salman Khan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="salman@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                />
                {authTab === "signup" && (
                  <p className="text-[9px] text-stone-400 font-medium leading-normal mt-1">
                    Min 8 characters, must include an uppercase, lowercase, and a number.
                  </p>
                )}
              </div>

              {authTab === "signup" && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Shipping Address (Optional)</label>
                    <textarea
                      placeholder="Gulberg III, Lahore, Pakistan"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 min-h-[60px] leading-relaxed"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full btn-primary py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 mt-4 cursor-pointer"
              >
                {formSubmitting ? (
                  <Loader className="w-4 h-4 animate-spin text-white" />
                ) : authTab === "login" ? (
                  <>
                    <Lock className="w-4 h-4" /> Sign In
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Register Profile
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT SIDE: Beautiful Luxury Brand Banner (Only visible on desktop) */}
          <div className="hidden md:flex md:col-span-6 relative overflow-hidden flex-col justify-between p-12 text-white bg-stone-950">
            {/* Background Image with elegant overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[4000ms] hover:scale-105"
              style={{ backgroundImage: `url('/heroimg.webp')` }}
            />
            <div className="absolute inset-0 bg-stone-950/70 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-stone-900/40 to-amber-950/25" />

            {/* Brand Logo & Tagline (Top) */}
            <div className="relative z-10 flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-full overflow-hidden bg-[#faf7f2] border border-amber-500/30 flex items-center justify-center p-0.5 shadow-[0_4px_16px_rgba(212,175,55,0.15)] shrink-0">
                <img src="/logo.svg" className="w-full h-full object-cover" alt="Brand Logo" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold tracking-widest text-sm uppercase font-serif text-white">NAEEMI FRAGRANCE</h3>
                <p className="text-[8px] font-bold text-amber-400 uppercase tracking-[0.2em] leading-none">Naeemi Naam Hai Mohabbat Ka</p>
              </div>
            </div>

            {/* Large Typography Stack (Center) */}
            <div className="relative z-10 space-y-4 max-w-sm">
              <span className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 w-fit block font-serif">
                Pure Extrait de Parfum
              </span>
              <h2 className="font-serif text-3.5xl font-extrabold tracking-wide leading-tight text-white">
                Experience the Art of <span className="text-amber-400 italic font-medium font-serif">Sillage & Longevity</span>
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed font-medium">
                Indulge in premium Arabic Ouds, exotic French florals, and rich musk profiles, handcrafted with pure essential oil concentrates to project luxury that lasts.
              </p>
            </div>

            {/* Benefit highlights (Bottom) */}
            <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6 text-center text-white/90">
              <div className="space-y-1 flex flex-col items-center">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="text-[9px] font-bold uppercase tracking-wider block">100% Original</span>
              </div>
              <div className="space-y-1 flex flex-col items-center">
                <Truck className="w-4 h-4 text-amber-400" />
                <span className="text-[9px] font-bold uppercase tracking-wider block">Free COD</span>
              </div>
              <div className="space-y-1 flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span className="text-[9px] font-bold uppercase tracking-wider block">Easy Returns</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
