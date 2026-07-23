"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Heart } from "lucide-react";

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
          {/* Custom SVG Social Media Icons */}
          <div className="flex items-center gap-4 pt-2">
            <a href="https://www.facebook.com/NaeemiFragrance" target="_blank" rel="noreferrer" className="text-stone-400 hover:text-[#1877F2] transition-colors" title="Facebook">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/naeemi__fragrance" target="_blank" rel="noreferrer" className="text-stone-400 hover:text-[#E1306C] transition-colors" title="Instagram">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051c-.059 1.28-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@naeemi1998" target="_blank" rel="noreferrer" className="text-stone-400 hover:text-[#000000] transition-colors" title="TikTok">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.54-4.06-1.44-.6-.46-1.12-1.03-1.54-1.69v8.32c.07 1.94-.48 3.97-1.74 5.43-1.39 1.61-3.62 2.51-5.76 2.37-2.67-.14-5.26-1.92-6.09-4.52-.9-2.73-.24-6 1.77-7.88 1.5-1.43 3.66-2.02 5.67-1.57v4.1c-1.07-.38-2.34-.1-3.15.73-.82.82-1.05 2.19-.53 3.2.53 1.05 1.74 1.73 2.92 1.63 1.08-.06 2.05-.85 2.25-1.93.07-.36.07-.72.07-1.09V0h.01z"/>
              </svg>
            </a>
          </div>
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
            <Link href="/shipping-policy" className="hover:text-amber-600 transition-colors">Shipping & Delivery Policy</Link>
            <Link href="/returns-exchange" className="hover:text-amber-600 transition-colors">Return & Exchange</Link>
            <Link href="/faq" className="hover:text-amber-600 transition-colors">Frequently ask questions</Link>
            <Link href="/privacy-policy" className="hover:text-amber-600 transition-colors">Terms & Privacy Policy</Link>
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
          <div className="flex items-center gap-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            <span>Official Scent Boutique</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
