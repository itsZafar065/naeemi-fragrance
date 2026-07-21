"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { 
  ArrowLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Ticket, 
  CheckCircle,
  Truck,
  RotateCcw,
  Wallet,
  Landmark,
  ClipboardList
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { placeOrder, settings } = useAdmin();

  // 1. Customer Information
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // 2. Shipping Address
  const [streetAddress, setStreetAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("Lahore");
  const [province, setProvince] = useState("Punjab");
  const [postalCode, setPostalCode] = useState("");

  // 3. Order Notes
  const [orderNotes, setOrderNotes] = useState("");

  // 4. Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "EASYPAISA" | "JAZZCASH" | "BANK">("COD");
  const [paymentSlipUrl, setPaymentSlipUrl] = useState<string | null>(null);
  const [uploadingSlip, setUploadingSlip] = useState(false);

  // 5. Discount / Coupons
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [couponMessage, setCouponMessage] = useState("");
  const [couponError, setCouponError] = useState(false);

  // Success states
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "NAEEMI10") {
      setAppliedDiscount(10);
      setCouponMessage("Promo NAEEMI10 (10% Discount) Applied Successfully!");
      setCouponError(false);
    } else if (code === "MOHABBAT20") {
      setAppliedDiscount(20);
      setCouponMessage("Promo MOHABBAT20 (20% Discount) Applied Successfully!");
      setCouponError(false);
    } else {
      setCouponMessage("Invalid Coupon Code. Try NAEEMI10 or MOHABBAT20");
      setCouponError(true);
      setAppliedDiscount(0);
    }
  };

  // Shipping Calculations
  const shippingFee = cartTotal > 6000 ? 0 : 250;
  const discountAmount = Math.round(cartTotal * (appliedDiscount / 100));
  const finalTotal = cartTotal - discountAmount + shippingFee;

  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlip(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload receipt screenshot.");
      }

      const data = await res.json();
      setPaymentSlipUrl(data.url);
    } catch (err: any) {
      alert("Slip upload failed. Please try again or select Cash on Delivery.");
      console.error(err);
    } finally {
      setUploadingSlip(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !streetAddress || cart.length === 0) return;
    if (paymentMethod !== "COD" && !paymentSlipUrl && !uploadingSlip) {
      alert("Please upload the transaction transfer screenshot to verify your payment.");
      return;
    }

    // Concatenate address parameters for clean storage in database
    const fullAddress = `${streetAddress}${apartment ? `, Apt/Suite: ${apartment}` : ""}, ${city}, ${province}, PC: ${postalCode || "N/A"}${orderNotes ? ` | Note: ${orderNotes}` : ""}`;

    const orderItems = cart.map((item) => ({
      perfumeId: item.product.id.includes("-") ? item.product.id.split("-")[0] : item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    setCheckoutLoading(true);
    setCheckoutError("");

    const result = await placeOrder(name, email, phone, fullAddress, orderItems, finalTotal, paymentSlipUrl);
    setCheckoutLoading(false);

    if (result.success) {
      setPlacedOrderId(result.orderId || "");
      setOrderComplete(true);
      clearCart();
    } else {
      setCheckoutError(result.error || "Failed to process checkout order. Please check stock details.");
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 text-center space-y-6 glass-panel rounded-[36px] shadow-xl mt-10 border border-white/50">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto border border-emerald-200">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-stone-850 font-serif">Order Placed Successfully!</h2>
          <p className="text-sm text-stone-600 font-medium">
            Thank you for shopping at Naeemi Fragrance. Your order ID is{" "}
            <span className="font-extrabold text-amber-700">{placedOrderId}</span>.
          </p>
          <p className="text-xs text-stone-500 max-w-xs mx-auto font-sans leading-relaxed">
            Our delivery agent will contact you at <span className="font-bold text-stone-700">{phone}</span> to verify shipment details.
          </p>
        </div>
        <p className="text-xs text-amber-700/80 font-serif italic">"Naeemi Naam Hai Mohabbat Ka"</p>
        <button
          onClick={() => router.push("/")}
          className="w-full py-3 rounded-xl gold-btn font-bold text-xs shadow-md"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 px-2 sm:px-4 max-w-6xl mx-auto">
      {/* Header breadcrumb */}
      <div className="space-y-1">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-700 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
        <h1 className="text-2xl md:text-3xl font-black text-stone-850 tracking-tight pt-1 font-serif">
          Checkout
        </h1>
        <p className="text-xs text-stone-500 font-medium">Please review order items and enter details to complete purchase.</p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white/40 border border-stone-200/50 rounded-3xl space-y-4">
          <ShoppingBag className="w-10 h-10 text-stone-300 stroke-[1.5] mx-auto" />
          <h3 className="font-bold text-stone-850 text-sm">Your Fragrance Box is Empty</h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Add perfumes to your bag before proceeding to checkout.
          </p>
          <Link href="/shop" className="inline-block px-5 py-2.5 rounded-xl gold-btn font-bold text-xs">
            Shop Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Shipping form details */}
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
            
            {/* 1. Customer Information */}
            <div className="glass-panel p-6 rounded-3xl border border-white/50 space-y-4 shadow-sm">
              <h3 className="font-bold text-stone-850 text-sm border-b border-stone-200/20 pb-2 flex items-center gap-2 font-serif">
                <span className="p-1 bg-amber-500/10 text-amber-700 rounded-lg text-[10px] font-black w-6 h-6 flex items-center justify-center">1</span>
                Customer Information
              </h3>

              {checkoutError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-xl text-center">
                  {checkoutError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-sans">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Ali Nawaz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-550 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-sans">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 03001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-550 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-sans">Email Address</label>
                <input
                  type="email"
                  placeholder="ali@naeemi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-550 font-medium"
                />
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="glass-panel p-6 rounded-3xl border border-white/50 space-y-4 shadow-sm">
              <h3 className="font-bold text-stone-855 text-sm border-b border-stone-200/20 pb-2 flex items-center gap-2 font-serif">
                <span className="p-1 bg-amber-500/10 text-amber-700 rounded-lg text-[10px] font-black w-6 h-6 flex items-center justify-center">2</span>
                Shipping Address
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-sans">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="House number, building, street name, block..."
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-550 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-sans">Apartment / Suite / Unit (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Apt 4B, Floor 2"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-550 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-sans">Postal Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 54000"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-550 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-sans">City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none font-medium"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Multan">Multan</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Gujranwala">Gujranwala</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-sans">Province</label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none font-medium"
                    >
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa (KPK)</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Azad Kashmir">Azad Kashmir</option>
                      <option value="Gilgit Baltistan">Gilgit Baltistan</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Delivery Method */}
            <div className="glass-panel p-6 rounded-3xl border border-white/50 space-y-4 shadow-sm">
              <h3 className="font-bold text-stone-850 text-sm border-b border-stone-200/20 pb-2 flex items-center gap-2 font-serif">
                <span className="p-1 bg-amber-500/10 text-amber-700 rounded-lg text-[10px] font-black w-6 h-6 flex items-center justify-center">3</span>
                Delivery Method
              </h3>
              
              <div className="p-4 rounded-2xl border border-amber-600 bg-amber-500/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-amber-500/10 text-amber-700 rounded-lg">
                    <Truck className="w-5 h-5" />
                  </span>
                  <div className="text-left">
                    <span className="text-xs font-bold text-stone-850 block">
                      {cartTotal > 6000 ? "Free Scent Delivery" : "Standard Courier Shipping"}
                    </span>
                    <span className="text-[9px] text-stone-500 font-medium">Safe delivery to your doorstep within 3-5 business days.</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-800">
                  {cartTotal > 6000 ? "FREE" : "Rs. 250"}
                </span>
              </div>
            </div>

            {/* 4. Payment Method */}
            <div className="glass-panel p-6 rounded-3xl border border-white/50 space-y-4 shadow-sm">
              <h3 className="font-bold text-stone-855 text-sm border-b border-stone-200/20 pb-2 flex items-center gap-2 font-serif">
                <span className="p-1 bg-amber-500/10 text-amber-700 rounded-lg text-[10px] font-black w-6 h-6 flex items-center justify-center">4</span>
                Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* COD Option */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("COD");
                    setPaymentSlipUrl(null);
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                    paymentMethod === "COD"
                      ? "bg-amber-500/5 border-amber-500 shadow-xs"
                      : "bg-white border-stone-200 hover:bg-stone-50/50"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-bold text-stone-850">Cash on Delivery (COD)</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${paymentMethod === "COD" ? "bg-amber-500" : "bg-stone-250"}`} />
                  </div>
                  <span className="text-[9px] text-stone-500 leading-normal">Pay cash upon delivery at your doorstep.</span>
                </button>

                {/* EasyPaisa Option */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("EASYPAISA");
                    setPaymentSlipUrl(null);
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                    paymentMethod === "EASYPAISA"
                      ? "bg-amber-500/5 border-amber-500 shadow-xs"
                      : "bg-white border-stone-200 hover:bg-stone-50/50"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-emerald-600" /> EasyPaisa
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${paymentMethod === "EASYPAISA" ? "bg-amber-500" : "bg-stone-250"}`} />
                  </div>
                  <span className="text-[9px] text-stone-500 leading-normal font-medium">Transfer beforehand using EasyPaisa mobile app.</span>
                </button>

                {/* JazzCash Option */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("JAZZCASH");
                    setPaymentSlipUrl(null);
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                    paymentMethod === "JAZZCASH"
                      ? "bg-amber-500/5 border-amber-500 shadow-xs"
                      : "bg-white border-stone-200 hover:bg-stone-50/50"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-bold text-stone-850 flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-red-650" /> JazzCash
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${paymentMethod === "JAZZCASH" ? "bg-amber-500" : "bg-stone-250"}`} />
                  </div>
                  <span className="text-[9px] text-stone-500 leading-normal font-medium">Transfer beforehand using JazzCash mobile app.</span>
                </button>

                {/* Bank Transfer Option */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("BANK");
                    setPaymentSlipUrl(null);
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                    paymentMethod === "BANK"
                      ? "bg-amber-500/5 border-amber-500 shadow-xs"
                      : "bg-white border-stone-200 hover:bg-stone-50/50"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-bold text-stone-855 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-blue-600" /> Bank Transfer
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${paymentMethod === "BANK" ? "bg-amber-500" : "bg-stone-250"}`} />
                  </div>
                  <span className="text-[9px] text-stone-500 leading-normal font-medium">Direct transfer to our official business bank account.</span>
                </button>
              </div>

              {/* Digital transfer info and slip upload inputs */}
              {paymentMethod !== "COD" && (
                <div className="p-4 rounded-2xl border border-amber-500/10 bg-amber-500/5 space-y-4 animate-fadeIn">
                  <div className="text-xs space-y-1.5">
                    <p className="font-extrabold text-amber-900">Transfer Instructions:</p>
                    <p className="text-stone-750 font-medium">
                      Please send **Rs. {finalTotal.toLocaleString()}** to the following destination:
                    </p>
                    
                    {paymentMethod === "EASYPAISA" && (
                      <div className="p-3 bg-white/70 border border-stone-200/50 rounded-xl space-y-1">
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wide block">EasyPaisa Account</span>
                        <p className="font-black text-sm text-stone-850">📲 {settings?.easyPaisaAccount || "03092184760"}</p>
                        <p className="text-[9px] text-stone-500 font-bold">Account Name: Naeemi Fragrances</p>
                      </div>
                    )}

                    {paymentMethod === "JAZZCASH" && (
                      <div className="p-3 bg-white/70 border border-stone-200/50 rounded-xl space-y-1">
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wide block">JazzCash Account</span>
                        <p className="font-black text-sm text-stone-850">📲 0309-2184760</p>
                        <p className="text-[9px] text-stone-500 font-bold">Account Name: Naeemi Fragrances</p>
                      </div>
                    )}

                    {paymentMethod === "BANK" && (
                      <div className="p-3 bg-white/70 border border-stone-200/50 rounded-xl space-y-1">
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wide block">Bank Account Details</span>
                        <p className="font-bold text-stone-800 text-xs">Allied Bank Limited (ABL)</p>
                        <p className="font-black text-sm text-stone-850">Account #: 0110002030405</p>
                        <p className="text-[9px] text-stone-500 font-bold">Account Title: Naeemi Fragrance | Branch Code: 0546</p>
                      </div>
                    )}

                    <p className="text-[10px] text-stone-500 font-medium pt-1">
                      After transferring, please upload the payment confirmation screenshot or receipt slip below:
                    </p>
                  </div>

                  <div className="space-y-1.5 border-t border-stone-200/40 pt-3">
                    <label className="text-[9px] font-extrabold text-stone-500 uppercase tracking-widest block font-sans">Upload Payment Receipt</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSlipUpload}
                      className="w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-amber-700 file:text-white file:cursor-pointer hover:file:bg-amber-800"
                      required
                    />
                    {uploadingSlip && (
                      <p className="text-[10px] font-bold text-amber-700 animate-pulse">Uploading receipt screenshot...</p>
                    )}
                    {paymentSlipUrl && (
                      <p className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">✓ Receipt screenshot linked successfully!</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Order Notes */}
            <div className="glass-panel p-6 rounded-3xl border border-white/50 space-y-4 shadow-sm">
              <h3 className="font-bold text-stone-850 text-sm border-b border-stone-200/20 pb-2 flex items-center gap-2 font-serif">
                <span className="p-1 bg-amber-500/10 text-amber-700 rounded-lg text-[10px] font-black w-6 h-6 flex items-center justify-center">5</span>
                Order Notes
              </h3>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block font-sans">Special Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Leave package at the reception desk, call before arriving, etc..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white/70 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-550 font-medium resize-none shadow-xs"
                />
              </div>
            </div>

          </form>

          {/* RIGHT COLUMN: Order summary, coupons, total calculations */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 6. Order Summary */}
            <div className="glass-panel p-6 rounded-3xl border border-white/50 space-y-4 shadow-sm">
              <h3 className="font-bold text-stone-850 text-sm border-b border-stone-200/20 pb-2 font-serif">Order Summary</h3>

              {/* Items List */}
              <div className="divide-y divide-stone-200/30 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-3.5 flex gap-3.5 items-center">
                    {/* Miniature product image with proper image fallback */}
                    <div className="w-14 h-14 rounded-xl border shrink-0 overflow-hidden bg-stone-100 flex items-center justify-center relative shadow-xs">
                      {item.product.imageUrl && item.product.imageUrl.startsWith("linear-gradient") ? (
                        <div className="absolute inset-0" style={{ background: item.product.imageUrl }} />
                      ) : (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="flex-grow min-w-0 text-xs space-y-0.5">
                      <h4 className="font-extrabold text-stone-850 truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-stone-450 font-bold">
                        {item.product.volume} • Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-stone-800 shrink-0">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Coupon Panel */}
              <form onSubmit={handleApplyCoupon} className="pt-3 border-t border-stone-200/30 space-y-2">
                <label className="text-[9px] font-extrabold text-stone-500 uppercase tracking-widest block flex items-center gap-1 font-sans">
                  <Ticket className="w-3.5 h-3.5 text-amber-600" /> Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon e.g. NAEEMI10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none uppercase font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-stone-850 hover:bg-stone-750 text-white font-bold text-xs transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-[10px] font-bold ${couponError ? "text-rose-600" : "text-emerald-700"}`}>
                    {couponMessage}
                  </p>
                )}
              </form>

              {/* Calculations list */}
              <div className="pt-3 border-t border-stone-200/30 space-y-2 text-xs text-stone-600 font-semibold font-sans">
                <div className="flex justify-between items-center">
                  <span>Cart Subtotal</span>
                  <span>Rs. {cartTotal.toLocaleString()}</span>
                </div>
                
                {appliedDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700 font-bold">
                    <span>Discount Coupon ({appliedDiscount}%)</span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Shipping Fee</span>
                  <span>{shippingFee === 0 ? "FREE" : `Rs. ${shippingFee}`}</span>
                </div>

                <div className="border-t border-stone-200/50 pt-2.5 flex justify-between items-center text-stone-850 font-black">
                  <span className="text-sm">Total Amount</span>
                  <span className="text-base text-amber-800 font-serif">Rs. {finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* 7. Place Order Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={checkoutLoading || uploadingSlip}
                  className="w-full py-4 rounded-2xl gold-btn font-extrabold text-xs tracking-wider uppercase shadow-md disabled:bg-stone-300 disabled:shadow-none"
                >
                  {checkoutLoading
                    ? "Processing Order..."
                    : `Confirm & Place Order`}
                </button>
              </div>

              {/* Safety notice */}
              <div className="flex items-center gap-1.5 justify-center text-[10px] text-stone-400 font-bold uppercase tracking-wider pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Secure Checkout Guarantee
              </div>
            </div>
            
          </div>
          
        </div>
      )}
    </div>
  );
}
