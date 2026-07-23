"use client";

import React from "react";
import { Truck, ShieldCheck, Clock, MapPin, Sparkles } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-stone-850 animate-fadeIn mt-4">
      {/* Header */}
      <section className="text-center space-y-3 pb-4 border-b border-stone-200/40">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] font-extrabold tracking-widest uppercase">
          <Truck className="w-3.5 h-3.5 text-amber-600" />
          Logistics Details
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight font-serif text-stone-800">
          Shipping & <span className="gold-gradient-text">Delivery Policy</span>
        </h1>
        <p className="text-xs md:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
          How we dispatch, secure, and deliver your luxury fragrances nationwide.
        </p>
      </section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-4">
        {/* Left Side: Summary Badges */}
        <div className="md:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-[28px] border border-white/50 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">Estimated Time</p>
                <p className="text-xs font-bold text-stone-800">2 - 4 Working Days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">Service Guarantee</p>
                <p className="text-xs font-bold text-stone-800">Cash on Delivery (COD)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">Delivery Coverage</p>
                <p className="text-xs font-bold text-stone-800">All Cities in Pakistan</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-[28px] text-[11px] text-stone-500 leading-relaxed text-center italic">
            "Every package is carefully wrapped in premium secure packaging to prevent leaks."
          </div>
        </div>

        {/* Right Side: Detailed Copy */}
        <div className="md:col-span-8 space-y-6 text-xs text-stone-600 leading-relaxed">
          <div className="glass-panel p-6 rounded-[32px] border border-white/50 space-y-4">
            <h3 className="text-sm font-extrabold text-stone-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Nationwide Delivery Rates
            </h3>
            <p>
              Naeemi Fragrance offers fast and reliable shipping across Pakistan. We use top courier services (TCS, Leopard, Call Courier) to ensure your orders reach you safely.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Free Shipping:</strong> On all orders above Rs. 6,000.</li>
              <li><strong>Standard Delivery Fee:</strong> Rs. 250 fee applies for orders below Rs. 6,000.</li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-[32px] border border-white/50 space-y-4">
            <h3 className="text-sm font-extrabold text-stone-800">Order Dispatch Timings</h3>
            <p>
              Orders placed before 2:00 PM are processed and dispatched on the same working day. Orders placed on Sundays or public holidays are dispatched on the next working business day.
            </p>
            <p>
              Once your order is shipped, you will receive a tracking link via SMS or WhatsApp to track your parcel in real-time.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-[32px] border border-white/50 space-y-4">
            <h3 className="text-sm font-extrabold text-stone-800">Important Delivery Notes</h3>
            <p>
              Please ensure your shipping address and contact number are accurate during checkout to prevent delivery delays. The courier rider will call you prior to delivery. If you are unavailable, the courier will make up to two more delivery attempts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
