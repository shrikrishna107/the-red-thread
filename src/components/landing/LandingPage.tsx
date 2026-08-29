"use client";

import React from "react";
import { Shield, Sparkles, Brain, Eye, FileText, ArrowRight, Lock, Users, Compass } from "lucide-react";

interface LandingPageProps {
  onStartInterrogation: () => void;
}

export function LandingPage({ onStartInterrogation }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-noir-950 text-noir-100 flex flex-col justify-between selection:bg-thread-900 selection:text-thread-100 overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-thread-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-noir-800/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-noir-900/80 bg-noir-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-thread-950 border border-thread-600 flex items-center justify-center font-serif font-bold text-thread-400 text-base shadow-noir-glow">
              Ψ
            </div>
            <span className="font-serif font-bold text-lg tracking-widest text-noir-100 uppercase">
              TELLTALE
            </span>
          </div>

          <button
            onClick={onStartInterrogation}
            className="px-4 py-2 rounded bg-thread-900 border border-thread-600 text-thread-100 hover:bg-thread-800 text-xs font-mono font-semibold uppercase tracking-wider shadow-noir-glow transition-all flex items-center gap-2"
          >
            <span>Log In / Register</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-noir-900 border border-noir-800 text-xs font-mono text-thread-400 mb-2">
          <Sparkles size={12} className="text-thread-500" />
          <span>AI-Driven Interactive Detective Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-noir-100 tracking-tight leading-[1.1]">
          Every case has a truth. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-thread-400 via-thread-200 to-amber-200">
            Every suspect has a story.
          </span>
        </h1>

        <p className="text-base sm:text-lg font-sans text-noir-300 max-w-2xl mx-auto leading-relaxed">
          The murder has already happened. The canonical timeline, forensic traces, hidden motives, and lies are locked before you begin. You can ask literally anything. The question is whether you can figure out what happened.
        </p>

        {/* Primary CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartInterrogation}
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-thread-900 via-thread-800 to-thread-900 border border-thread-500 text-thread-100 hover:from-thread-800 hover:to-thread-700 font-serif font-bold text-sm tracking-widest uppercase shadow-2xl hover:shadow-noir-glow transition-all flex items-center justify-center gap-3 group"
          >
            <span>LET'S INTERROGATE</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-16 text-left">
          <div className="p-5 rounded-lg bg-noir-900/60 border border-noir-850 space-y-2 hover:border-noir-750 transition-colors">
            <div className="w-9 h-9 rounded bg-thread-950 border border-thread-800 flex items-center justify-center text-thread-400 mb-3">
              <Brain size={18} />
            </div>
            <h3 className="font-serif font-bold text-base text-noir-100">Free-Form Natural Interrogation</h3>
            <p className="text-xs text-noir-400 font-sans leading-relaxed">
              No preset dialogue trees. Type any question, challenge alibis, corner contradictions, or observe physical body language tells.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-noir-900/60 border border-noir-850 space-y-2 hover:border-noir-750 transition-colors">
            <div className="w-9 h-9 rounded bg-noir-800 border border-noir-750 flex items-center justify-center text-noir-300 mb-3">
              <Lock size={18} />
            </div>
            <h3 className="font-serif font-bold text-base text-noir-100">Immutable Locked Truth</h3>
            <p className="text-xs text-noir-400 font-sans leading-relaxed">
              The AI never invents or alters the killer during play. Truth is authored and validated before your investigation begins.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-noir-900/60 border border-noir-850 space-y-2 hover:border-noir-750 transition-colors">
            <div className="w-9 h-9 rounded bg-noir-800 border border-noir-750 flex items-center justify-center text-noir-300 mb-3">
              <Users size={18} />
            </div>
            <h3 className="font-serif font-bold text-base text-noir-100">Multi-Entity Crime Desk</h3>
            <p className="text-xs text-noir-400 font-sans leading-relaxed">
              Interrogate psychological suspects, request procedural police gate logs, and consult the forensics and medical department.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-noir-900 py-6 text-center text-xs font-mono text-noir-500">
        <p>TELLTALE © 2026 — Interactive AI Detective Investigation Platform</p>
      </footer>
    </div>
  );
}
