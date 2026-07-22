"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { FragranceCard } from "@/components/FragranceCard";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

function ShopContent() {
  const { products } = useAdmin();
  const searchParams = useSearchParams();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<number>(15000);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Sync category and search query filters with parameters if present
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }

    const queryParam = searchParams.get("query");
    if (queryParam) {
      setSearchQuery(decodeURIComponent(queryParam));
    }
  }, [searchParams]);

  // Unique categories and concentration types for filters
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const typesMap = [
    { value: "All", label: "All Strengths" },
    { value: "Extrait de Parfum", label: "Pure Perfume Extract (Strong)" },
    { value: "Eau de Parfum (EDP)", label: "Eau de Parfum (Standard)" },
    { value: "Eau de Toilette (EDT)", label: "Eau de Toilette (Light Scent)" },
  ];

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesType = selectedType === "All" || product.type.includes(selectedType) || (selectedType === "Eau de Parfum (EDP)" && product.type === "Eau de Parfum (EDP)");
    const matchesPrice = product.price <= priceRange;

    return matchesSearch && matchesCategory && matchesType && matchesPrice;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedType("All");
    setPriceRange(15000);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-stone-800 tracking-tight">
            Naeemi Perfumes
          </h1>
          <p className="text-xs text-stone-500">Explore our catalog of premium, long-lasting fragrances.</p>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search perfumes or fragrance notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/70 backdrop-blur-md border border-stone-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-sm shadow-xs"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Filter Column (Desktop View) */}
        <aside className="hidden lg:block space-y-6 p-6 rounded-3xl glass-panel border border-white/50 sticky top-28">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-800 text-xs flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-stone-650" />
              Filters
            </h3>
            <button
              onClick={resetFilters}
              className="text-[10px] font-bold text-amber-800 hover:text-amber-700 flex items-center gap-1 transition-colors animate-pulse"
            >
              <RotateCcw className="w-3 h-3" />
              Clear All
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-stone-400 tracking-wider uppercase block">
              Categories
            </label>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
                    selectedCategory === cat
                      ? "bg-amber-500/10 text-amber-900 border-l-2 border-amber-500 pl-4 font-bold"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Concentration Types */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-stone-400 tracking-wider uppercase block">
              Perfume Type
            </label>
            <div className="flex flex-col gap-1.5">
              {typesMap.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value)}
                  className={`text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
                    selectedType === t.value
                      ? "bg-amber-500/10 text-amber-900 border-l-2 border-amber-500 pl-4 font-bold"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-extrabold text-stone-400 tracking-wider uppercase">
              <span>Price Range</span>
              <span className="text-stone-800 font-bold">Rs. {priceRange.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="3000"
              max="15000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1 bg-stone-200 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[9px] text-stone-400">
              <span>Rs. 3k</span>
              <span>Rs. 15k</span>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Pill Slider */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/70 border border-stone-200 rounded-2xl text-xs font-semibold text-stone-700 whitespace-nowrap active:bg-stone-50"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters {selectedCategory !== "All" || selectedType !== "All" || priceRange !== 10000 ? "•" : ""}
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setShowFiltersMobile(false);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-all ${
                selectedCategory === cat
                  ? "bg-amber-600 border-amber-600 text-white shadow-xs"
                  : "bg-white/70 border-stone-200 text-stone-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mobile Filter Panel Toggle Drawer */}
        {showFiltersMobile && (
          <div className="lg:hidden p-5 rounded-2xl bg-white border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-stone-800 text-sm">Filters</h4>
              <button
                onClick={resetFilters}
                className="text-[10px] font-bold text-amber-800 flex items-center gap-1"
              >
                <RotateCcw className="w-2.5 h-2.5" /> Clear All
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase">Perfume Type</label>
              <div className="flex flex-wrap gap-1.5">
                {typesMap.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setSelectedType(t.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedType === t.value
                        ? "bg-amber-500/10 text-amber-800 border-amber-500"
                        : "bg-stone-50 border-stone-200 text-stone-600"
                    }`}
                  >
                    {t.label.split(" (")[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-stone-400 uppercase">
                <span>Max Price</span>
                <span className="text-amber-800 font-bold">Rs. {priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="3000"
                max="15000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-100 rounded-lg appearance-none"
              />
            </div>

            <button
              onClick={() => setShowFiltersMobile(false)}
              className="w-full py-2.5 bg-stone-800 text-white rounded-xl text-xs font-bold transition-all hover:bg-stone-700"
            >
              Show Results
            </button>
          </div>
        )}

        {/* Product Collection Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 p-6 rounded-3xl bg-white/40 border border-stone-200/50 space-y-4">
              <span className="text-4xl text-stone-300">🕵️‍♂️</span>
              <h3 className="font-bold text-stone-800 text-base">No Perfumes Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try adjusting your search filters or resetting them to view our collection.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <FragranceCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-stone-600">Loading collection...</div>}>
      <ShopContent />
    </Suspense>
  );
}
