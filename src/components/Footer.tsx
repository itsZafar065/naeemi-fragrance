"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Heart, ShieldAlert } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="hidden md:block w-full glass-panel mt-16 border-t border-white/50 rounded-t-[36px] overflow-hidden">
      <div className="hidden md:grid max-w-7xl mx-auto px-6 py-12 grid-cols-1 md:grid-cols-12 gap-8 text-stone-700">
        {/* Column 1: Brand Info */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#faf7f2] border border-amber-500/30 flex items-center justify-center p-0.5 shadow-sm shrink-0">
              <img src="/logo.svg" className="w-full h-full object-cover" alt="Brand Logo" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-lg tracking-wide font-serif text-stone-800 leading-none">
                NAEEMI FRAGRANCE
              </h3>
              <p className="text-[9px] tracking-[0.15em] font-bold text-amber-600 uppercase leading-none mt-1">
                Naeemi Naam Hai Mohabbat Ka
              </p>
            </div>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed max-w-sm pt-1">
            Handcrafted with love and imported essential oils, creating exquisite perfumes with incredible longevity and sillage.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-bold text-xs text-stone-800 uppercase tracking-widest">Navigation</h4>
          <div className="flex flex-col gap-2 text-xs">
            <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-amber-600 transition-colors">Shop</Link>
            <Link href="/about" className="hover:text-amber-600 transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-amber-600 transition-colors">Contact</Link>
          </div>
        </div>

        {/* Column 3: Customer Care */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-bold text-xs text-stone-800 uppercase tracking-widest">Customer Support</h4>
          <div className="flex flex-col gap-2 text-xs">
            <span className="text-stone-500">Secure COD Delivery</span>
            <span className="text-stone-500">Return Policy (7 Days)</span>
            <span className="text-stone-500">Sillage Guarantee</span>
          </div>
        </div>

        {/* Column 4: Contact Details */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-bold text-xs text-stone-800 uppercase tracking-widest">Naeemi Head Office</h4>
          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-stone-600">
              <Phone className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-semibold text-stone-800">03092184760</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <Mail className="w-4 h-4 text-amber-600 shrink-0" />
              <span>naeemifragrance@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Bin Qasim Town Karachi Pakistan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright bar */}
      <div className="border-t border-stone-200/50 bg-white/20 px-6 py-5 text-center text-xs text-stone-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-1">
          <span>© {new Date().getFullYear()} Naeemi Fragrance. Made with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>in Pakistan.</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-[10px] font-bold text-stone-400">
            <span className="hover:text-amber-600 cursor-pointer">FACEBOOK</span>
            <span className="hover:text-amber-600 cursor-pointer">INSTAGRAM</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
