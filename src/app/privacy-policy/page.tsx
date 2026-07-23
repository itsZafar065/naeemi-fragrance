"use client";

import React from "react";
import { FileText, Shield, Key, Sparkles, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 text-stone-850 animate-fadeIn mt-4">
      {/* Header */}
      <section className="text-center space-y-3 pb-4 border-b border-stone-200/40">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[10px] font-extrabold tracking-widest uppercase">
          <FileText className="w-3.5 h-3.5 text-amber-600" />
          Legal Specifications
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight font-serif text-stone-800">
          Terms of Service & <span className="gold-gradient-text">Privacy Policy</span>
        </h1>
        <p className="text-xs md:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
          How we safeguard your personal profiles, shipping logs, and transactional records.
        </p>
      </section>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-4">
        {/* Left Side: Policy Cards */}
        <div className="md:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-[28px] border border-white/50 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">Data Safety</p>
                <p className="text-xs font-bold text-stone-800">100% Encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">Privacy Access</p>
                <p className="text-xs font-bold text-stone-800">Secure JWT Session</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider">Third-Party Sharing</p>
                <p className="text-xs font-bold text-stone-800">Never Shared / Sold</p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-[28px] text-[11px] text-stone-500 leading-relaxed text-center italic">
            "Your secure checkout logs are purged and kept strictly within our protected databases."
          </div>
        </div>

        {/* Right Side: Detailed Copy */}
        <div className="md:col-span-8 space-y-6 text-xs text-stone-600 leading-relaxed">
          <div className="glass-panel p-6 rounded-[32px] border border-white/50 space-y-4">
            <h3 className="text-sm font-extrabold text-stone-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              1. Privacy Commitment
            </h3>
            <p>
              Naeemi Fragrance is dedicated to protecting customer privacy. We collect billing names, shipping addresses, verified emails, and contact numbers strictly to process and deliver orders. All session cookie logs are verified via high-entropy JSON Web Tokens (JWT).
            </p>
          </div>

          <div className="glass-panel p-6 rounded-[32px] border border-white/50 space-y-4">
            <h3 className="text-sm font-extrabold text-stone-800">2. Customer Account Safety</h3>
            <p>
              When you register an account on our app, all password hashes are processed using state-of-the-art secure hashing algorithms (`bcryptjs`). We do not have access to your plain-text passwords. You can permanently delete your profile record and checkout histories at any time from your profile dashboard shipping settings.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-[32px] border border-white/50 space-y-4">
            <h3 className="text-sm font-extrabold text-stone-800">3. Terms of Service</h3>
            <p>
              By accessing the Naeemi Fragrance platform and placing orders, you agree to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide accurate recipient names, active mobile contacts, and valid shipping addresses.</li>
              <li>Acknowledge that payment slips uploaded for bank or mobile wallet transactions are verified manually before packaging and dispatch.</li>
              <li>Agree that cash-on-delivery payments must be handed over to the logistics representative in full upon order delivery.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
