"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { FragranceCard } from "@/components/FragranceCard";
import { Heart, Compass, Star } from "lucide-react";

export default function WishlistPage() {
  const { wishlist } = useCart();
  const { products } = useAdmin();

  // Find bookmarked products
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="space-y-6">
      <div className="space-y-1 px-2">
        <h1 className="text-2xl font-black text-stone-800 tracking-tight flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
          Saved Wishlist
        </h1>
        <p className="text-xs text-stone-500">Your personalized chest of desired accords</p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 p-6 rounded-3xl bg-white/40 border border-stone-200/50 space-y-5">
          <div className="w-16 h-16 rounded-full bg-rose-50 mx-auto flex items-center justify-center text-rose-400 border border-rose-100">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-stone-800 text-base">Your Wishlist is Empty</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Save your favorite notes by clicking the heart button on perfume cards while exploring.
            </p>
          </div>
          <p className="text-[10px] text-stone-400 italic">"Naeemi Naam Hai Mohabbat Ka"</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gold-btn text-white font-semibold text-xs transition-all shadow-md"
          >
            <Compass className="w-4 h-4" />
            Discover Fragrances
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedProducts.map((product) => (
            <FragranceCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
