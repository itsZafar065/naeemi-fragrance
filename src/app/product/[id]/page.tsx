"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAdmin, Perfume } from "@/context/AdminContext";
import { useCart } from "@/context/CartContext";
import { NoteExplorer } from "@/components/NoteExplorer";
import { ArrowLeft, ShoppingBag, Heart, Star, Sparkles, AlertCircle, ShoppingCart } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products } = useAdmin();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState<Perfume | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const found = products.find((p) => p.id === id);
      if (found) {
        setProduct(found);
      }
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-stone-500 font-medium">Seeking fragrance details...</p>
        <button
          onClick={() => router.push("/shop")}
          className="px-6 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const isFav = isInWishlist(product.id);
  const hasLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (quantity > product.stock) return;
    addToCart(product, quantity);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Back Button */}
      <div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-700 text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>
      </div>

      {/* Main product view grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Photo Visualizer */}
        <div className="md:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-[36px] overflow-hidden border border-white/50 shadow-lg flex items-center justify-center">
            {/* Colorful Luxury Pattern Background */}
            <div className="absolute inset-0" style={{ background: product.imageUrl }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/35" />

            {/* Float Icon or Initial */}
            <div className="relative font-serif font-extrabold text-white/10 text-9xl tracking-wider select-none pointer-events-none">
              {product.name[0]}
            </div>

            {/* Favorite Wishlist Icon Overlay */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/80 backdrop-blur-md border border-stone-100 text-stone-600 hover:text-rose-500 transition-colors shadow-md"
            >
              <Heart className={`w-5 h-5 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-rose-500 text-white font-extrabold text-sm uppercase tracking-wider px-5 py-2.5 rounded-2xl shadow-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Details Accords badge */}
          <div className="flex gap-2">
            <span className="bg-stone-100/60 border border-stone-200/40 text-stone-600 text-[10px] font-bold tracking-widest px-3.5 py-1.5 rounded-full uppercase flex-1 text-center">
              Volume: {product.volume}
            </span>
            <span className="bg-stone-100/60 border border-stone-200/40 text-stone-600 text-[10px] font-bold tracking-widest px-3.5 py-1.5 rounded-full uppercase flex-1 text-center">
              {product.type.split(" ")[0]} Edition
            </span>
          </div>
        </div>

        {/* Right Side: Perfume Core Details */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            {/* Category tag & concentration badge */}
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/10 text-amber-900 border border-amber-500/20 text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
                {product.category} Accord
              </span>
              <span className="bg-stone-100 text-stone-600 text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
                {product.type}
              </span>
            </div>

            {/* Perfume Name */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-800 font-serif leading-tight">
              {product.name}
            </h1>

            {/* Slogan details */}
            <p className="text-xs text-amber-700/80 font-serif italic">
              "Naeemi Naam Hai Mohabbat Ka"
            </p>

            {/* Ratings & Price */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {product.rating.toFixed(1)} / 5.0 Rating
              </div>
              <span className="text-2xl font-black text-stone-800">
                Rs. {product.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Scent Essence</h3>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed bg-white/40 border border-white/60 p-4 rounded-2xl">
              {product.description}
            </p>
          </div>

          {/* Inventory warning or info */}
          <div className="flex items-center gap-2 text-xs">
            {isOutOfStock ? (
              <span className="flex items-center gap-1 text-rose-600 font-bold">
                <AlertCircle className="w-4 h-4" /> Out of stock - Re-stocking soon
              </span>
            ) : hasLowStock ? (
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <AlertCircle className="w-4 h-4" /> Running Low: Only {product.stock} items left
              </span>
            ) : (
              <span className="text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                ✓ Premium Stock Available ({product.stock} units)
              </span>
            )}
          </div>

          {/* Add-to-cart operations panel */}
          {!isOutOfStock && (
            <div className="flex flex-wrap gap-4 items-center bg-white/50 border border-white/60 p-4 rounded-3xl">
              {/* Quantity Counter */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-stone-400 uppercase block">Quantity</label>
                <div className="flex items-center border border-stone-200 rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 hover:bg-stone-50 text-stone-500 rounded-l-xl transition-all"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-700 min-w-[24px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3.5 py-2 hover:bg-stone-50 text-stone-500 rounded-r-xl transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Box button */}
              <button
                onClick={handleAddToCart}
                disabled={quantity > product.stock}
                className="flex-1 self-end py-3 rounded-2xl gold-btn text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:bg-stone-300 disabled:shadow-none"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Fragrance Box
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fragrance pyramid note explorer details */}
      <section className="pt-4">
        <NoteExplorer
          topNotes={product.topNotes}
          heartNotes={product.heartNotes}
          baseNotes={product.baseNotes}
        />
      </section>
    </div>
  );
}
