"use client";

import React, { useState } from "react";
import { 
  HelpCircle, 
  FileText, 
  Truck, 
  RefreshCw, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  Heart,
  Sparkles
} from "lucide-react";

export default function MoreMenuPage() {
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const togglePolicy = (policy: string) => {
    setActivePolicy(activePolicy === policy ? null : policy);
  };

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto animate-fadeIn text-stone-850 px-4 md:px-0 mt-4">
      {/* Page Header */}
      <div className="text-center space-y-1">
        <h2 className="font-extrabold text-stone-850 text-base uppercase tracking-wider">Help & Information</h2>
        <p className="text-[11px] text-stone-450">Read our store policies, frequently asked questions, and get support.</p>
      </div>

      {/* 1. PERSISTENT INFORMATION ACCORDION MENU */}
      <div className="glass-panel rounded-[28px] overflow-hidden border border-white/50 divide-y divide-stone-200/40 text-xs">
        
        {/* About Us entry */}
        <div className="p-4 space-y-2">
          <button 
            onClick={() => togglePolicy("about")}
            className="w-full flex items-center justify-between text-stone-705 font-bold text-left"
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
            className="w-full flex items-center justify-between text-stone-705 font-bold text-left"
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
            className="w-full flex items-center justify-between text-stone-705 font-bold text-left"
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
            className="w-full flex items-center justify-between text-stone-705 font-bold text-left"
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
            className="w-full flex items-center justify-between text-stone-705 font-bold text-left"
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

      {/* 2. Support Contacts */}
      <div className="glass-panel p-5 rounded-[28px] border border-white/50 space-y-3.5 text-xs text-stone-700">
        <h4 className="font-bold text-[10px] uppercase tracking-widest text-stone-400">Naeemi Customer Support</h4>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-amber-600" />
            <span className="font-semibold">03092184760</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-amber-600" />
            <span>naeemifragrance@gmail.com</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Bin Qasim Town Karachi Pakistan</span>
          </div>
        </div>
      </div>

      {/* 3. Social Links & Copyright */}
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
