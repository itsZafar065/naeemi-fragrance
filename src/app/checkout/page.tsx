"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { ArrowLeft, ShoppingBag, ShieldCheck, Ticket, Trash2, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const { placeOrder } = useAdmin();

  // Customer forms state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Lahore");

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "EASYPAISA">("COD");
  const [paymentSlipUrl, setPaymentSlipUrl] = useState<string | null>(null);
  const [uploadingSlip, setUploadingSlip] = useState(false);
  const { settings } = useAdmin();

  // Discount / Coupons
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
    if (!name || !phone || !address || cart.length === 0) return;
    if (paymentMethod === "EASYPAISA" && !paymentSlipUrl && !uploadingSlip) {
      alert("Please upload the transaction transfer screenshot to verify your payment.");
      return;
    }

    const orderItems = cart.map((item) => ({
      perfumeId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    setCheckoutLoading(true);
    setCheckoutError("");

    const result = await placeOrder(name, email, phone, address, orderItems, finalTotal, paymentSlipUrl);
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
      <div className="max-w-md mx-auto py-16 px-6 text-center space-y-6 glass-panel rounded-[36px] shadow-xl mt-10">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto border border-emerald-200">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-stone-800 font-serif">Order Placed Successfully!</h2>
          <p className="text-sm text-stone-600">
            Thank you for shopping at Naeemi Fragrance. Your order id is{" "}
            <span className="font-extrabold text-amber-700">{placedOrderId}</span>.
          </p>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Our delivery rider will contact you at <span className="font-bold text-stone-700">{phone}</span> before delivery.
          </p>
        </div>
        <p className="text-xs text-amber-700/80 font-serif italic">"Naeemi Naam Hai Mohabbat Ka"</p>
        <button
          onClick={() => router.push("/")}
          className="w-full py-3.5 rounded-2xl gold-btn font-bold text-xs"
        >
          Return to Home Page
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-700 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
        <h1 className="text-2xl md:text-3xl font-black text-stone-800 tracking-tight pt-1">
          Secure Checkout
        </h1>
        <p className="text-xs text-stone-500">Provide shipping details to finalize your fragrance package</p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white/40 border border-stone-200/50 rounded-3xl space-y-4">
          <ShoppingBag className="w-10 h-10 text-stone-300 stroke-[1.5] mx-auto" />
          <h3 className="font-bold text-stone-800 text-sm">Your Fragrance Box is Empty</h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Add perfumes to your bag before proceeding to checkout.
          </p>
          <Link href="/shop" className="inline-block px-5 py-2.5 rounded-xl gold-btn font-bold text-xs">
            Shop Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Shipping form */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handlePlaceOrder} className="glass-panel p-6 rounded-3xl border border-white/50 space-y-5">
              <h3 className="font-bold text-stone-800 text-base border-b pb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                Shipping Information (COD)
              </h3>

              {checkoutError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-xl text-center">
                  {checkoutError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Ali Nawaz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 03092184760"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="ali@naeemi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">Detailed Address</label>
                  <input
                    type="text"
                    required
                    placeholder="House number, street name, block, area..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Multan">Multan</option>
                  </select>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest block">Payment Method</label>
                
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
                      <span className="text-xs font-bold text-stone-850">Cash on Delivery</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${paymentMethod === "COD" ? "bg-amber-500" : "bg-stone-250"}`} />
                    </div>
                    <span className="text-[9px] text-stone-500 leading-normal">Pay cash upon delivery at your doorstep.</span>
                  </button>

                  {/* EasyPaisa Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("EASYPAISA")}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                      paymentMethod === "EASYPAISA"
                        ? "bg-amber-500/5 border-amber-500 shadow-xs"
                        : "bg-white border-stone-200 hover:bg-stone-50/50"
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-bold text-stone-855">EasyPaisa Transfer</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${paymentMethod === "EASYPAISA" ? "bg-amber-500" : "bg-stone-250"}`} />
                    </div>
                    <span className="text-[9px] text-stone-500 leading-normal">Pay beforehand using direct mobile transfer.</span>
                  </button>
                </div>

                {paymentMethod === "EASYPAISA" && (
                  <div className="p-4 rounded-2xl border border-amber-500/10 bg-amber-500/5 space-y-3.5 animate-fadeIn">
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-amber-900">Transfer Instructions:</p>
                      <p className="text-stone-700">
                        Please send **Rs. {finalTotal.toLocaleString()}** to our official EasyPaisa Account:
                      </p>
                      <p className="font-extrabold text-sm text-stone-900 tracking-wider">
                        📲 {settings?.easyPaisaAccount || "03092184760"}
                      </p>
                      <p className="text-[10px] text-stone-500 font-medium">
                        After transferring, upload the payment confirmation screenshot or receipt slip below:
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-extrabold text-stone-500 uppercase tracking-widest block">Upload Transfer Receipt</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlipUpload}
                        className="w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-amber-700 file:text-white file:cursor-pointer hover:file:bg-amber-800"
                        required
                      />
                      {uploadingSlip && (
                        <p className="text-[10px] font-bold text-amber-700 animate-pulse">Uploading screenshot to server...</p>
                      )}
                      {paymentSlipUrl && (
                        <p className="text-[10px] font-bold text-emerald-700">✓ Receipt screenshot linked successfully!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={checkoutLoading || uploadingSlip}
                  className="w-full py-4 rounded-2xl gold-btn font-extrabold text-xs shadow-md disabled:bg-stone-300"
                >
                  {checkoutLoading
                    ? "Processing Scent Package..."
                    : paymentMethod === "COD"
                    ? `Place Cash on Delivery Order (Rs. ${finalTotal.toLocaleString()})`
                    : `Confirm Paid Order (Rs. ${finalTotal.toLocaleString()})`}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Order items and calculations */}
          <div className="lg:col-span-5 space-y-6">
            {/* Items Summary list */}
            <div className="glass-panel p-6 rounded-3xl border border-white/50 space-y-4">
              <h3 className="font-bold text-stone-800 text-sm border-b pb-2">Bag Summary</h3>

              <div className="divide-y divide-stone-200/40 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-3 flex gap-3 items-center">
                    {item.product.imageUrl && item.product.imageUrl.startsWith("linear-gradient") ? (
                      <div
                        className="w-12 h-12 rounded-lg border shrink-0"
                        style={{ background: item.product.imageUrl }}
                      />
                    ) : (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg border shrink-0 object-contain bg-white"
                      />
                    )}
                    <div className="flex-grow min-w-0 text-xs">
                      <h4 className="font-bold text-stone-800 truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-stone-400">
                        {item.product.volume} • Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-stone-800 shrink-0">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon inputs */}
              <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-stone-200/30 space-y-2">
                <label className="text-[9px] font-extrabold text-stone-500 uppercase tracking-widest block flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5 text-amber-600" /> Have a Coupon?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon e.g. NAEEMI10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-stone-800 text-white font-bold text-xs hover:bg-stone-700 transition-colors"
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

              {/* Sum calculations */}
              <div className="pt-3 border-t border-stone-200/30 space-y-2 text-xs text-stone-600 font-semibold">
                <div className="flex justify-between items-center">
                  <span>Cart Items Value</span>
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

                <div className="border-t border-stone-200/50 pt-2 flex justify-between items-center text-stone-800 font-black">
                  <span className="text-sm">Final Amount</span>
                  <span className="text-base text-amber-800 font-serif">Rs. {finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
