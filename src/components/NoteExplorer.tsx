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
      title: "Top Notes (Head)",
      description: "First impression. Light, volatile scents that evaporate in 15-30 minutes.",
      notes: topNotes,
      icon: Sparkles,
      color: "bg-amber-50 text-amber-700 border-amber-200/50",
      gradient: "from-amber-100/50 to-orange-50/50",
    },
    {
      id: "heart" as const,
      title: "Heart Notes (Middle)",
      description: "The core identity. Emerges after top notes dissipate, lasting 2-4 hours.",
      notes: heartNotes,
      icon: Heart,
      color: "bg-rose-50 text-rose-700 border-rose-200/50",
      gradient: "from-rose-100/50 to-pink-50/50",
    },
    {
      id: "base" as const,
      title: "Base Notes (Dry Down)",
      description: "The lasting foundation. Deep, heavy molecules that anchor the scent, lasting 6+ hours.",
      notes: baseNotes,
      icon: Trees,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
      gradient: "from-emerald-100/50 to-teal-50/50",
    },
  ];

  return (
    <div className="rounded-3xl glass-panel p-6 space-y-5 border border-white/40">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-stone-800 text-md tracking-tight flex items-center gap-2">
          <span>Fragrance Pyramid</span>
          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium tracking-wider uppercase">
            Interactive
          </span>
        </h3>
        <span className="text-xs text-stone-500 italic">"Naeemi Naam Hai Mohabbat Ka"</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pyramid Diagram */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-3 relative">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            const isSelected = activeSection === section.id;
            // Widths to represent a pyramid triangle (top is narrowest, base is widest)
            const widthClass = idx === 0 ? "w-2/3 mx-auto" : idx === 1 ? "w-5/6 mx-auto" : "w-full";

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`${widthClass} py-4 px-5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between ${
                  isSelected
                    ? "bg-white border-amber-500 shadow-md scale-[1.02] ring-1 ring-amber-500/20"
                    : "bg-white/40 border-stone-200/60 hover:bg-white/60 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isSelected ? "bg-amber-100 text-amber-800" : "bg-stone-100/80 text-stone-500"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 text-xs tracking-wide">
                      {section.title.split(" ")[0]} Notes
                    </h4>
                    <p className="text-[10px] text-stone-500 line-clamp-1">
                      {section.notes.join(", ")}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-stone-400 font-medium">
                  {idx === 0 ? "15m" : idx === 1 ? "3h" : "6h+"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Section Details */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          {activeSection ? (
            (() => {
              const active = sections.find((s) => s.id === activeSection)!;
              const ActiveIcon = active.icon;

              return (
                <div className={`h-full rounded-2xl border border-stone-200/40 p-5 bg-gradient-to-br ${active.gradient} flex flex-col justify-between space-y-4`}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg border ${active.color}`}>
                        <ActiveIcon className="w-3.5 h-3.5" />
                      </span>
                      <h4 className="font-extrabold text-stone-800 text-sm">{active.title}</h4>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {active.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-stone-500 tracking-wider block uppercase">
                      Present Accord Ingredients
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {active.notes.map((note) => (
                        <span
                          key={note}
                          className="bg-white/80 border border-white/60 px-3 py-1 rounded-xl text-xs font-semibold text-stone-800 shadow-xs"
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
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white/20 border border-dashed border-stone-200 rounded-2xl text-stone-500">
              <HelpCircle className="w-8 h-8 text-stone-300 stroke-[1.5] mb-2" />
              <p className="text-xs font-medium">Click on any layer of the pyramid to view description and ingredients.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
