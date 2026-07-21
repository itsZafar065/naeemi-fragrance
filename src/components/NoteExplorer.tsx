"use client";

import React, { useState } from "react";
import { Sparkles, Heart, Trees, HelpCircle } from "lucide-react";

interface NoteExplorerProps {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
}

export const NoteExplorer: React.FC<NoteExplorerProps> = ({ topNotes, heartNotes, baseNotes }) => {
  const [activeSection, setActiveSection] = useState<"top" | "heart" | "base" | null>("top");

  const sections = [
    {
      id: "top" as const,
      title: "Top Notes (Opening)",
      description: "Initial Impression: Light, fresh scents experienced immediately upon spraying.",
      notes: topNotes,
      icon: Sparkles,
      color: "bg-amber-50 text-amber-700 border-amber-200/50",
      gradient: "from-amber-100/50 to-orange-50/50",
    },
    {
      id: "heart" as const,
      title: "Heart Notes (Core)",
      description: "Heart Core: The main character of the perfume, unfolding after 15 minutes.",
      notes: heartNotes,
      icon: Heart,
      color: "bg-rose-50 text-rose-700 border-rose-200/50",
      gradient: "from-rose-100/50 to-pink-50/50",
    },
    {
      id: "base" as const,
      title: "Base Notes (Dry Down)",
      description: "Dry Down: Deep, grounding notes that stay on skin and fabric for hours.",
      notes: baseNotes,
      icon: Trees,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
      gradient: "from-emerald-100/50 to-teal-50/50",
    },
  ];

  return (
    <div className="rounded-3xl glass-panel p-5 space-y-4 border border-white/40">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/20 pb-3">
        <h3 className="font-bold text-stone-850 text-sm tracking-tight flex items-center gap-2">
          <span>Scent Notes Guide</span>
          <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-extrabold tracking-wider uppercase">
            Fragrance Notes
          </span>
        </h3>
        <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest font-serif">
          "Naeemi Naam Hai Mohabbat Ka"
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* Note Layers list */}
        <div className="flex flex-col justify-center space-y-2.5">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            const isSelected = activeSection === section.id;
            const widthClass = "w-full";

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`${widthClass} py-3.5 px-4.5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between ${
                  isSelected
                    ? "bg-white border-amber-500 shadow-md scale-[1.01] ring-1 ring-amber-500/10"
                    : "bg-white/40 border-stone-200/60 hover:bg-white/60 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${isSelected ? "bg-amber-100 text-amber-850" : "bg-stone-100 text-stone-500"}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-850 text-xs">
                      {section.title.split(" ")[0]} Notes
                    </h4>
                    <p className="text-[10px] text-stone-500 line-clamp-1 max-w-[150px] sm:max-w-none">
                      {section.notes.join(", ")}
                    </p>
                  </div>
                </div>
                <div className="text-[9px] text-stone-400 font-extrabold uppercase">
                  {idx === 0 ? "Opening" : idx === 1 ? "Core" : "Dry Down"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Section Details */}
        <div className="flex flex-col">
          {activeSection ? (
            (() => {
              const active = sections.find((s) => s.id === activeSection)!;
              const ActiveIcon = active.icon;

              return (
                <div className={`h-full rounded-2xl border border-stone-200/30 p-5 bg-gradient-to-br ${active.gradient} flex flex-col justify-between space-y-4`}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded-lg border ${active.color}`}>
                        <ActiveIcon className="w-3 h-3" />
                      </span>
                      <h4 className="font-bold text-stone-850 text-xs">{active.title}</h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed font-medium">
                      {active.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-stone-250/20">
                    <span className="text-[9px] font-extrabold text-stone-400 tracking-wider block uppercase">
                      Featured Notes
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {active.notes.map((note) => (
                        <span
                          key={note}
                          className="bg-white border border-stone-200/40 px-2.5 py-1 rounded-lg text-[10px] font-bold text-stone-800 shadow-xs"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-5 bg-white/20 border border-dashed border-stone-200 rounded-2xl text-stone-500">
              <HelpCircle className="w-6 h-6 text-stone-300 mb-1.5" />
              <p className="text-xs font-semibold">Select note layer to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
