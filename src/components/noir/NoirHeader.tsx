"use client";

import React from "react";
import { Volume2, VolumeX, RotateCcw, ShieldAlert, ArrowLeft } from "lucide-react";
import { ActiveTab } from "@/lib/store/useGameStore";

interface NoirHeaderProps {
  caseNumber: string;
  title: string;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAudioMuted: boolean;
  toggleAudio: () => void;
  onReturnToDashboard: () => void;
  onOpenAccusation: () => void;
  discoveredEvidenceCount: number;
  totalEvidenceCount: number;
}

export function NoirHeader({
  caseNumber,
  title,
  activeTab,
  setActiveTab,
  isAudioMuted,
  toggleAudio,
  onReturnToDashboard,
  onOpenAccusation,
  discoveredEvidenceCount,
  totalEvidenceCount,
}: NoirHeaderProps) {
  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: "BRIEFING", label: "Crime Scene", icon: "📁" },
    { id: "INTERROGATION", label: "Interrogation Room", icon: "🎙️" },
    { id: "EVIDENCE", label: `Evidence (${discoveredEvidenceCount}/${totalEvidenceCount})`, icon: "🔍" },
    { id: "TIMELINE", label: "Timeline", icon: "⏳" },
    { id: "NOTEBOOK", label: "Notebook", icon: "📓" },
    { id: "THEORY", label: "Hypotheses", icon: "⚖️" },
  ];

  return (
    <header className="border-b border-noir-800 bg-noir-950/95 backdrop-blur sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Case Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToDashboard}
            title="Return to Dashboard Docket"
            className="p-1.5 rounded bg-noir-900 border border-noir-800 text-noir-400 hover:text-noir-100 hover:border-noir-700 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="w-8 h-8 rounded bg-thread-900 border border-thread-600 flex items-center justify-center text-thread-300 font-serif font-bold text-base shadow-noir-glow">
            Ψ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-widest text-xs font-semibold text-thread-400 uppercase">
                TELLTALE
              </span>
              <span className="text-noir-600">•</span>
              <span className="text-xs font-mono px-1.5 py-0.5 bg-noir-850 border border-noir-750 text-noir-300 rounded">
                {caseNumber || "CASE #T-1001"}
              </span>
            </div>
            <h1 className="text-sm md:text-base font-serif font-bold text-noir-100 tracking-wide">
              {title || "The Glass Pavilion Case"}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={toggleAudio}
            title={isAudioMuted ? "Unmute Rain Ambience" : "Mute Rain Ambience"}
            className={`p-2 rounded border text-xs flex items-center gap-1.5 transition-colors ${
              !isAudioMuted
                ? "border-thread-700 bg-thread-950/60 text-thread-300"
                : "border-noir-800 bg-noir-900 text-noir-400 hover:text-noir-200"
            }`}
          >
            {!isAudioMuted ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span className="hidden sm:inline font-mono">RAIN</span>
          </button>

          {/* Final Accusation CTA */}
          <button
            onClick={onOpenAccusation}
            className="px-3.5 py-1.5 rounded border border-thread-600 bg-gradient-to-r from-thread-900 to-thread-800 text-thread-100 hover:from-thread-800 hover:to-thread-700 font-serif font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-noir-glow transition-all"
          >
            <ShieldAlert size={14} className="text-thread-400" />
            <span>Make Final Accusation</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-noir-900 py-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded text-xs font-mono font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${
                isActive
                  ? "bg-noir-850 border-thread-700/80 text-thread-300 shadow-inner"
                  : "bg-transparent border-transparent text-noir-400 hover:text-noir-200 hover:bg-noir-900"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
