"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Check,
  Loader
} from "lucide-react";

export default function Home() {
  const { products } = useAdmin();
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterError("");
    setNewsletterSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewsletterSubscribed(true);
        setNewsletterEmail("");
      } else {
        setNewsletterError(data.error || "Subscription failed.");
      }
    } catch (err) {
      setNewsletterError("Connection failed. Please try again.");
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError("");
    setContactSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          message: contactMessage,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setContactSubmitted(true);
    } catch (err: any) {
      setContactError(err.message);
    } finally {
      setContactSubmitting(false);
    }
  };

  // Filter specific featured products dynamically by name matching in exact order
  const featuredNames = ["Marj", "Qaswa", "Al-Munir"];
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const featuredProducts = featuredNames
    .map((name) => products.find((p) => normalize(p.name) === normalize(name)))
    .filter((p): p is (typeof products)[0] => Boolean(p));
  const bestSellers = products
    .filter((p) => !featuredNames.some((fn) => normalize(fn) === normalize(p.name)))
    .slice(0, 4);

  const categories = [
    { name: "Oud", icon: "✨", desc: "Deep, rich & traditional Oud scents" },
    { name: "Floral", icon: "🌸", desc: "Sweet, soft & pleasant flower notes" },
    { name: "Woody", icon: "🪵", desc: "Warm, smooth cedar & amber blends" },
    { name: "Fresh", icon: "🍋", desc: "Clean, light & all-day refreshing" },
  ];

  const testimonials = [
    {
      name: "Mohammad Harris",
      role: "Verified Customer",
      comment: "Shams Un Naeemi is fantastic. The scent is very smooth and easily lasts 10+ hours on my clothes. Got many compliments at a family event.",
      rating: 5
    },
    {
      name: "Zainab Bibi",
      role: "Verified Customer",
      comment: "Qaswa is such a clean, soft and pleasant fragrance. Perfect for everyday wear. The packaging was also very neat and safe.",
      rating: 5
    },
    {
      name: "Dr. Farhan",
      role: "Verified Customer",
      comment: "Oud Un Naeemi is comparable to high-end perfumes costing three times more. Very rich, long lasting, and great presentation.",
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
            Original Perfumes & Pure Attars
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight font-serif text-stone-850 leading-tight">
            Scents That Leave <br />
            <span className="gold-gradient-text">A Lasting Impression</span>
          </h1>

          <div className="space-y-3">
            <p className="text-lg md:text-2xl font-bold italic text-amber-700/90 font-serif border-l-2 border-amber-500/40 pl-3">
              "Naeemi Naam Hai Mohabbat Ka"
            </p>
            <p className="text-xs md:text-sm text-stone-500 leading-relaxed font-medium">
              Premium, long-lasting perfumes and pure attars made with high-quality oils. From rich Oud to fresh and sweet floral notes, find the perfect scent for every day and special occasions.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link href="/shop" className="px-6 py-3.5 rounded-2xl gold-btn font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all">
              Shop All Perfumes
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="px-6 py-3.5 rounded-2xl border border-stone-200 bg-white/40 backdrop-blur-md text-stone-700 font-bold text-xs hover:bg-white/60 transition-all"
            >
              Our Story
            </Link>
          </div>
        </div>

             {/* RIGHT COLUMN: Cinematic 3D Perfume Podium */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center min-h-[450px] select-none z-10 md:mt-0 mt-8">
          
          {/* Volumetric Spotlight beam descending onto the pedestal */}
          <div className="absolute top-[-100px] w-72 h-[500px] bg-gradient-to-b from-amber-300/15 via-amber-200/5 to-transparent blur-xl pointer-events-none" />

          {/* Golden background halo radial gradient glow */}
          <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-amber-300/25 via-amber-100/10 to-transparent blur-3xl animate-pulse pointer-events-none" />

          {/* Floating fine gold light orbits */}
          <div className="absolute w-96 h-48 rounded-full border border-amber-500/10 rotate-[-15deg] scale-[1.15] animate-[spin_30s_linear_infinite] pointer-events-none" />
          <div className="absolute w-80 h-40 rounded-full border border-amber-400/20 rotate-[10deg] scale-[0.95] animate-[spin_25s_linear_infinite_reverse] pointer-events-none" />

          {/* 3D Pedestal Construct */}
          <div className="relative flex flex-col items-center justify-center w-full">
            
            {/* LARGE PERFUME BOTTLE: Highlighted scale, floats gently on hover */}
            <div className="relative z-30 transition-all duration-700 hover:-translate-y-4 cursor-pointer select-none -mb-32 w-full max-w-[360px] h-[380px] md:h-[440px]">
              <Image
                src="/heroimg.webp"
                alt="Naeemi Fragrance Premium Bottle"
                fill
                priority
                sizes="(max-width: 768px) 80vw, 360px"
                className="object-contain drop-shadow-[0_30px_60px_rgba(180,135,30,0.45)]"
              />
              
              {/* Gold Specular Light Streak overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/0 via-white/15 to-white/0 rounded-full mix-blend-overlay pointer-events-none" />
            </div>

            {/* LUXURY LAYERED 3D PEDESTAL (Marble & Gold Core) */}
            <div className="relative w-80 h-36 flex flex-col items-center justify-start pointer-events-none">
              
              {/* TIER 3 (Top Gold Cap): Sits directly under the bottle base */}
              <div className="absolute top-0 z-20 w-52 h-10 rounded-full bg-gradient-to-b from-amber-100 to-amber-300 border border-amber-300/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),_0_2px_10px_rgba(180,130,40,0.25)] flex items-center justify-center">
                <div className="w-[96%] h-[88%] rounded-full border border-white/50 bg-gradient-to-b from-white/30 to-amber-200/20" />
              </div>
              <div className="absolute top-5 z-10 w-52 h-6 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-b border-amber-500/30" />

              {/* TIER 2 (Middle Marble Stand): Glassmorphic marble cylinder */}
              <div className="absolute top-6 z-10 w-68 h-16 rounded-full bg-gradient-to-b from-stone-50/95 via-stone-100/90 to-amber-50/70 border border-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),_0_8px_20px_rgba(180,130,40,0.18)]" />
              <div className="absolute top-14 w-68 h-10 rounded-full bg-gradient-to-b from-stone-200 via-stone-300 to-amber-100/50 border-b border-stone-350/30" />

              {/* TIER 1 (Base Gold Ring): Wide metallic base */}
              <div className="absolute top-18 w-76 h-10 rounded-full bg-gradient-to-b from-amber-200 to-amber-400 border border-amber-400/20 shadow-[0_12px_24px_rgba(160,110,30,0.25)]" />

              {/* Soft ground ambient occlusion shadow */}
              <div className="absolute top-22 w-80 h-14 bg-amber-950/25 rounded-full blur-lg" />
            </div>
            
          </div>
        </div>     
      </section>

      {/* SECTION 2: SCENT CATEGORIES */}
      <section className="space-y-4">
        <div className="text-center max-w-md mx-auto space-y-1">
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">Shop By Category</h2>
          <p className="text-xs text-stone-500">Choose the fragrance style you like best</p>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2">
          <div className="space-y-1">
            <h2 className="text-lg md:text-2xl font-black text-stone-800 tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600 fill-amber-500/20 animate-pulse" />
              Featured Perfumes
            </h2>
            <p className="text-[10px] md:text-xs text-stone-500 font-medium">Our most popular and highly recommended fragrances</p>
          </div>
          <Link href="/shop" className="text-xs font-extrabold text-amber-800 hover:text-amber-700 flex items-center gap-1 transition-colors shrink-0 self-start sm:self-auto">
            View All Products
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
            Why Choose Naeemi Fragrance?
          </h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            We use high-quality imported fragrance oils so your perfume smells amazing and stays long.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/40 border border-white/60 p-5 rounded-2xl space-y-2.5 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-800 text-sm">12+ Hours Long Lasting</h3>
            <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
              High oil concentration means our scents easily last throughout the entire day on your clothes.
            </p>
          </div>

          <div className="bg-white/40 border border-white/60 p-5 rounded-2xl space-y-2.5 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-800 text-sm">100% Pure Quality</h3>
            <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
              No cheap chemicals or harsh alcohol smell — only smooth, rich, and skin-friendly fragrance oils.
            </p>
          </div>

          <div className="bg-white/40 border border-white/60 p-5 rounded-2xl space-y-2.5 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-800 text-sm">Packed With Care</h3>
            <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
              As our slogan says, "Naam Hai Mohabbat Ka" — every single order is personally checked and safely packed.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: BRAND STORY */}
      <section id="story" className="relative overflow-hidden rounded-[32px] glass-panel border border-white/50 p-8 md:p-12 flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-1 space-y-4">
          <span className="text-[10px] font-bold tracking-widest text-amber-700 uppercase">About Our Brand</span>
          <h2 className="text-3xl font-extrabold text-stone-800 font-serif">"Naeemi Naam Hai Mohabbat Ka"</h2>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            Naeemi Fragrance was started with a simple vision: to bring authentic Arabic Ouds and elegant French perfumes to people at honest and affordable prices.
          </p>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            We prepare our perfumes in small batches to ensure strict quality. Each bottle gives you an authentic, long-lasting scent that brings confidence, compliments, and joy.
          </p>
        </div>
        <div className="flex-1 w-full max-w-sm rounded-2xl bg-gradient-to-br from-amber-100/50 to-rose-100/50 border border-white p-6 space-y-4">
          <span className="text-[10px] font-bold text-amber-900/60 uppercase block">Our Quality Standards</span>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700">Customer Satisfaction</span>
              <span className="font-extrabold text-amber-800">98%</span>
            </div>
            <div className="w-full bg-white h-1.5 rounded-full">
              <div className="bg-amber-500 h-full w-[98%] rounded-full" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700">Fragrance Oil Concentration</span>
              <span className="font-extrabold text-amber-800">25% - 30%</span>
            </div>
            <div className="w-full bg-white h-1.5 rounded-full">
              <div className="bg-amber-500 h-full w-[88%] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: BEST SELLERS */}
      <section className="space-y-4">
        <div className="text-center max-w-md mx-auto space-y-1">
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">Best Sellers</h2>
          <p className="text-xs text-stone-500">Our customer favorites that people reorder the most</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {bestSellers.map((product, idx) => (
            <Link
              key={product.id || `bestseller-${idx}`}
              href={`/product/${product.id}`}
              className="group p-4 bg-white/40 border border-white/60 rounded-2xl hover:bg-white/70 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-stone-100">
                {product.imageUrl && product.imageUrl.startsWith("linear-gradient") ? (
                  <div className="absolute inset-0" style={{ background: product.imageUrl }} />
                ) : (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized={Boolean(product.imageUrl?.startsWith("data:"))}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
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
          <h2 className="text-2xl font-black text-stone-800 tracking-tight">Customer Reviews</h2>
          <p className="text-xs text-stone-500">See what our customers have to say about Naeemi Fragrance</p>
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
          <h2 className="text-3xl font-extrabold text-stone-800 font-serif">Get Special Offers & Updates</h2>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
            Subscribe to our newsletter to receive discount codes, new product updates, and special seasonal sales.
          </p>

          {newsletterSubscribed ? (
            <div className="mx-auto max-w-sm py-2 px-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4" /> Thank you! You are now subscribed to our latest offers.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="mx-auto max-w-md space-y-2">
              {newsletterError && (
                <div className="text-[10px] font-semibold text-rose-800 bg-rose-50 border border-rose-200/50 p-2 rounded-xl text-center">
                  {newsletterError}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-grow px-4 py-2.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none w-full"
                />
                <button
                  type="submit"
                  disabled={newsletterSubmitting}
                  className="px-5 py-2.5 rounded-xl gold-btn text-white font-bold text-xs w-full sm:w-auto shrink-0 flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {newsletterSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* SECTION 9: CONTACT INFO & CONNECT */}
      <section id="contact" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-4 border-t border-stone-200/50">
        {/* Contact info list */}
        <div className="md:col-span-5 space-y-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-stone-800 text-lg">Contact Us</h3>
            <p className="text-xs text-stone-500">Have questions or need help placing an order? We are here to help.</p>
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
              <span>naeemifragrance@gmail.com</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500">
                <MapPin className="w-4 h-4" />
              </div>
              <span>Bin Qasim Town Karachi Pakistan</span>
            </div>
          </div>
        </div>

        {/* Short inquiry submission form */}
        <div className="md:col-span-7">
          {contactSubmitted ? (
            <div className="p-6 text-center bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-3xl space-y-2 animate-fadeIn">
              <Check className="w-8 h-8 mx-auto stroke-[2.5] text-emerald-600" />
              <h4 className="font-bold text-sm">Message Sent!</h4>
              <p className="text-xs text-emerald-750 font-medium">Thank you. Our team will contact you shortly.</p>
            </div>
          ) : (
            <form
              onSubmit={handleContactSubmit}
              className="bg-white/40 border border-white/60 p-5 rounded-3xl space-y-3.5"
            >
              {contactError && (
                <div className="text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200/50 p-3 rounded-xl text-center">
                  {contactError}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 shadow-sm transition-all"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 shadow-sm transition-all"
                />
              </div>

              <input
                type="tel"
                required
                placeholder="Phone Number"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 shadow-sm transition-all"
              />

              <textarea
                required
                rows={3}
                placeholder="Your message or inquiry..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 shadow-sm transition-all resize-none min-h-[70px] leading-relaxed"
              />

              <button
                type="submit"
                disabled={contactSubmitting}
                className="w-full py-2.5 rounded-xl gold-btn text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {contactSubmitting ? (
                  <Loader className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
