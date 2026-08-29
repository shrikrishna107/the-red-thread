"use client";

import React, { useState } from "react";
import { UserProfile, InvestigationSummary, Difficulty } from "@/engine/schema";
import { CaseCard } from "./CaseCard";
import {
  Plus,
  Shield,
  BadgeAlert,
  FolderOpen,
  LogOut,
  Sparkles,
  FileText,
  UserCheck,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";

interface DetectiveDashboardProps {
  profile: UserProfile;
  investigations: InvestigationSummary[];
  isGeneratingCase: boolean;
  onNewCase: (difficulty: Difficulty, useTestLillyCase?: boolean) => Promise<void>;
  onResumeCase: (investigationId: string) => void;
  onDeleteCase: (investigationId: string) => void;
  onOpenIdentityCard: () => void;
  onOpenEditProfile: () => void;
  onLogout: () => void;
}

export function DetectiveDashboard({
  profile,
  investigations,
  isGeneratingCase,
  onNewCase,
  onResumeCase,
  onDeleteCase,
  onOpenIdentityCard,
  onOpenEditProfile,
  onLogout,
}: DetectiveDashboardProps) {
  const [filterTab, setFilterTab] = useState<"ALL" | "ACTIVE" | "PENDING" | "SOLVED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("Medium");

  const filteredCases = investigations.filter((item) => {
    if (filterTab === "ACTIVE" && item.status !== "ACTIVE") return false;
    if (filterTab === "PENDING" && item.status !== "PENDING" && item.status !== "PAUSED") return false;
    if (filterTab === "SOLVED" && item.status !== "SOLVED") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.victimName.toLowerCase().includes(q) ||
        item.caseNumber.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-noir-950 text-noir-100 flex flex-col selection:bg-thread-900 selection:text-thread-100">
      {/* Top Banner */}
      <header className="border-b border-noir-850 bg-noir-900/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-thread-950 border border-thread-600 flex items-center justify-center font-serif font-bold text-thread-400 text-lg shadow-noir-glow">
              Ψ
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-thread-400 uppercase font-semibold block">
                TELLTALE HOMICIDE DESK
              </span>
              <h1 className="text-xl font-serif font-bold text-noir-100">
                Hello! Detective {profile.lastName || "Investigator"}
              </h1>
            </div>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenIdentityCard}
              className="px-3 py-2 rounded bg-noir-850 border border-noir-700 hover:border-noir-600 text-xs font-mono text-noir-200 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <UserCheck size={14} className="text-thread-400" />
              <span>Identity Card</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded bg-noir-850 border border-noir-700 hover:border-thread-700 text-noir-400 hover:text-thread-300 transition-colors"
              title="Log Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-8">
        {/* Actions Bar & Generator CTA */}
        <div className="bg-gradient-to-r from-noir-900 via-noir-850 to-noir-900 border border-noir-800 rounded-xl p-6 shadow-dossier flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-thread-400 mb-1">
              <Sparkles size={13} />
              <span>DETERMINISTIC CASE GENERATOR</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-noir-100">
              Open a New Homicide File
            </h2>
            <p className="text-xs text-noir-400 font-sans leading-relaxed">
              Generate a completely fresh murder case with locked truth, full timelines, and complex suspect psychology.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Difficulty Selector */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty)}
              className="px-3 py-2.5 rounded bg-noir-950 border border-noir-700 text-xs font-mono text-noir-200 outline-none"
            >
              <option value="Easy">Difficulty: Easy</option>
              <option value="Medium">Difficulty: Medium</option>
              <option value="Hard">Difficulty: Hard</option>
              <option value="Expert">Difficulty: Expert</option>
            </select>

            {/* Primary Generate Case Button */}
            <button
              onClick={() => onNewCase(selectedDifficulty, false)}
              disabled={isGeneratingCase}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-thread-900 via-thread-800 to-thread-900 border border-thread-600 text-thread-100 font-serif font-bold text-xs uppercase tracking-wider hover:from-thread-800 hover:to-thread-700 shadow-noir-glow flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isGeneratingCase ? (
                <>
                  <Loader2 size={14} className="animate-spin text-thread-400" />
                  <span>Generating Case Truth...</span>
                </>
              ) : (
                <>
                  <Plus size={15} />
                  <span>NEW CASE</span>
                </>
              )}
            </button>

            {/* Starter Case Button */}
            <button
              onClick={() => onNewCase("Medium", true)}
              disabled={isGeneratingCase}
              className="px-3.5 py-2.5 rounded bg-noir-850 border border-noir-700 hover:border-noir-600 text-xs font-mono text-noir-300 hover:text-noir-100 transition-colors"
              title="Play handcrafted master case"
            >
              Lilly Mehra (Starter Case)
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-noir-850 pb-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {(["ALL", "ACTIVE", "PENDING", "SOLVED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3.5 py-1.5 rounded text-xs font-mono font-semibold uppercase tracking-wider border transition-all ${
                  filterTab === tab
                    ? "bg-noir-850 border-thread-700 text-thread-300 shadow-inner"
                    : "bg-noir-950 border-noir-850 text-noir-400 hover:text-noir-200"
                }`}
              >
                {tab} ({tab === "ALL" ? investigations.length : investigations.filter((i) => tab === "ACTIVE" ? i.status === "ACTIVE" : tab === "SOLVED" ? i.status === "SOLVED" : i.status !== "ACTIVE" && i.status !== "SOLVED").length})
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search docket by title, victim, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 pl-8 pr-3 py-1.5 bg-noir-950 border border-noir-800 focus:border-thread-700 rounded text-xs text-noir-200 placeholder-noir-600 outline-none font-sans"
            />
            <Search size={13} className="absolute left-2.5 top-2.5 text-noir-600" />
          </div>
        </div>

        {/* Case Cards Grid */}
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-noir-800 rounded-xl space-y-3">
            <FolderOpen size={36} className="text-noir-600 mx-auto" />
            <h3 className="text-base font-serif font-bold text-noir-300">
              No Cases in this Docket
            </h3>
            <p className="text-xs text-noir-500 font-sans max-w-sm mx-auto">
              Click "NEW CASE" above to generate your next homicide investigation.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCases.map((summary) => (
              <CaseCard
                key={summary.investigationId}
                summary={summary}
                onResume={onResumeCase}
                onDelete={onDeleteCase}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
