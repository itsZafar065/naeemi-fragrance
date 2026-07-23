"use client";

import React from "react";
import { RefreshCw, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function ReturnsExchangePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-stone-850 animate-fadeIn mt-4">
      {/* Header */}
      <section className="text-center space-y-3 pb-4 border-b border-stone-200/40">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] font-extrabold tracking-widest uppercase">
          <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
          Hassle-Free Returns
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight font-serif text-stone-800">
          Returns & <span className="gold-gradient-text">Exchange Policy</span>
        </h1>
        <p className="text-xs md:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
          Our 7-Day Guarantee — because your absolute satisfaction is our top priority.
        </p>
      </section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-4">
        {/* Left Side: Summary Badges */}
        <div className="md:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-[28px] border border-white/50 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">Guarantee Window</p>
                <p className="text-xs font-bold text-stone-800">7 Days Return</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">Exchange Type</p>
                <p className="text-xs font-bold text-stone-800">Refund / Scent Exchange</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
                <Heart className="w-4 h-4 fill-amber-600/30" />
              </div>
              <div>
                <p className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">Customer Care</p>
                <p className="text-xs font-bold text-stone-800">WhatsApp 03092184760</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-[28px] text-[11px] text-stone-500 leading-relaxed text-center italic">
            "Your feedback helps us continuously perfect our signature scent projection formulas."
          </div>
        </div>

        {/* Right Side: Detailed Copy */}
        <div className="md:col-span-8 space-y-6 text-xs text-stone-600 leading-relaxed">
          <div className="glass-panel p-6 rounded-[32px] border border-white/50 space-y-4">
            <h3 className="text-sm font-extrabold text-stone-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Our Satisfaction Guarantee
            </h3>
            <p>
              True to our motto, <em>"Naeemi Naam Hai Mohabbat Ka"</em>, we stand behind the outstanding quality of our fragrances. If you are not satisfied with the scent profile, longevity, or received a damaged parcel, you can return or exchange the product within <strong>7 days</strong> of delivery.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-[32px] border border-white/50 space-y-4">
            <h3 className="text-sm font-extrabold text-stone-800">Eligibility Criteria</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>The return/exchange request must be initiated within 7 days of receiving the order.</li>
              <li>The perfume bottle must be undamaged and in its original premium box container.</li>
              <li>For changes of mind, the scent must not be excessively consumed (testing sprays are perfectly fine).</li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-[32px] border border-white/50 space-y-4">
            <h3 className="text-sm font-extrabold text-stone-800">How to Initiate a Request</h3>
            <p>
              Simply contact our customer support desk on WhatsApp at <strong>03092184760</strong> or email us at <strong>naeemifragrance@gmail.com</strong>.
            </p>
            <p>
              Provide your Order ID, contact details, and a brief description of the issue. Our support team will guide you on how to return the package. Refunds are processed via JazzCash, EasyPaisa, or Bank Transfer within 3 working days once the package is returned back to our warehouse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
