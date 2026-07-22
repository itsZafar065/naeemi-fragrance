"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Award, ShieldCheck, HeartHandshake, ArrowRight, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12 text-stone-850 animate-fadeIn mt-4">
      
      {/* Hero Header Section */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] font-extrabold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 fill-amber-600/30 text-amber-600" />
          The Legacy of Scent
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight font-serif text-stone-800">
          "Naeemi Naam Hai <br />
          <span className="gold-gradient-text">Mohabbat Ka"</span>
        </h1>
        <p className="text-xs md:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
          Founded with a passion for high-sillage perfumery, Naeemi Fragrance blends the traditional warmth of pure Eastern Ouds with the modern brightness of French floral essences.
        </p>
      </section>

      {/* Grid: Heritage & Craft */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="glass-panel p-6 md:p-8 rounded-[36px] border border-white/50 space-y-4 flex flex-col justify-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700">Our Heritage</span>
          <h3 className="text-xl md:text-2xl font-bold font-serif text-stone-800">Pure Extracts,Small Batches</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Unlike mass-produced scents that fade quickly, every bottle of Naeemi Fragrance is mixed in small, carefully monitored batches. We allow our premium oils to age organically, ensuring that when the scent reaches your skin, it behaves like a living story — revealing top, heart, and base notes over several hours.
          </p>
        </div>

        <div className="glass-panel p-6 md:p-8 rounded-[36px] border border-white/50 space-y-4 flex flex-col justify-center bg-gradient-to-br from-amber-50/40 via-white/10 to-rose-50/30">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700">Sillage Guarantee</span>
          <h3 className="text-xl md:text-2xl font-bold font-serif text-stone-800">Designed to Project</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Our scents are formulated at Extrait de Parfum strength, utilizing oil concentrations between 22% and 28%. This ensures an exceptional projection (sillage) that stays with you, lasting up to 10-12 hours on skin and fabrics even in humid climates.
          </p>
        </div>
      </section>

      {/* Brand Values */}
      <section className="p-8 md:p-12 rounded-[40px] glass-panel bg-stone-50/20 border border-white/40 space-y-8">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold font-serif text-stone-800">What Drives Us</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            We are built on trust, luxury quality, and personal touch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/40 border border-white/60 p-5 rounded-2xl space-y-2.5 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-800 text-sm">Longevity Promise</h4>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              We never cut corners on essential oils. Our perfumes stay long and leave a memorable trail.
            </p>
          </div>

          <div className="bg-white/40 border border-white/60 p-5 rounded-2xl space-y-2.5 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-800 text-sm">Authentic Imports</h4>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Our Ouds are sourced directly from Cambodia and India, and our florals are processed in Grasse, France.
            </p>
          </div>

          <div className="bg-white/40 border border-white/60 p-5 rounded-2xl space-y-2.5 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-800 text-sm">Personal Touch</h4>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              True to "Mohabbat", we inspect, hand-wrap, and sign off every order before it leaves our vault.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="text-center py-6 border-t border-stone-200/50 space-y-4">
        <h3 className="text-xl font-bold font-serif text-stone-800">Experience the Scent Vault</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Explore our collection of Ouds and florals to find the signature scent that complements you.
        </p>
        <div className="pt-2 flex justify-center">
          <Link href="/shop" className="px-6 py-3 rounded-2xl gold-btn font-bold text-xs flex items-center gap-2 shadow-md">
            Explore Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
