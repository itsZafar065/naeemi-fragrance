"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAdmin, Perfume } from "@/context/AdminContext";
import { useCart } from "@/context/CartContext";
import { NoteExplorer } from "@/components/NoteExplorer";
import { FragranceCard } from "@/components/FragranceCard";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  Star, 
  AlertCircle, 
  ShoppingCart, 
  Hourglass, 
  Wind, 
  Calendar 
} from "lucide-react";

const getFriendlyType = (type: string) => {
  if (type === "Extrait de Parfum") return "Pure Perfume Extract";
  if (type === "Eau de Parfum (EDP)") return "Eau de Parfum";
  if (type === "Eau de Toilette (EDT)") return "Eau de Toilette";
  return type;
};

const getMockReviews = (prodName: string, category: string) => {
  if (prodName === "Shams Un Naeemi") {
    return [
      { name: "Bilal Ahmad", date: "June 14, 2026", rating: 5, text: "Excellent projection! The saffron and vanilla notes blend beautifully. I got multiple compliments on the sillage. Highly recommended." },
      { name: "Hina K.", date: "May 29, 2026", rating: 4, text: "Perfect evening fragrance. Renders an inviting, warm amber glow. Packaging was absolutely premium." }
    ];
  }
  if (prodName === "Oud Un Naeemi") {
    return [
      { name: "Hamza Malik", date: "July 02, 2026", rating: 5, text: "A masterpiece for true Oud lovers. The Cambodian Oud is rich, smooth, and has a majestic velvet rose drydown. Lasts all day." },
      { name: "Aisha Khan", date: "June 18, 2026", rating: 5, text: "Truly lives up to 'Naam Hai Mohabbat Ka'. Elegant bottle, intense concentration, and smells very expensive." }
    ];
  }
  if (prodName === "Qaswa") {
    return [
      { name: "Tariq Mahmood", date: "July 10, 2026", rating: 5, text: "An incredible leather fragrance. The cardamom note adds a spicy edge that sits very well on the skin. Long projection." },
      { name: "Zeeshan J.", date: "June 25, 2026", rating: 4, text: "Strong, masculine, and sophisticated. The smoky cedarwood base note is top-notch." }
    ];
  }
  return [
    { name: "Kamran Shah", date: "July 12, 2026", rating: 5, text: `One of the best ${category} fragrances I have ever used. Very balanced, clean sillage, and beautiful presentation.` },
    { name: "Sania M.", date: "June 30, 2026", rating: 5, text: "Extremely long-lasting scent. Smells very natural and premium. Naeemi Fragrance has become my favorite brand!" }
  ];
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products } = useAdmin();
  const { addToCart, toggleWishlist, isInWishlist, setIsCartOpen } = useCart();

  const [product, setProduct] = useState<Perfume | null>(null);
  const [selectedSize, setSelectedSize] = useState("100ml");
  const [quantity, setQuantity] = useState(1);

  // Sync selected product
  useEffect(() => {
    if (id) {
      const found = products.find((p) => p.id === id);
      if (found) {
        setProduct(found);
        setSelectedSize(found.volume || "100ml");
      }
    }
  }, [id, products]);

  // Client-side SEO update
  useEffect(() => {
    if (product) {
      document.title = `${product.name} (${selectedSize}) - Naeemi Fragrance`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', `${product.description} Scent category: ${product.category}. Available in 50ml and 100ml at Naeemi Fragrance.`);
    }
  }, [product, selectedSize]);

  if (!product) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-stone-500 font-medium">Loading perfume details...</p>
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

  // Dynamic price calculation based on size variant
  let calculatedPrice = product.price;
  if (product.volume === "100ml" && selectedSize === "50ml") {
    calculatedPrice = Math.round(product.price * 0.7);
  } else if (product.volume === "50ml" && selectedSize === "100ml") {
    calculatedPrice = Math.round(product.price * 1.45);
  }

  const handleAddToCart = () => {
    if (quantity > product.stock) return;
    const variantItem = {
      ...product,
      id: `${product.id}-${selectedSize}`,
      name: `${product.name} (${selectedSize})`,
      price: calculatedPrice,
      volume: selectedSize
    };
    addToCart(variantItem, quantity);
  };

  const handleBuyNow = () => {
    if (quantity > product.stock) return;
    const variantItem = {
      ...product,
      id: `${product.id}-${selectedSize}`,
      name: `${product.name} (${selectedSize})`,
      price: calculatedPrice,
      volume: selectedSize
    };
    addToCart(variantItem, quantity);
    setIsCartOpen(false);
    router.push("/checkout");
  };

  // Human-written metrics parameters
  const sillageValue = parseInt(product.id) % 2 === 0 ? "Standard Sillage" : "Intense Sillage";
  const longevityValue = parseInt(product.id) % 2 === 0 ? "Up to 12 Hours" : "Long Lasting";
  const seasonalPreference = parseInt(product.id) % 3 === 0 ? "Fall & Winter" : "All Season";

  // Related products selection
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Breadcrumb Navigation Row */}
      <div className="flex justify-between items-center px-1">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-700 text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
        <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
          Product SKU: NF-0{product.id}
        </span>
      </div>

      {/* Main product view grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Image & specs */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-white/60 shadow-xl flex items-center justify-center bg-white/40 backdrop-blur-md">
            {/* Specular Glow Base */}
            <div className="absolute inset-2 rounded-[32px] overflow-hidden">
              {product.imageUrl && product.imageUrl.startsWith("linear-gradient") ? (
                <div className="absolute inset-0" style={{ background: product.imageUrl }} />
              ) : (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover bg-white/30"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/30 pointer-events-none" />
            </div>

            {/* Favorite Wishlist Icon Overlay */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-6 right-6 p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-stone-100 text-stone-600 hover:text-rose-500 transition-all shadow-md hover:scale-105 active:scale-95"
            >
              <Heart className={`w-5 h-5 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>

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
            <h4 className="text-[10px] font-extrabold text-stone-400 tracking-widest uppercase">Fragrance Profile</h4>
            
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
                  <div className="bg-amber-500 h-full w-[92%] rounded-full" />
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
                  <div className="bg-amber-500 h-full w-[88%] rounded-full" />
                </div>
              </div>

              {/* Season */}
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-stone-200/40">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" /> Season
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
            {/* Category and Concentration Badges */}
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/10 text-amber-900 border border-amber-500/20 text-[9px] font-bold tracking-widest px-3.5 py-1.5 rounded-full uppercase">
                {product.category} Accord
              </span>
              <span className="bg-white/80 border border-stone-200 text-stone-600 text-[9px] font-bold tracking-widest px-3.5 py-1.5 rounded-full uppercase shadow-xs">
                {getFriendlyType(product.type)}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-black text-stone-850 font-serif leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-amber-700 font-serif italic font-medium tracking-wide">
                "Naeemi Naam Hai Mohabbat Ka"
              </p>
            </div>

            {/* Ratings & Price */}
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {(product.rating && typeof product.rating === 'number') ? product.rating.toFixed(1) : '5.0'} / 5.0 Rating
              </div>
              <span className="text-3xl font-black text-stone-850 tracking-tight">
                Rs. {calculatedPrice.toLocaleString()}
              </span>
            </div>

            {/* Size Variant Selector */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-extrabold text-stone-400 uppercase block tracking-widest">Select Bottle Size</span>
              <div className="flex gap-3">
                {["50ml", "100ml"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      selectedSize === size
                        ? "border-amber-600 bg-amber-500/10 text-amber-900 shadow-sm"
                        : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Product description block */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest block">Description</span>
              <p className="text-stone-600 text-xs md:text-sm leading-relaxed bg-white/40 border border-white/60 p-5 rounded-3xl font-medium">
                {product.description}
              </p>
            </div>

            {/* Stock status indicator */}
            <div className="flex items-center gap-2 text-xs">
              {isOutOfStock ? (
                <span className="flex items-center gap-1.5 text-rose-600 font-bold bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
                  <AlertCircle className="w-4 h-4 animate-pulse" /> Out of stock - Restocking soon
                </span>
              ) : hasLowStock ? (
                <span className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                  <AlertCircle className="w-4 h-4 animate-bounce" /> Low Stock: Only {product.stock} items remaining
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-100">
                  ✓ In Stock
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
                    <span className="font-extrabold text-stone-850 text-lg">
                      Rs. {(calculatedPrice * quantity).toLocaleString()}
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
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={quantity > product.stock}
                    className="flex-1 py-3.5 rounded-2xl gold-btn text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md disabled:bg-stone-300 disabled:shadow-none"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Buy It Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Explorer Segment */}
      <section className="pt-4">
        <NoteExplorer
          topNotes={product.topNotes}
          heartNotes={product.heartNotes}
          baseNotes={product.baseNotes}
        />
      </section>

      {/* CUSTOMER REVIEWS SECTION */}
      <section className="space-y-6 pt-8 border-t border-stone-200/40">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-stone-850 tracking-tight font-serif">
            Customer Reviews
          </h2>
          <p className="text-xs text-stone-500 font-medium">Read what our fragrance connoisseurs say about {product.name}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Review metrics card */}
          <div className="md:col-span-4 p-6 rounded-3xl bg-stone-50 border border-stone-200/60 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-extrabold text-stone-850">
                {product.rating ? product.rating.toFixed(1) : "5.0"}
              </span>
              <div className="space-y-0.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Out of 5 Stars</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-stone-500">
              <div className="flex items-center gap-2">
                <span className="w-12 text-left text-[9px] uppercase tracking-wider">5 Star</span>
                <div className="flex-1 bg-white h-2 rounded-full overflow-hidden border border-stone-150">
                  <div className="bg-amber-500 h-full w-[92%]" />
                </div>
                <span className="w-8 text-right text-[10px] font-bold text-stone-700">92%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-left text-[9px] uppercase tracking-wider">4 Star</span>
                <div className="flex-1 bg-white h-2 rounded-full overflow-hidden border border-stone-150">
                  <div className="bg-amber-500 h-full w-[8%]" />
                </div>
                <span className="w-8 text-right text-[10px] font-bold text-stone-700">8%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-12 text-left text-[9px] uppercase tracking-wider">3 Star</span>
                <div className="flex-1 bg-white h-2 rounded-full overflow-hidden border border-stone-150">
                  <div className="bg-stone-250 h-full w-0" />
                </div>
                <span className="w-8 text-right text-[10px] font-bold text-stone-700">0%</span>
              </div>
            </div>
          </div>

          {/* List of reviews */}
          <div className="md:col-span-8 space-y-4">
            {getMockReviews(product.name, product.category).map((rev, index) => (
              <div key={index} className="p-5 rounded-3xl bg-white border border-stone-150 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-stone-850">{rev.name}</span>
                  <span className="text-stone-400 font-medium">{rev.date}</span>
                </div>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(rev.rating) ? "fill-current" : "text-stone-200"}`} />
                  ))}
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-medium pt-1">
                  "{rev.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS - "You May Also Like" */}
      <section className="space-y-6 pt-8 border-t border-stone-200/40">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-stone-850 tracking-tight font-serif">
            You May Also Like
          </h2>
          <p className="text-xs text-stone-500 font-medium font-sans">Explore other hand-crafted, premium fragrances from our house.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
            <FragranceCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
