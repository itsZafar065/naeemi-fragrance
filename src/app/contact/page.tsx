"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Check, Send, Loader2, Sparkles } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setError(data.error || "Failed to dispatch inquiry. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please check connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12 text-stone-850 animate-fadeIn mt-4">
      
      {/* Header */}
      <section className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] font-extrabold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 fill-amber-600/30 text-amber-600" />
          Get In Touch
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight font-serif text-stone-800">
          Connect with <br />
          <span className="gold-gradient-text">Naeemi Vault</span>
        </h1>
        <p className="text-xs md:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
          Have questions about custom bridal gifting collections, bulk orders, or perfume longevity? Our support team is here to assist you.
        </p>
      </section>

      {/* Grid: Contact Details & Form */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Contact Information Cards (Col 5) */}
        <div className="md:col-span-5 space-y-5">
          <div className="glass-panel p-6 rounded-[32px] border border-white/50 space-y-5">
            <h3 className="font-extrabold text-[10px] uppercase tracking-widest text-stone-400">Head Office</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Call / WhatsApp Support</p>
                  <p className="text-xs font-bold text-stone-800">03092184760</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Email Inquiry</p>
                  <p className="text-xs font-bold text-stone-800">naeemifragrance@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Vault Location</p>
                  <p className="text-xs font-bold text-stone-850">Bin Qasim Town Karachi Pakistan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map of Bin Qasim Town, Karachi */}
          <div className="glass-panel p-2 rounded-[32px] border border-white/50 overflow-hidden aspect-video relative shadow-md">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115939.81432415174!2d67.24765660856018!3d24.842776882200388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb349cae20340d3%3A0xc3317769e6b4d32a!2sBin%20Qasim%20Town%2C%20Karachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1721743516000!5m2!1sen!2s" 
              className="w-full h-full rounded-[26px] border-0" 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-[28px] text-[11px] text-stone-500 leading-relaxed text-center italic">
            "We aim to respond to all inquiries via email or WhatsApp within 24 hours of submission."
          </div>
        </div>

        {/* Right Side: Interactive Inquiry Form (Col 7) */}
        <div className="md:col-span-7">
          {success ? (
            <div className="p-8 text-center bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-[36px] space-y-3.5 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h4 className="font-extrabold text-base font-serif">Inquiry Dispatched!</h4>
              <p className="text-xs text-emerald-700 max-w-xs mx-auto leading-relaxed">
                Thank you for reaching out. A copy of your details has been forwarded to the Naeemi care team. We will get back to you shortly.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="text-[10px] text-emerald-800 font-bold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-[36px] border border-white/50 space-y-4">
              <h3 className="font-extrabold text-[10px] uppercase tracking-widest text-stone-400">Direct Message</h3>
              
              {error && (
                <div className="text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200/50 p-3.5 rounded-xl text-center">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 shadow-sm transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 shadow-sm transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 shadow-sm transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-stone-500">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/10 shadow-sm transition-all resize-none min-h-[90px] leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl gold-btn text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Scent Inquiry...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
