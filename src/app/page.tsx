"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { FragranceCard } from "@/components/FragranceCard";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  Award, 
  HeartHandshake, 
  Star,
  Quote,
  Mail,
  Phone,
  MapPin,
  Send,
  Check
} from "lucide-react";

export default function Home() {
  const { products } = useAdmin();
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Split products for sections
  const featuredProducts = products.slice(0, 3); // Shams, Oud, Qaswa
  const bestSellers = products.slice(3, 7); // Albaloshi, Najaf, Musk, Quds

  const categories = [
    { name: "Oud", icon: "✨", desc: "Royal & Majestic Oud blends" },
    { name: "Floral", icon: "🌸", desc: "Sweet & Fresh blossom essences" },
    { name: "Woody", icon: "🪵", desc: "Warm & Earthy timber elements" },
    { name: "Fresh", icon: "🍋", desc: "Invigorating, zesty fresh scents" },
  ];

  const testimonials = [
    {
      name: "Mohammad Harris",
      role: "Fragrance Connoisseur",
      comment: "Shams Un Naeemi is an absolute masterpiece. The projection is majestic and the amber notes are extremely smooth. Easily lasts 10+ hours on my linen shirt.",
      rating: 5
    },
    {
      name: "Zainab Bibi",
      role: "Verified Buyer",
      comment: "Musk e Naeemi feels like a clean, soft powdery dream. It is perfect for daily wear. The brand tagline 'Naeemi Naam Hai Mohabbat Ka' is fully reflected in their care.",
      rating: 5
    },
    {
      name: "Dr. Farhan",
      role: "Oud Collector",
      comment: "Oud Un Naeemi holds its ground against perfumes costing triple its price. Excellent concentration, superb sillage, and beautiful presentation.",
      rating: 5
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* SECTION 1: HERO (Brand Banner) */}
      <section className="relative overflow-hidden rounded-[32px] glass-panel border border-white/50 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-xl bg-gradient-to-br from-amber-50/40 via-white/20 to-rose-50/30">
        
        {/* Background glow flares */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT COLUMN: Premium Copy details */}
        <div className="space-y-6 max-w-xl text-left w-full md:w-1/2 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-amber-600/30 text-amber-600 animate-pulse" />
            Luxury Fragrance Vault
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight font-serif text-stone-850 leading-tight">
            Elevate Your <br />
            <span className="gold-gradient-text">Presence</span>
          </h1>

          <div className="space-y-3">
            <p className="text-lg md:text-2xl font-bold italic text-amber-700/90 font-serif border-l-2 border-amber-500/40 pl-3">
              "Naeemi Naam Hai Mohabbat Ka"
            </p>
            <p className="text-xs md:text-sm text-stone-500 leading-relaxed font-medium">
              A curated collection of rich, long-lasting fragrances designed to evoke memories and inspire emotions. Discover our signature blends of royal Oud, fresh florals, and warm wood notes.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link href="/shop" className="px-6 py-3.5 rounded-2xl gold-btn font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all">
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#story"
              className="px-6 py-3.5 rounded-2xl border border-stone-200 bg-white/40 backdrop-blur-md text-stone-700 font-bold text-xs hover:bg-white/60 transition-all"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Cinematic 3D Perfume Podium */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center min-h-[380px] select-none z-10">
          
          {/* Subtle warm golden spotlight flare from top */}
          <div className="absolute top-[-80px] w-64 h-96 bg-gradient-to-b from-amber-300/20 via-amber-200/5 to-transparent blur-2xl pointer-events-none" />

          {/* Background circular halo light behind bottle */}
          <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-amber-300/30 to-rose-200/20 blur-3xl animate-pulse pointer-events-none" />

          {/* Floating fine gold light particles/orbits */}
          <div className="absolute w-80 h-40 rounded-full border border-amber-500/10 rotate-[-12deg] scale-[1.1] animate-[spin_25s_linear_infinite] pointer-events-none" />
          <div className="absolute w-72 h-36 rounded-full border border-amber-400/20 rotate-[8deg] scale-[0.9] animate-[spin_20s_linear_infinite_reverse] pointer-events-none" />

          {/* 3D Pedestal Construct */}
          <div className="relative mt-8 flex flex-col items-center justify-center">
            
            {/* Float container for perfume bottle */}
            <div className="relative z-20 transition-all duration-700 hover:-translate-y-4 cursor-pointer select-none">
              <img
                src="/heroimg.webp"
                alt="Naeemi Fragrance Premium Bottle"
                className="w-auto h-auto max-h-[300px] object-contain drop-shadow-[0_25px_45px_rgba(212,175,55,0.4)]"
              />
              
              {/* Specular bottle light reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/0 via-white/10 to-white/0 rounded-full mix-blend-overlay pointer-events-none" />
            </div>

            {/* 3D Cylindrical Display Pedestal (Podium) */}
            <div className="relative w-72 h-20 -mt-16 flex flex-col items-center justify-start pointer-events-none">
              
              {/* Podium Top Face (3D Ellipse with radial gold gradient and glass luster) */}
              <div className="absolute top-0 z-10 w-64 h-14 rounded-full bg-gradient-to-b from-amber-50/90 to-amber-200/60 border border-amber-300/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_4px_20px_rgba(180,130,40,0.15)] flex items-center justify-center">
                {/* Golden specular inner reflection ring */}
                <div className="w-[96%] h-[90%] rounded-full border border-white/60 bg-gradient-to-b from-white/30 to-amber-100/10" />
              </div>

              {/* Podium Cylindrical Front Face (Adds depth thickness) */}
              <div className="absolute top-7 w-64 h-8 rounded-full bg-gradient-to-b from-amber-200/90 via-amber-300/80 to-amber-400/50 border-x border-b border-amber-400/30 shadow-[0_12px_24px_rgba(160,110,30,0.3)]" />

              {/* Soft ground ambient occlusion shadow */}
              <div className="absolute top-10 w-68 h-12 rounded-full bg-amber-950/20 blur-md" />
            </div>
            
          </div>
        </div>
      </section>

      {/* SECTION 2: ACCORD EXPLORER */}
      <section className="space-y-4">
        <div className="text-center max-w-md mx-auto space-y-1">
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">Browse Scent Accords</h2>
          <p className="text-xs text-stone-500">Select families matching your unique skin chemistry</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/shop?category=${cat.name}`}
              className="group p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col items-start space-y-3 relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-lg shadow-xs group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-stone-800 text-sm">{cat.name}</h3>
                <p className="text-[10px] text-stone-500">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 3: FEATURED PERFUMES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-stone-800 tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600 fill-amber-500/20" />
              Featured Masterpieces
            </h2>
            <p className="text-xs text-stone-500">Our signature entries curated for timeless elegance</p>
          </div>
          <Link href="/shop" className="text-xs font-bold text-amber-700 hover:text-amber-600 flex items-center gap-1 transition-colors">
            Explore All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product, idx) => (
            <FragranceCard key={product.id || `featured-${idx}`} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE US */}
      <section className="p-8 rounded-[32px] glass-panel bg-stone-50/20 space-y-8 border border-white/40">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-800 font-serif">
            Why Choose Naeemi?
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            Every bottle is mixed with pure raw imports to deliver maximum sillage and projection longevity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/40 border border-white/60 p-5 rounded-2xl space-y-2.5 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-800 text-sm">Long Lasting projection</h3>
            <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
              We extract concentrates at Extrait strength, lasting up to 12 hours on skin and fabric.
            </p>
          </div>

          <div className="bg-white/40 border border-white/60 p-5 rounded-2xl space-y-2.5 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-800 text-sm">Pure Essential Imports</h3>
            <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
              Sourced directly from Europe and the East, our notes maintain organic complexity and depth.
            </p>
          </div>

          <div className="bg-white/40 border border-white/60 p-5 rounded-2xl space-y-2.5 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-800 text-sm">Naam Hai Mohabbat Ka</h3>
            <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
              True to our slogan, every fragrance is hand-packed and inspected with ultimate care and dedication.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: BRAND STORY */}
      <section id="story" className="relative overflow-hidden rounded-[32px] glass-panel border border-white/50 p-8 md:p-12 flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-1 space-y-4">
          <span className="text-[10px] font-bold tracking-widest text-amber-700 uppercase">The Legacy</span>
          <h2 className="text-3xl font-extrabold text-stone-800 font-serif">"Naeemi Naam Hai Mohabbat Ka"</h2>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            Founded with a passion for high-sillage perfumery, Naeemi Fragrance brings you the warmth of traditional Arabic Ouds and the refreshing charm of floral French extracts. 
          </p>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            Our name is synonymous with care. We formulate every scent in small premium batches, allowing natural ingredients to mature into complex layers that express love, confidence, and peace.
          </p>
        </div>
        <div className="flex-1 w-full max-w-sm rounded-2xl bg-gradient-to-br from-amber-100/50 to-rose-100/50 border border-white p-6 space-y-4">
          <span className="text-[10px] font-bold text-amber-900/60 uppercase block">Crafting Accord Secrets</span>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700">Import Sillage Strengths</span>
              <span className="font-extrabold text-amber-800">94%</span>
            </div>
            <div className="w-full bg-white h-1.5 rounded-full">
              <div className="bg-amber-500 h-full w-[94%] rounded-full" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700">Pure Essential Concentrations</span>
              <span className="font-extrabold text-amber-800">22% - 28%</span>
            </div>
            <div className="w-full bg-white h-1.5 rounded-full">
              <div className="bg-amber-500 h-full w-[85%] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: BEST SELLERS */}
      <section className="space-y-4">
        <div className="text-center max-w-md mx-auto space-y-1">
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">Best Sellers List</h2>
          <p className="text-xs text-stone-500">The most popular signature picks of the season</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bestSellers.map((product, idx) => (
            <Link
              key={product.id || `bestseller-${idx}`}
              href={`/product/${product.id}`}
              className="group p-4 bg-white/40 border border-white/60 rounded-2xl hover:bg-white/70 transition-all flex flex-col justify-between"
            >
              <div className="aspect-square rounded-xl overflow-hidden mb-3" style={{ background: product.imageUrl }} />
              <div>
                <span className="text-[9px] font-bold uppercase text-stone-400 block">{product.type ? product.type.split(" ")[0] : "PARFUM"}</span>
                <h4 className="font-bold text-xs text-stone-800 group-hover:text-amber-700 truncate">{product.name}</h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-black text-stone-700">Rs. {product.price.toLocaleString()}</span>
                  <span className="text-[9px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                    ★ {product.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 7: REVIEWS */}
      <section className="space-y-6">
        <div className="text-center max-w-md mx-auto space-y-1">
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">Client Testimonials</h2>
          <p className="text-xs text-stone-500">Read what perfume connoisseurs write about us</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, index) => (
            <div key={index} className="glass-panel p-5 rounded-2xl space-y-3 relative">
              <Quote className="w-8 h-8 text-amber-500/20 absolute right-4 top-4" />
              
              <div className="flex items-center gap-0.5">
                {Array.from({ length: test.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                ))}
              </div>

              <p className="text-xs text-stone-600 italic leading-relaxed">
                "{test.comment}"
              </p>

              <div className="border-t border-stone-200/50 pt-2 text-left">
                <p className="font-bold text-stone-800 text-xs">{test.name}</p>
                <p className="text-[10px] text-stone-400">{test.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: CALL TO ACTION (CTA) */}
      <section className="relative rounded-[32px] glass-panel border border-amber-500/20 p-8 md:p-12 text-center space-y-6 overflow-hidden">
        {/* Background Accent glow */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl" />

        <div className="max-w-xl mx-auto space-y-4 relative">
          <h2 className="text-3xl font-extrabold text-stone-800 font-serif">Discover Your Scent Identity</h2>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            Sign up for our exclusive collection alerts, private promotions, and new batch launch notifications. Let us find the fragrance of love for you.
          </p>

          {newsletterSubscribed ? (
            <div className="mx-auto max-w-sm py-2 px-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4" /> Subscription Successful! Welcome to Naeemi Fragrances.
            </div>
          ) : (
            <div className="mx-auto max-w-md flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                className="flex-grow px-4 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none w-full"
              />
              <button
                onClick={() => setNewsletterSubscribed(true)}
                className="px-5 py-2.5 rounded-xl gold-btn text-white font-bold text-xs w-full sm:w-auto shrink-0"
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 9: CONTACT INFO & CONNECT */}
      <section id="contact" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-4 border-t border-stone-200/50">
        {/* Contact info list */}
        <div className="md:col-span-5 space-y-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-stone-800 text-lg">Connect With Us</h3>
            <p className="text-xs text-stone-500">Reach out for custom bridal batches or private orders</p>
          </div>

          <div className="space-y-3.5 text-xs text-stone-600 font-medium">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500">
                <Phone className="w-4 h-4" />
              </div>
              <span className="font-semibold text-stone-800">03092184760</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500">
                <Mail className="w-4 h-4" />
              </div>
              <span>support@naeemi.com</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500">
                <MapPin className="w-4 h-4" />
              </div>
              <span>Gulberg III, Lahore, Pakistan</span>
            </div>
          </div>
        </div>

        {/* Short inquiry submission form */}
        <div className="md:col-span-7">
          {contactSubmitted ? (
            <div className="p-6 text-center bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-3xl space-y-2 animate-fadeIn">
              <Check className="w-8 h-8 mx-auto stroke-[2.5]" />
              <h4 className="font-bold text-sm">Message Sent Securely</h4>
              <p className="text-xs text-emerald-700">Thank you. The Naeemi care team will contact you shortly.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setContactSubmitted(true); }}
              className="bg-white/40 border border-white/60 p-5 rounded-3xl space-y-3.5"
            >
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                />
              </div>
              <textarea
                required
                rows={2}
                placeholder="How can we assist you with Naeemi Fragrances?"
                className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl gold-btn text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
