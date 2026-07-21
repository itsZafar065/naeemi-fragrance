"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { ShoppingBag, User, Search, Shield, X, Heart } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsCartOpen, cartCount } = useCart();
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => pathname === path;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?query=${encodeURIComponent(searchQuery.trim())}`);
    setShowSearchInput(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-stone-200/30">
      {/* 1. DESKTOP NAVIGATION BAR */}
      <div className="hidden md:flex max-w-7xl mx-auto px-6 h-20 items-center justify-between">
        {/* Brand Logo - Always visible on desktop */}
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

        {/* Desktop Links */}
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

        {/* Desktop Quick Action Icons */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200/50 bg-stone-50/50 text-stone-600 transition-all hover:bg-stone-50 hover:text-amber-600 hover:border-amber-500/20"
            title="Admin Dashboard"
          >
            <Shield className="w-3.5 h-3.5" />
            Admin
          </Link>

          {showSearchInput && (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-48 animate-fadeIn">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                autoFocus
              />
              <button type="button" onClick={() => setShowSearchInput(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </form>
          )}

          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="p-2 rounded-full hover:bg-stone-100/50 text-stone-600 transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/more"
            className="p-2 rounded-full hover:bg-stone-100/50 text-stone-600 transition-colors block"
            title="My Account"
          >
            <User className="w-5 h-5" />
          </Link>

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

      {/* 2. MOBILE SCENT HEADER */}
      <div className="flex md:hidden h-14 px-4 items-center justify-between max-w-md mx-auto">
        {!showSearchInput ? (
          <Link href="/" className="flex items-center gap-1.5 select-none">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-extrabold text-sm font-serif tracking-widest text-stone-800">
              NAEEMI
            </span>
          </Link>
        ) : (
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 animate-fadeIn pr-2">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1 bg-white border border-amber-500/30 rounded-xl text-[11px] focus:outline-none"
              autoFocus
            />
            <button type="button" onClick={() => setShowSearchInput(false)} className="text-stone-400 hover:text-stone-600">
              <X className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Mobile action shortcuts */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="p-1.5 text-stone-650 hover:text-amber-600"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            href="/more"
            className="p-1.5 text-stone-650 hover:text-amber-600"
            title="My Account"
          >
            <User className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="p-1.5 text-stone-650 hover:text-amber-600 relative"
            title="Cart"
          >
            <ShoppingBag className="w-5.5 h-5.5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-amber-600 text-white text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
