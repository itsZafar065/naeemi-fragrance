"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, MessageCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is the average longevity of Naeemi fragrances?",
      answer: "Our fragrances are formulated at Extrait de Parfum strength, utilizing high-grade imported essential oils. On average, they project strongly for 3-4 hours and last on skin for 8-12 hours, and up to 24+ hours on clothing."
    },
    {
      question: "Can I test the fragrance before keeping it?",
      answer: "Yes, you can spray the perfume to test its scent profile and longevity. If you find the sillage or notes do not match your taste, you can request an exchange or refund under our 7-Day Return Policy."
    },
    {
      question: "How long does shipping take and what are the delivery charges?",
      answer: "Shipping takes 2-4 working days across Pakistan. Delivery is completely free for orders above Rs. 6,000. For orders below Rs. 6,000, we charge a standard delivery fee of Rs. 250."
    },
    {
      question: "What payment options are available?",
      answer: "We support nationwide Cash on Delivery (COD) for ultimate convenience. We also support advance payments via EasyPaisa, JazzCash, or Bank Transfer (simply upload your transaction slip screenshot during checkout)."
    },
    {
      question: "Can I request customized perfume gift boxes?",
      answer: "Yes! We specialize in premium bridal packages, corporate gifting, and customized wedding giveaways. Please contact our support team on WhatsApp at 03092184760 to discuss bulk discounts and custom packaging."
    },
    {
      question: "How should I store my perfumes to preserve their sillage?",
      answer: "Store your fragrance bottles in a cool, dry place away from direct sunlight and extreme temperature changes (like bathrooms). Keeping them inside their original box extends their shelf life and preserves essential oil projection."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-stone-850 animate-fadeIn mt-4">
      {/* Header */}
      <section className="text-center space-y-3 pb-4 border-b border-stone-200/40">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] font-extrabold tracking-widest uppercase">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          Got Questions?
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight font-serif text-stone-800">
          Frequently Asked <span className="gold-gradient-text">Questions</span>
        </h1>
        <p className="text-xs md:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
          Find answers to common questions about perfume concentrations, longevity, delivery, and payments.
        </p>
      </section>

      {/* Accordion List */}
      <div className="space-y-4 pt-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className="glass-panel rounded-2xl border border-white/50 overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="text-xs sm:text-sm font-extrabold text-stone-800 flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  {faq.question}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-stone-500 shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-500 shrink-0 ml-4" />
                )}
              </button>
              
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100/50 bg-stone-50/30 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Support CTA */}
      <div className="glass-panel p-6 rounded-[32px] border border-white/50 text-center space-y-3.5 mt-8 max-w-md mx-auto">
        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-700">
          <MessageCircle className="w-5 h-5" />
        </div>
        <h4 className="font-extrabold text-sm text-stone-800">Still have a question?</h4>
        <p className="text-[11px] text-stone-500 leading-relaxed">
          Our friendly support desk is active 24/7. Chat with us on WhatsApp or drop us an email directly.
        </p>
        <div className="flex justify-center gap-3 pt-1">
          <a href="https://wa.me/923092184760" className="px-4 py-2 rounded-xl gold-btn text-white font-bold text-[10px] shadow-sm">
            Chat on WhatsApp
          </a>
          <a href="mailto:naeemifragrance@gmail.com" className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-bold text-[10px] hover:bg-stone-50 transition-all">
            Email Support
          </a>
        </div>
      </div>
    </div>
  );
}
