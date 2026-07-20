"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { ShoppingBag, User, Search, Shield, X, Heart } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { setIsCartOpen, cartCount, wishlist } = useCart();
  const [showSearchAlert, setShowSearchAlert] = useState(false);
  const [showAccountAlert, setShowAccountAlert] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-nav hidden md:block border-b border-stone-200/30">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex flex-col items-start select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h1 className="font-extrabold text-2xl tracking-wide font-serif text-stone-800">
              NAEEMI FRAGRANCE
            </h1>
          </div>
          <span className="text-[10px] tracking-[0.2em] font-medium text-amber-600/80 -mt-0.5 ml-4 uppercase">
            Naeemi Naam Hai Mohabbat Ka
          </span>
        </Link>

        {/* Desktop Links (Simple & Clean: Home, Shop, About, Contact) */}
        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              isActive("/") ? "text-amber-600" : "text-stone-600 hover:text-amber-500"
            }`}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              isActive("/shop") ? "text-amber-600" : "text-stone-600 hover:text-amber-500"
            }`}
          >
            Shop
          </Link>
          <Link
            href="/#about"
            className="text-sm font-semibold tracking-wide text-stone-600 hover:text-amber-500 transition-colors"
          >
            About
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-semibold tracking-wide text-stone-600 hover:text-amber-500 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Quick Action Icons: Search, Account, Cart + Admin Link */}
        <div className="flex items-center gap-4">
          {/* Quick Admin Dashboard Link */}
          <Link
            href="/admin"
            className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200/50 bg-stone-50/50 text-stone-600 transition-all hover:bg-stone-50 hover:text-amber-600 hover:border-amber-500/20"
            title="Admin Dashboard"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>

          {/* Search Trigger */}
          <button
            onClick={() => setShowSearchAlert(true)}
            className="p-2 rounded-full hover:bg-stone-100/50 text-stone-600 transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Account Trigger */}
          <button
            onClick={() => setShowAccountAlert(true)}
            className="p-2 rounded-full hover:bg-stone-100/50 text-stone-600 transition-colors"
            title="My Account"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Cart Icon Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 rounded-full hover:bg-stone-100/50 text-stone-600 transition-colors relative"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-amber-600 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#faf7f2]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mock Search Alert Banner */}
      {showSearchAlert && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2.5 px-6 flex justify-between items-center text-xs text-amber-900 font-semibold animate-fadeIn">
          <span>💡 Tip: You can search or filter fragrances directly in the <Link href="/shop" className="underline hover:text-amber-700">Shop Catalog page</Link>!</span>
          <button onClick={() => setShowSearchAlert(false)} className="text-amber-700 hover:text-amber-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mock Account Alert Box */}
      {showAccountAlert && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2.5 px-6 flex justify-between items-center text-xs text-amber-900 font-semibold animate-fadeIn">
          <span>👤 Naeemi Profile: Salman Khan (Premium Customer)</span>
          <button onClick={() => setShowAccountAlert(false)} className="text-amber-700 hover:text-amber-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
