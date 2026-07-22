"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/context/CustomerContext";
import { 
  User, 
  HelpCircle, 
  FileText, 
  Truck, 
  RefreshCw, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  Heart,
  Sparkles,
  ShoppingBag,
  LogOut,
  Edit2,
  Lock,
  Calendar,
  CheckCircle2,
  Loader
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

export default function MoreMenuPage() {
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

  // Accordion active policy state
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const togglePolicy = (policy: string) => {
    setActivePolicy(activePolicy === policy ? null : policy);
  };

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
    <div className="space-y-6 pb-12 max-w-xl mx-auto animate-fadeIn text-stone-850">
      
      {/* 1. DYNAMIC ACCOUNT HUB */}
      {loading ? (
        <div className="glass-panel p-10 rounded-[28px] border border-white/50 flex flex-col items-center justify-center space-y-4">
          <Loader className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs text-stone-550 font-semibold uppercase tracking-wider">Checking Session...</p>
        </div>
      ) : customer ? (
        // --- CUSTOMER LOGGED IN SCREEN ---
        <div className="space-y-6">
          {/* Header Profile card */}
          <div className="glass-panel p-6 rounded-[28px] border border-white/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shadow-inner">
                <User className="w-7 h-7" />
              </div>
              <div className="space-y-0.5">
                <h2 className="font-extrabold text-stone-850 text-base">{customer.name}</h2>
                <span className="text-[9px] bg-amber-600/10 text-amber-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider block w-fit">
                  Naeemi VIP Member
                </span>
              </div>
            </div>
            <button 
              onClick={() => logout()}
              className="p-2.5 rounded-xl hover:bg-stone-100/50 text-stone-550 hover:text-rose-605 transition-colors flex items-center gap-1.5 text-xs font-bold border border-stone-200/30"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Profile Details Edit Card */}
          <div className="glass-panel p-6 rounded-[28px] border border-white/50 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200/30 pb-3">
              <h3 className="font-extrabold text-xs text-stone-800 uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                Shipping Profile
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
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
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Default Shipping Address</label>
                  <textarea
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 min-h-[70px]"
                  />
                </div>
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    className="flex-1 btn-primary py-2.5 rounded-xl text-xs font-bold"
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
                    className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-3 border-b border-stone-200/20 pb-2">
                  <span className="text-stone-400 font-semibold">Email</span>
                  <span className="col-span-2 font-bold text-stone-750">{customer.email}</span>
                </div>
                <div className="grid grid-cols-3 border-b border-stone-200/20 pb-2">
                  <span className="text-stone-400 font-semibold">Phone</span>
                  <span className="col-span-2 font-bold text-stone-750">{customer.phone || "—"}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-stone-400 font-semibold text-left">Address</span>
                  <span className="col-span-2 font-semibold text-stone-750 leading-relaxed">{customer.address || "No address saved. Add one to expedite your future orders!"}</span>
                </div>
              </div>
            )}
          </div>

          {/* Orders Tracking Card */}
          <div className="glass-panel p-6 rounded-[28px] border border-white/50 space-y-4">
            <h3 className="font-extrabold text-xs text-stone-850 uppercase tracking-widest flex items-center gap-2 border-b border-stone-200/30 pb-3">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              Order History & Tracking
            </h3>

            {ordersLoading ? (
              <div className="py-6 text-center space-y-2 flex flex-col items-center">
                <Loader className="w-5 h-5 text-amber-500 animate-spin" />
                <span className="text-[11px] text-stone-450 uppercase font-bold tracking-wider">Syncing orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-6 text-center text-stone-450 text-xs leading-relaxed space-y-2">
                <p>No orders placed on this account yet.</p>
                <Link href="/shop" className="text-xs font-bold text-amber-600 hover:underline block">
                  Browse Fragrances & Place Your First Order →
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="p-4 bg-white/40 border border-stone-200/30 rounded-2xl space-y-3 hover:bg-white/60 transition-all text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-extrabold text-amber-600 block">{order.id}</span>
                        <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> {order.date}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="border-t border-stone-200/20 pt-2 text-[11px] text-stone-600 space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between font-semibold">
                          <span>{item.name} <strong className="text-stone-400">x{item.quantity}</strong></span>
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
        // --- CUSTOMER NOT LOGGED IN (AUTH TABS) ---
        <div className="glass-panel p-6 rounded-[28px] border border-white/50 space-y-6">
          {/* Header Icon */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 mx-auto">
              <User className="w-7 h-7" />
            </div>
            <h2 className="font-extrabold text-stone-855 text-base">Naeemi Member Account</h2>
            <p className="text-[11px] text-stone-450 leading-relaxed max-w-xs mx-auto text-center">
              Login or register to track your orders, save shipping info, and access VIP offers.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-stone-100/50 p-1.5 rounded-2xl border border-stone-200/20">
            <button
              onClick={() => { setAuthTab("login"); setAuthError(""); setAuthSuccess(""); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                authTab === "login"
                  ? "bg-white text-amber-600 shadow-[0_4px_12px_rgba(212,175,55,0.06)] border border-stone-200/30"
                  : "text-stone-500 hover:text-stone-850"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthTab("signup"); setAuthError(""); setAuthSuccess(""); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                authTab === "signup"
                  ? "bg-white text-amber-600 shadow-[0_4px_12px_rgba(212,175,55,0.06)] border border-stone-200/30"
                  : "text-stone-500 hover:text-stone-850"
              }`}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <div className="bg-rose-50 text-rose-800 text-[11px] font-medium p-3 rounded-xl border border-rose-200/50 text-center animate-fadeIn">
              {authError}
            </div>
          )}
          {authSuccess && (
            <div className="bg-emerald-50 text-emerald-800 text-[11px] font-medium p-3 rounded-xl border border-emerald-200/50 text-center animate-fadeIn">
              {authSuccess}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authTab === "signup" && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salman Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Email Address *</label>
              <input
                type="email"
                required
                placeholder="salman@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
              />
              {authTab === "signup" && (
                <p className="text-[9px] text-stone-400 leading-normal mt-0.5">
                  Min 8 characters, must include an uppercase letter, lowercase letter, and a number.
                </p>
              )}
            </div>

            {authTab === "signup" && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Shipping Address (Optional)</label>
                  <textarea
                    placeholder="Gulberg III, Lahore, Pakistan"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 min-h-[60px]"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={formSubmitting}
              className="w-full btn-primary py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 mt-2"
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
      )}

      {/* 2. PERSISTENT INFORMATION ACCORDION MENU */}
      <div className="glass-panel rounded-[28px] overflow-hidden border border-white/50 divide-y divide-stone-200/40 text-xs">
        
        {/* About Us entry */}
        <div className="p-4 space-y-2">
          <button 
            onClick={() => togglePolicy("about")}
            className="w-full flex items-center justify-between text-stone-700 font-bold text-left"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>About Naeemi Fragrance</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${activePolicy === "about" ? "rotate-90" : ""}`} />
          </button>
          {activePolicy === "about" && (
            <p className="text-[11px] text-stone-500 leading-relaxed pl-7 pt-1 animate-fadeIn">
              Naeemi Fragrance is dedicated to handcrafted luxury. Using authentic Arabic Ouds and imported French floral concentrates, we create high-sillage entries that endure. True to our tagline, "Naeemi Naam Hai Mohabbat Ka", we prioritize absolute care and customer satisfaction.
            </p>
          )}
        </div>

        {/* Delivery & Shipping Info */}
        <div className="p-4 space-y-2">
          <button 
            onClick={() => togglePolicy("shipping")}
            className="w-full flex items-center justify-between text-stone-700 font-bold text-left"
          >
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>Shipping & Delivery Policy</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${activePolicy === "shipping" ? "rotate-90" : ""}`} />
          </button>
          {activePolicy === "shipping" && (
            <p className="text-[11px] text-stone-500 leading-relaxed pl-7 pt-1 animate-fadeIn">
              We ship orders nationwide across Pakistan via secure Cash on Delivery (COD) couriers. Delivery takes 2-4 working days. Shipping is completely free for orders above Rs. 6,000, else a standard Rs. 250 fee applies.
            </p>
          )}
        </div>

        {/* Returns & Exchange policy */}
        <div className="p-4 space-y-2">
          <button 
            onClick={() => togglePolicy("returns")}
            className="w-full flex items-center justify-between text-stone-700 font-bold text-left"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>Returns & Exchange (7 Days)</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${activePolicy === "returns" ? "rotate-90" : ""}`} />
          </button>
          {activePolicy === "returns" && (
            <p className="text-[11px] text-stone-500 leading-relaxed pl-7 pt-1 animate-fadeIn">
              We offer a hassle-free 7-day return and exchange policy on all unused products. If you are not satisfied with the fragrance strength or projection, contact support within 7 days of receiving the package for assistance.
            </p>
          )}
        </div>

        {/* FAQs */}
        <div className="p-4 space-y-2">
          <button 
            onClick={() => togglePolicy("faq")}
            className="w-full flex items-center justify-between text-stone-700 font-bold text-left"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Frequently Asked Questions</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${activePolicy === "faq" ? "rotate-90" : ""}`} />
          </button>
          {activePolicy === "faq" && (
            <div className="text-[11px] text-stone-500 leading-relaxed pl-7 pt-2 space-y-2 animate-fadeIn">
              <p><strong>Q: What is the average longevity of Naeemi perfumes?</strong><br />A: Our scents are mixed at Extrait strength, lasting up to 10-12 hours on skin and fabrics.</p>
              <p><strong>Q: Can I request customized wedding gifting packages?</strong><br />A: Yes, custom bridal/gifting batches can be ordered via WhatsApp support at 03092184760.</p>
            </div>
          )}
        </div>

        {/* Legal policies (Terms & Privacy) */}
        <div className="p-4 space-y-2">
          <button 
            onClick={() => togglePolicy("legal")}
            className="w-full flex items-center justify-between text-stone-700 font-bold text-left"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Terms of Service & Privacy Policy</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-stone-400 transition-transform ${activePolicy === "legal" ? "rotate-90" : ""}`} />
          </button>
          {activePolicy === "legal" && (
            <p className="text-[11px] text-stone-500 leading-relaxed pl-7 pt-1 animate-fadeIn">
              By using our platform, you consent to our terms of processing cash orders and handling client contacts safely. We secure all personal credentials and never sell user information to third-party databases.
            </p>
          )}
        </div>
      </div>

      {/* 3. Support Contacts */}
      <div className="glass-panel p-5 rounded-[28px] border border-white/50 space-y-3.5 text-xs text-stone-700">
        <h4 className="font-bold text-[10px] uppercase tracking-widest text-stone-400">Naeemi Customer Support</h4>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-amber-600" />
            <span className="font-semibold">03092184760</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-amber-600" />
            <span>support@naeemi.com</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Gulberg III, Lahore, Pakistan</span>
          </div>
        </div>
      </div>

      {/* 4. Social Links & Copyright */}
      <div className="text-center space-y-4 pt-2">
        <div className="flex justify-center items-center gap-4 text-[10px] font-bold text-stone-400">
          <span className="hover:text-amber-600 cursor-pointer">FACEBOOK</span>
          <span className="hover:text-amber-600 cursor-pointer animate-pulse">•</span>
          <span className="hover:text-amber-600 cursor-pointer">INSTAGRAM</span>
        </div>
        <div className="text-[10px] text-stone-450 flex items-center justify-center gap-1">
          <span>© {new Date().getFullYear()} Naeemi Fragrance. Made with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>in Pakistan.</span>
        </div>
      </div>
    </div>
  );
}
