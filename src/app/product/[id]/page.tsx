"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAdmin, Perfume } from "@/context/AdminContext";
import { useCart } from "@/context/CartContext";
import { NoteExplorer } from "@/components/NoteExplorer";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  Star, 
  Sparkles, 
  AlertCircle, 
  ShoppingCart, 
  Hourglass, 
  Wind, 
  Calendar 
} from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products } = useAdmin();
  const { addToCart, toggleWishlist, isInWishlist, setIsCartOpen } = useCart();

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

  const handleBuyNow = () => {
    if (quantity > product.stock) return;
    // Add to cart and immediately route to checkout page
    addToCart(product, quantity);
    setIsCartOpen(false); // Close drawer overlay
    router.push("/checkout");
  };

  // Luxury characteristics mock values based on product ID
  const sillageValue = parseInt(product.id) % 2 === 0 ? "Strong (Intense Projection)" : "Heavy (Enveloping Sillage)";
  const longevityValue = parseInt(product.id) % 2 === 0 ? "10 - 12 Hours" : "12+ Hours (Extremely Long Lasting)";
  const seasonalPreference = parseInt(product.id) % 3 === 0 ? "Fall / Winter / Evening" : "All-Season Signature Scent";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Breadcrumb row */}
      <div className="flex justify-between items-center px-1">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-700 text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Link>
        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
          Scent ID: #{product.id}0{product.stock}
        </span>
      </div>

      {/* Main product view grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Large Luxury Image Card & metrics */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="relative aspect-square rounded-[40px] overflow-hidden border border-white/60 shadow-xl flex items-center justify-center p-8 bg-white/40 backdrop-blur-md">
            {/* Colorful Luxury Pattern Background */}
            <div className="absolute inset-2 rounded-[32px] overflow-hidden">
              <div className="absolute inset-0" style={{ background: product.imageUrl }} />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/30" />
            </div>

            {/* Favorite Wishlist Icon Overlay */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-6 right-6 p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-stone-100 text-stone-600 hover:text-rose-500 transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <Heart className={`w-5 h-5 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>

            {/* Large Decorative Initial */}
            <div className="relative font-serif font-extrabold text-white/10 text-9xl tracking-wider select-none pointer-events-none">
              {product.name[0]}
            </div>

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-rose-500 text-white font-extrabold text-sm uppercase tracking-wider px-5 py-2.5 rounded-2xl shadow-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Sillage & longevity meters */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 border border-white/50">
            <h4 className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Fragrance Metrics</h4>
            
            <div className="space-y-3.5">
              {/* Longevity */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-700 flex items-center gap-1.5">
                    <Hourglass className="w-3.5 h-3.5 text-amber-600" /> Longevity
                  </span>
                  <span className="font-semibold text-stone-500">{longevityValue}</span>
                </div>
                <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-stone-100">
                  <div className="bg-amber-500 h-full w-[95%] rounded-full" />
                </div>
              </div>

              {/* Sillage */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-700 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-amber-600" /> Sillage / Projection
                  </span>
                  <span className="font-semibold text-stone-500">{sillageValue}</span>
                </div>
                <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-stone-100">
                  <div className="bg-amber-500 h-full w-[90%] rounded-full" />
                </div>
              </div>

              {/* Season */}
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-stone-200/40">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" /> Best Season
                </span>
                <span className="font-semibold text-amber-800 bg-amber-50/80 border border-amber-100/50 px-2 py-0.5 rounded-lg">
                  {seasonalPreference}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Detailed Specs, Actions, Note Pyramids */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Tagline & concentration tags */}
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/10 text-amber-900 border border-amber-500/20 text-[9px] font-bold tracking-widest px-3.5 py-1.5 rounded-full uppercase">
                {product.category} Accord
              </span>
              <span className="bg-white/80 border border-stone-200 text-stone-600 text-[9px] font-bold tracking-widest px-3.5 py-1.5 rounded-full uppercase shadow-xs">
                {product.type}
              </span>
            </div>

            {/* Perfume Title */}
            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-black text-stone-800 font-serif leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-amber-700 font-serif italic font-medium tracking-wide">
                "Naeemi Naam Hai Mohabbat Ka"
              </p>
            </div>

            {/* Ratings & Price */}
            <div className="flex items-center gap-6 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {(product.rating && typeof product.rating === 'number') ? product.rating.toFixed(1) : '5.0'} / 5.0 rating
              </div>
              <span className="text-3xl font-black text-stone-800 tracking-tight">
                Rs. {product.price.toLocaleString()}
              </span>
            </div>

            {/* Product description block */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">Description</h4>
              <p className="text-stone-600 text-xs md:text-sm leading-relaxed bg-white/40 border border-white/60 p-5 rounded-3xl">
                {product.description}
              </p>
            </div>

            {/* Stock Alerts */}
            <div className="flex items-center gap-2 text-xs">
              {isOutOfStock ? (
                <span className="flex items-center gap-1.5 text-rose-600 font-bold bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
                  <AlertCircle className="w-4 h-4 animate-pulse" /> Out of stock - Restocking soon
                </span>
              ) : hasLowStock ? (
                <span className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                  <AlertCircle className="w-4 h-4 animate-bounce" /> Running Low: Only {product.stock} units left
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-100">
                  ✓ Premium Stock Available ({product.stock} bottles)
                </span>
              )}
            </div>

            {/* Add to Cart & Buy Now panel */}
            {!isOutOfStock && (
              <div className="bg-white/40 border border-white/60 p-5 rounded-[28px] space-y-4 shadow-sm">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  {/* Quantity selector */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-extrabold text-stone-400 uppercase block tracking-widest">Quantity</label>
                    <div className="flex items-center border border-stone-200 rounded-xl bg-white shadow-xs">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-stone-50 text-stone-500 rounded-l-xl transition-all font-semibold"
                      >
                        -
                      </button>
                      <span className="px-4 text-xs font-bold text-stone-700 min-w-[28px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-4 py-2 hover:bg-stone-50 text-stone-500 rounded-r-xl transition-all font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-extrabold text-stone-400 block uppercase tracking-widest">Subtotal</span>
                    <span className="font-extrabold text-stone-800 text-lg">
                      Rs. {(product.price * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={quantity > product.stock}
                    className="flex-1 py-3.5 rounded-2xl border border-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/60 transition-all cursor-pointer disabled:bg-stone-100 disabled:text-stone-400"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Bag
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={quantity > product.stock}
                    className="flex-1 py-3.5 rounded-2xl gold-btn text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md disabled:bg-stone-300 disabled:shadow-none"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Buy It Now (Secure)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Explorer segment */}
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
