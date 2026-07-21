"use client";

import React from "react";
import Link from "next/link";
import { Perfume } from "../context/AdminContext";
import { useCart } from "../context/CartContext";
import { Heart, ShoppingCart, Sparkles, Star } from "lucide-react";

interface FragranceCardProps {
  product: Perfume;
}

const getFriendlyType = (type: string) => {
  if (type === "Extrait de Parfum") return "Pure Perfume Extract";
  if (type === "Eau de Parfum (EDP)") return "Eau de Parfum";
  if (type === "Eau de Toilette (EDT)") return "Eau de Toilette";
  return type;
};

export const FragranceCard: React.FC<FragranceCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isFav = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block relative rounded-3xl glass-panel glass-panel-hover overflow-hidden p-4"
    >
      {/* Visual Image Container */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 border border-white/20 shadow-inner flex items-center justify-center bg-stone-50">
        {/* Colorful Abstract Perfume Backdrop */}
        {product.imageUrl && product.imageUrl.startsWith("linear-gradient") ? (
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
            style={{ background: product.imageUrl }}
          />
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="relative z-10 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        )}

        {/* Gloss Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/30" />

        {/* Floating Tag */}
        <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-md text-[9px] font-bold text-amber-800 tracking-widest px-2.5 py-1 rounded-full uppercase shadow-sm border border-white/40 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
          {product.category}
        </span>

        {/* Favorite Heart Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/70 backdrop-blur-md border border-white/40 text-stone-600 hover:text-rose-500 hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-sm"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Large Decorative Icon or Initial */}
        <div className="absolute font-serif font-extrabold text-white/10 text-6xl tracking-wider select-none pointer-events-none z-0">
          N
        </div>

        {/* Out of Stock Banner */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-rose-500 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-stone-500 tracking-wider">
            {getFriendlyType(product.type)}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
            {typeof product.rating === 'number' ? product.rating.toFixed(1) : '5.0'}
          </div>
        </div>

        <h3 className="font-bold text-stone-800 text-base group-hover:text-amber-700 transition-colors line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-[10px] text-stone-400 font-medium">{product.volume}</span>
            <span className="font-extrabold text-stone-800 text-base">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>

          {/* Quick Add Button */}
          {product.stock > 0 && (
            <button
              onClick={handleAddToCartClick}
              className="p-2.5 rounded-2xl gold-btn text-white transition-all hover:scale-105 active:scale-95 shadow-md flex items-center justify-center"
              title="Add to Box"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};
