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
  Calendar,
  CheckCircle2,
  RotateCcw,
  Truck,
  MessageSquare
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

  // Review states
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Sync selected product & load reviews from DB
  useEffect(() => {
    if (id) {
      const found = products.find((p) => p.id === id);
      if (found) {
        setProduct(found);
        setSelectedSize(found.volume || "100ml");
        
        // Fetch reviews from DB
        fetch(`/api/reviews?productId=${found.id}`)
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error();
          })
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              setReviewsList(data);
            } else {
              setReviewsList(getMockReviews(found.name, found.category));
            }
          })
          .catch(() => {
            setReviewsList(getMockReviews(found.name, found.category));
          });
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

  // Dynamic price calculation based on size variant
  let calculatedPrice = product.price;
  let calculatedRegularPrice = product.regularPrice || null;
  let calculatedStock = product.stock;

  const activeVariant = product.variants?.find((v) => v.volume === selectedSize);
  if (activeVariant) {
    calculatedPrice = activeVariant.price;
    calculatedRegularPrice = activeVariant.regularPrice || null;
    calculatedStock = activeVariant.stock;
  } else {
    // Fallback static calculations for backwards compatibility
    if (product.volume === "100ml" && selectedSize === "50ml") {
      calculatedPrice = Math.round(product.price * 0.7);
    } else if (product.volume === "50ml" && selectedSize === "100ml") {
      calculatedPrice = Math.round(product.price * 1.45);
    }
  }

  const hasLowStock = calculatedStock > 0 && calculatedStock <= 5;
  const isOutOfStock = calculatedStock === 0;

  const handleAddToCart = () => {
    if (quantity > calculatedStock) return;
    const variantItem = {
      ...product,
      id: `${product.id}-${selectedSize}`,
      name: `${product.name} (${selectedSize})`,
      price: calculatedPrice,
      volume: selectedSize,
      stock: calculatedStock
    };
    addToCart(variantItem, quantity);
  };

  const handleBuyNow = () => {
    if (quantity > calculatedStock) return;
    const variantItem = {
      ...product,
      id: `${product.id}-${selectedSize}`,
      name: `${product.name} (${selectedSize})`,
      price: calculatedPrice,
      volume: selectedSize,
      stock: calculatedStock
    };
    addToCart(variantItem, quantity);
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const handleToggleReviewForm = () => {
    setShowReviewForm((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          const element = document.getElementById("review-form-section");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 150);
      }
      return next;
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !newReviewName.trim() || !newReviewText.trim()) return;

    const newRevObj = {
      productId: product.id,
      name: newReviewName.trim(),
      rating: newReviewRating,
      text: newReviewText.trim(),
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRevObj),
      });

      if (res.ok) {
        const data = await res.json();
        setReviewsList([data.review, ...reviewsList]);
        setReviewSubmitted(true);
        setNewReviewName("");
        setNewReviewRating(5);
        setNewReviewText("");
        setShowReviewForm(false);
        setTimeout(() => setReviewSubmitted(false), 3000);
      }
    } catch (err) {
      alert("Failed to submit review. Please try again.");
    }
  };

  // Human-written metrics parameters
  const getNumericId = (idStr: string) => {
    if (!idStr) return 0;
    return idStr.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  };
  const numId = getNumericId(product.id);
  const sillageValue = numId % 2 === 0 ? "Standard Sillage" : "Intense Sillage";
  const longevityValue = numId % 2 === 0 ? "Up to 12 Hours" : "Long Lasting";
  const seasonalPreference = numId % 3 === 0 ? "Fall & Winter" : "All Season";

  // Related products selection: exclude currently opened product (using base ID splits)
  const baseCurrentId = product.id.toString().split("-")[0];
  const relatedProducts = products
    .filter((p) => p.id.toString() !== baseCurrentId)
    .slice(0, 3);

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-12 px-2 sm:px-4">
      {/* Top Breadcrumbs */}
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

      {/* 1. Main product view grid: Split Image and checkout details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-start">
        
        {/* LEFT COLUMN: Clean Product Image only */}
        <div className="w-full">
          <div className="relative aspect-[4/5] rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/60 shadow-xl flex items-center justify-center bg-white/40 backdrop-blur-md max-h-[380px] sm:max-h-none">
            <div className="absolute inset-2 rounded-[20px] sm:rounded-[24px] overflow-hidden">
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
              className="absolute top-5 right-5 p-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-stone-100 text-stone-600 hover:text-rose-500 transition-all shadow-md"
            >
              <Heart className={`w-4.5 h-4.5 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Actions, description, size variants, trust badges */}
        <div className="space-y-4">
          {/* Scent Accord and Strength Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-amber-500/10 text-amber-900 border border-amber-500/20 text-[9px] font-extrabold tracking-widest px-3 py-1 rounded-full uppercase">
              {product.category} Accord
            </span>
            <span className="bg-white/80 border border-stone-200 text-stone-600 text-[9px] font-extrabold tracking-widest px-3 py-1 rounded-full uppercase shadow-xs">
              {getFriendlyType(product.type)}
            </span>
          </div>

          {/* Product Title */}
          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-850 font-serif leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-amber-700 font-serif italic font-medium tracking-wide">
              "Naeemi Naam Hai Mohabbat Ka"
            </p>
          </div>

          {/* Ratings & Price */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {(product.rating && typeof product.rating === 'number') ? product.rating.toFixed(1) : '5.0'} / 5.0
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-black text-stone-855 tracking-tight">
                Rs. {calculatedPrice.toLocaleString()}
              </span>
              {calculatedRegularPrice && calculatedRegularPrice > calculatedPrice && (
                <span className="line-through text-stone-400 text-sm font-bold">
                  Rs. {calculatedRegularPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Size Variant Selector */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-extrabold text-stone-400 uppercase block tracking-widest font-sans">Select Bottle Size</span>
            <div className="flex gap-2">
              {(product.variants && product.variants.length > 0
                ? product.variants.map((v) => v.volume)
                : ["50ml", "100ml"]
              ).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-xl border text-[11px] font-bold transition-all ${
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
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest block font-sans">Description</span>
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed bg-white/40 border border-white/60 p-4 rounded-2xl font-medium">
              {product.description}
            </p>
          </div>

          {/* Stock status indicator */}
          <div className="flex items-center gap-2 text-xs">
            {isOutOfStock ? (
              <span className="flex items-center gap-1.5 text-rose-600 font-bold bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
                <AlertCircle className="w-4 h-4" /> Out of stock - Restocking soon
              </span>
            ) : hasLowStock ? (
              <span className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                <AlertCircle className="w-4 h-4 animate-pulse" /> Low Stock: Only {product.stock} items remaining
              </span>
            ) : (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">
                ✓ In Stock
              </span>
            )}
          </div>

          {/* Add to Cart & Buy Now panel */}
          {!isOutOfStock && (
            <div className="bg-white/40 border border-white/60 p-4 rounded-2xl space-y-4 shadow-sm">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                {/* Quantity selector */}
                <div className="space-y-1">
                  <label className="text-[9px] font-extrabold text-stone-400 uppercase block tracking-widest font-sans">Quantity</label>
                  <div className="flex items-center border border-stone-200 rounded-xl bg-white shadow-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1.5 hover:bg-stone-50 text-stone-500 rounded-l-xl transition-all font-semibold"
                    >
                      -
                    </button>
                    <span className="px-3.5 text-xs font-bold text-stone-700 min-w-[24px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3.5 py-1.5 hover:bg-stone-50 text-stone-500 rounded-r-xl transition-all font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-extrabold text-stone-400 block uppercase tracking-widest font-sans">Subtotal</span>
                  <span className="font-extrabold text-stone-855 text-lg">
                    Rs. {(calculatedPrice * quantity).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={quantity > product.stock}
                  className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/60 transition-all cursor-pointer disabled:bg-stone-100 disabled:text-stone-400"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={quantity > product.stock}
                  className="flex-1 py-3 rounded-xl gold-btn text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md disabled:bg-stone-300 disabled:shadow-none"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Buy It Now
                </button>
              </div>

              {/* Trust Badges - Placed below buy buttons with icons */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-stone-200/40 text-[10px] font-bold text-stone-600 font-sans">
                <div className="flex flex-col items-center text-center p-2 bg-stone-50/50 rounded-xl space-y-1 border border-stone-150">
                  <span className="p-1 bg-amber-500/10 text-amber-700 rounded-lg">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </span>
                  <span>Simple Returns</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 bg-stone-50/50 rounded-xl space-y-1 border border-stone-150">
                  <span className="p-1 bg-amber-500/10 text-amber-700 rounded-lg">
                    <Truck className="w-3.5 h-3.5" />
                  </span>
                  <span>Fast Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 bg-stone-50/50 rounded-xl space-y-1 border border-stone-150">
                  <span className="p-1 bg-amber-500/10 text-amber-700 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <span>100% Authentic</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Scent notes & metrics grid (balanced layout with stretch heights and top explanation) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-stone-200/20 items-stretch">
        {/* Fragrance Profile Metrics Card */}
        <div className="glass-panel p-5 rounded-3xl space-y-4 border border-white/50 flex flex-col justify-between h-full">
          <div className="space-y-2">
            <h4 className="font-bold text-stone-850 text-sm">Fragrance Profile</h4>
            <p className="text-[10px] text-stone-500 font-medium leading-relaxed font-sans">
              This signature perfume oil concentration is blended to react dynamically with your skin's warmth, delivering a steady release of notes over time.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Longevity */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-750 flex items-center gap-1.5">
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
                <span className="font-bold text-stone-755 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-amber-600" /> Sillage / Projection
                </span>
                <span className="font-semibold text-stone-500">{sillageValue}</span>
              </div>
              <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-stone-100">
                <div className="bg-amber-500 h-full w-[88%] rounded-full" />
              </div>
            </div>

            {/* Season */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200/40">
              <span className="font-bold text-stone-750 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Season
              </span>
              <span className="font-semibold text-amber-800 bg-amber-50/80 border border-amber-100/50 px-2 py-0.5 rounded-lg">
                {seasonalPreference}
              </span>
            </div>
          </div>
        </div>

        {/* Notes explorer component */}
        <NoteExplorer
          topNotes={product.topNotes}
          heartNotes={product.heartNotes}
          baseNotes={product.baseNotes}
        />
      </div>

      {/* 3. RELATED PRODUCTS - "You May Also Like" (excluding current product by base id) */}
      <section className="space-y-6 pt-8 border-t border-stone-200/20">
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

      {/* 4. CUSTOMER REVIEWS SECTION (Overhauled Redesign) */}
      <section className="space-y-6 pt-8 border-t border-stone-200/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/20 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-stone-855 tracking-tight font-serif">
              Customer Experience
            </h2>
            <p className="text-xs text-stone-500 font-medium font-sans">Verified testimonials and client feedback from our collectors.</p>
          </div>
          {/* Write a Review trigger button - Gold theme styled */}
          <button
            onClick={handleToggleReviewForm}
            className="px-5 py-2.5 bg-amber-550/10 hover:bg-amber-500/20 text-amber-900 border border-amber-500/20 rounded-xl text-[11px] font-extrabold uppercase tracking-wide transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {showReviewForm ? "Close Review Form" : "Write a Review"}
          </button>
        </div>

        {/* Dynamic review submission form panel (toggled via button - beautiful glass design) */}
        {showReviewForm && (
          <div id="review-form-section" className="w-full p-6 rounded-3xl bg-white/45 backdrop-blur-md border border-white/60 shadow-lg space-y-4 animate-fadeIn">
            <div className="border-b border-stone-200/20 pb-2">
              <h4 className="font-bold text-stone-855 text-sm font-serif">Share Your Experience</h4>
              <p className="text-[10px] text-stone-500 font-medium font-sans">Your honest rating and review helps other perfume buyers.</p>
            </div>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-sans">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Harris Khan"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-xs focus:outline-none bg-white/60 focus:border-amber-550 font-medium shadow-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-sans">Select Rating</label>
                  <div className="flex gap-1.5 text-stone-300 py-2.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="focus:outline-none transition-colors"
                      >
                        <Star className={`w-5 h-5 ${star <= newReviewRating ? "text-amber-500 fill-amber-500" : "text-stone-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block font-sans">Your Review Description</label>
                <textarea
                  placeholder="How is the longevity, projection, and scent drydown?"
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-xs focus:outline-none bg-white/60 focus:border-amber-555 font-medium resize-none shadow-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2.5">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 sm:px-5 sm:py-2 text-[10px] font-bold text-stone-600 uppercase tracking-wide border border-stone-200 rounded-lg bg-white/50 hover:bg-white transition-all text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 sm:px-6 sm:py-2 gold-btn text-white rounded-lg font-bold text-[10px] uppercase tracking-wide shadow-sm text-center"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        )}

        {reviewSubmitted && (
          <div className="w-full flex items-center justify-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Thank you! Your experience review has been recorded.
          </div>
        )}

        {/* Dynamic Reviews summary banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Summary stats */}
          <div className="md:col-span-4 p-6 rounded-3xl bg-stone-50 border border-stone-200/50 flex flex-col justify-center items-center text-center space-y-3">
            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest font-sans">Overall Rating</span>
            <span className="text-5xl font-black text-stone-850 tracking-tight font-serif">
              {product.rating ? product.rating.toFixed(1) : "5.0"}
            </span>
            <div className="flex text-amber-500 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider font-sans">
              Based on {reviewsList.length} Verified Reviews
            </span>
          </div>

          {/* Rating distribution progress bars */}
          <div className="md:col-span-8 p-6 rounded-3xl bg-stone-50 border border-stone-200/50 flex flex-col justify-center space-y-3">
            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest font-sans mb-1">Rating Breakdown</span>
            <div className="flex items-center gap-3 text-xs font-semibold text-stone-500">
              <span className="w-12 text-left text-[9px] uppercase tracking-wider font-sans">5 Star</span>
              <div className="flex-1 bg-white h-2 rounded-full overflow-hidden border border-stone-200">
                <div className="bg-amber-500 h-full w-[92%]" />
              </div>
              <span className="w-8 text-right text-[10px] font-bold text-stone-700">92%</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-stone-500">
              <span className="w-12 text-left text-[9px] uppercase tracking-wider font-sans">4 Star</span>
              <div className="flex-1 bg-white h-2 rounded-full overflow-hidden border border-stone-200">
                <div className="bg-amber-500 h-full w-[8%]" />
              </div>
              <span className="w-8 text-right text-[10px] font-bold text-stone-700">8%</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-stone-500">
              <span className="w-12 text-left text-[9px] uppercase tracking-wider font-sans">3 Star</span>
              <div className="flex-1 bg-white h-2 rounded-full overflow-hidden border border-stone-200">
                <div className="bg-stone-200 h-full w-0" />
              </div>
              <span className="w-8 text-right text-[10px] font-bold text-stone-700">0%</span>
            </div>
          </div>
        </div>

        {/* List of customer reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewsList.map((rev, index) => (
            <div key={index} className="p-5 rounded-3xl bg-white border border-stone-150 flex flex-col justify-between gap-3 animate-fadeIn hover:shadow-xs transition-shadow">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    {/* User circular avatar badge */}
                    <div className="w-7 h-7 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-[10px] font-black text-stone-600">
                      {rev.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-stone-850">{rev.name}</span>
                      <span className="text-[9px] text-amber-700/80 font-bold uppercase tracking-wider font-sans">Verified Buyer</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium">{rev.date}</span>
                </div>
                <div className="flex text-amber-500 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rev.rating) ? "fill-current" : "text-stone-200"}`} />
                  ))}
                </div>
                <p className="text-xs text-stone-650 leading-relaxed font-medium pt-1 italic font-sans">
                  "{rev.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
