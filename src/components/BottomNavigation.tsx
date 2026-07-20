"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { Home, Compass, ShoppingBag, Heart, Shield } from "lucide-react";

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const { setIsCartOpen, cartCount, wishlist } = useCart();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden p-4 bg-transparent pointer-events-none">
      <div className="glass-bottom-nav mx-auto max-w-md pointer-events-auto rounded-3xl py-2 px-3 flex items-center justify-around shadow-lg border border-white/50">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-300 ${
            isActive("/") ? "text-amber-600 scale-105" : "text-stone-500 hover:text-amber-500"
          }`}
        >
          <Home className="w-5.5 h-5.5" />
          <span className="text-[9px] font-medium mt-0.5">Home</span>
        </Link>

        {/* Shop */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-300 ${
            isActive("/shop") ? "text-amber-600 scale-105" : "text-stone-500 hover:text-amber-500"
          }`}
        >
          <Compass className="w-5.5 h-5.5" />
          <span className="text-[9px] font-medium mt-0.5">Explore</span>
        </Link>

        {/* Cart Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl text-stone-500 hover:text-amber-500 relative transition-all"
        >
          <div className="relative">
            <ShoppingBag className="w-5.5 h-5.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-600 text-white text-[8px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-medium mt-0.5">Bag</span>
        </button>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-300 ${
            isActive("/wishlist") ? "text-amber-600 scale-105" : "text-stone-500 hover:text-amber-500"
          }`}
        >
          <div className="relative">
            <Heart className={`w-5.5 h-5.5 ${wishlist.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-rose-500" />
            )}
          </div>
          <span className="text-[9px] font-medium mt-0.5">Favs</span>
        </Link>

        {/* Admin */}
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-300 ${
            isActive("/admin") ? "text-amber-600 scale-105" : "text-stone-500 hover:text-amber-500"
          }`}
        >
          <Shield className="w-5.5 h-5.5" />
          <span className="text-[9px] font-medium mt-0.5">Admin</span>
        </Link>
      </div>
    </div>
  );
};
