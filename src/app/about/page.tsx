"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Award, ShieldCheck, HeartHandshake, ArrowRight, User, BookOpen, Quote } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-16 text-stone-850 animate-fadeIn mt-4">
      
      {/* HERO SECTION: Spiritual Leader & Legacy */}
      <section className="relative overflow-hidden rounded-[40px] border border-amber-500/20 bg-gradient-to-b from-amber-50/50 via-stone-50/30 to-white p-8 md:p-12 text-center space-y-6 shadow-md">
        {/* Background glow effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] font-extrabold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 fill-amber-600/30 text-amber-600 animate-pulse" />
          Ruhani-Rehnumai & Spiritual Blessing
        </div>

        {/* Calligraphy Frame / Title */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <p className="text-xs text-stone-500 font-medium tracking-wide uppercase">
            Hamare buzurgo ki duaon, pehchan aur unke karam se chalne wala azeem legacy:
          </p>
          <div className="py-4 border-y border-amber-505/20 my-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 leading-normal font-sans py-1">
              جانِ اہلسنت مفتیِ اعظم سندھ شیخ الحدیث <br />
              <span className="gold-gradient-text text-3xl sm:text-4xl md:text-5xl font-serif">مفتی محمد جان نعیمی</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Aap na sirf hamare rehnuma hain, balkay hamare nihayat shafiq **Ustad** hain jinse humne ilm o adab seekha, aur hamare **Murshid-e-Kamil** hain. Hamare karobar ka ek ek qatra aap hi ki duaon ka azeem samar ha. Hamein fakhra ha ke hum aap ke dar ke adna talib-e-ilm hain.
          </p>
        </div>

        {/* Spiritual Quote box */}
        <div className="max-w-xl mx-auto p-4.5 bg-white/60 border border-amber-100 rounded-2xl flex gap-3.5 text-left items-start shadow-xs">
          <Quote className="w-8 h-8 text-amber-500 shrink-0 opacity-40 rotate-180" />
          <p className="text-[11px] text-stone-500 leading-relaxed italic">
            "Naeemi Naam Hai Mohabbat Ka — Ye sirf ek tagline nahi, balkay hamare ustad o murshid ki sachi sikhai hui mohabbat ka amli aayena-dar ha jo hum har fragrance ke sath aap tak pohnchate hain."
          </p>
        </div>
      </section>

      {/* SECTION 2: Owner Details with Frame Image */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Owner Image / Presentation Frame (Col 5) */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative group w-full max-w-[280px] aspect-[4/5] rounded-[36px] overflow-hidden p-2 bg-gradient-to-br from-amber-500/30 to-amber-600/10 shadow-lg border border-amber-100/50">
            <div className="w-full h-full rounded-[28px] overflow-hidden relative bg-stone-100 flex items-center justify-center border border-white">
              {/* Premium Abstract Gold Texture Background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-stone-900 via-stone-800 to-amber-900 opacity-90 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)]" />
              
              {/* Overlay Text Details */}
              <div className="relative z-10 text-center p-6 space-y-3 text-white">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-wide uppercase font-serif">Zafar Naeemi</h4>
                  <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest mt-0.5">Owner & Founder</p>
                </div>
                <p className="text-[10px] text-stone-300 leading-relaxed">
                  Dedicated Perfumer carrying forward the spiritual name and legacy of his Murshid.
                </p>
              </div>

              {/* Gold borders */}
              <div className="absolute inset-2.5 border border-amber-500/20 rounded-[22px] pointer-events-none" />
              <div className="absolute inset-3 border border-white/5 rounded-[20px] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Owner Bio details (Col 7) */}
        <div className="md:col-span-7 space-y-5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            About The Owner
          </span>
          <h3 className="text-2xl md:text-3xl font-black font-serif text-stone-800 leading-tight">
            carrying the legacy of <br />
            <span className="gold-gradient-text">Trust and Love</span>
          </h3>
          <div className="text-xs text-stone-600 space-y-3.5 leading-relaxed">
            <p>
              Main **Zafar**, Naeemi Fragrance ka owner aur founder, apne aap ko nihayat khush-naseeb samajhta hoon ke mujhe mere **Ustad aur Murshid Mufti Muhammad Jan Naeemi** ke zair-e-saaya taleem o tarbiyat hasil karne ka sharaf mila.
            </p>
            <p>
              Is business ki bunyad sirf karobar ke liye nahi, balkay mere ustad ke rohani naam ke sath juday huay aitemad ko aam karne ke liye rakhi gayi thi. Hum har perfume ki blending se lekar uski packing tak is baat ka khususi khayal rakhte hain ke hamare har scent mein sachi lagan aur pakeezah mohabbat ka ahasas shamil ho.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: Scent Craft & Heritage */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="glass-panel p-6 md:p-8 rounded-[36px] border border-white/50 space-y-4 flex flex-col justify-center shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700">Scent Heritage</span>
          <h3 className="text-xl md:text-2xl font-bold font-serif text-stone-800">Pure Extracts, Small Batches</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Unlike mass-produced scents that fade quickly, every bottle of Naeemi Fragrance is mixed in small, carefully monitored batches. We allow our premium oils to age organically, ensuring that when the scent reaches your skin, it behaves like a living story — revealing top, heart, and base notes over several hours.
          </p>
        </div>

        <div className="glass-panel p-6 md:p-8 rounded-[36px] border border-white/50 space-y-4 flex flex-col justify-center bg-gradient-to-br from-amber-50/40 via-white/10 to-rose-50/30 shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700">Longevity Guarantee</span>
          <h3 className="text-xl md:text-2xl font-bold font-serif text-stone-800">Formulated for Sillage</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Our scents are formulated at Extrait de Parfum strength, utilizing oil concentrations between 22% and 28%. This ensures an exceptional projection (sillage) that stays with you, lasting up to 10-12 hours on skin and fabrics even in humid climates.
          </p>
        </div>
      </section>

      {/* SECTION 4: Brand Values */}
      <section className="p-8 md:p-12 rounded-[40px] glass-panel bg-stone-50/20 border border-white/40 space-y-8 shadow-xs">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <h2 className="text-2xl font-extrabold font-serif text-stone-800">Our Core Principles</h2>
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
