"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/firebase/authContext";
import { FileText, Plus, X, ShieldCheck, BadgeHelp, ArrowRight } from "lucide-react";

interface ApplicationFormModalProps {
  isOpen: boolean;
  onComplete?: () => void;
}

export function ApplicationFormModal({ isOpen, onComplete }: ApplicationFormModalProps) {
  const { saveProfile, user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<number | "">(32);
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [aliasInput, setAliasInput] = useState("");
  const [aliases, setAliases] = useState<string[]>(["Shadow", "Ace"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddAlias = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (("key" in e && e.key === "Enter") || e.type === "click") {
      e.preventDefault();
      if (aliasInput.trim() && !aliases.includes(aliasInput.trim())) {
        setAliases([...aliases, aliasInput.trim()]);
        setAliasInput("");
      }
    }
  };

  const handleRemoveAlias = (tag: string) => {
    setAliases(aliases.filter((a) => a !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !age || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await saveProfile({
        firstName: firstName.trim(),
        middleName: middleName.trim() || undefined,
        lastName: lastName.trim(),
        age: Number(age),
        gender,
        aliases,
        detectiveId: `DET-${Math.floor(1000 + Math.random() * 9000)}`,
      });
      if (onComplete) onComplete();
    } catch (err) {
      console.error("Profile save error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-noir-900 border border-noir-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in duration-200">
        {/* Top Header */}
        <div className="p-4 bg-noir-950 border-b border-noir-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-thread-400" />
            <span className="font-serif font-bold text-sm tracking-wider uppercase text-noir-100">
              MY APPLICATION
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-noir-850 px-2 py-0.5 rounded border border-noir-700 text-noir-400">
            DETECTIVE ONBOARDING
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-noir-400 font-sans leading-relaxed">
            Enter your official investigator credentials. This will issue your in-universe Identity Card and initialize your case docket.
          </p>

          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-noir-300 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 bg-noir-950 border border-noir-700 focus:border-thread-600 rounded text-xs text-noir-100 outline-none font-sans"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-noir-400 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                placeholder="(Optional)"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-full px-3 py-2 bg-noir-950 border border-noir-700 focus:border-thread-600 rounded text-xs text-noir-100 outline-none font-sans"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-noir-300 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sterling"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 bg-noir-950 border border-noir-700 focus:border-thread-600 rounded text-xs text-noir-100 outline-none font-sans"
              />
            </div>
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-noir-300 mb-1">
                Age *
              </label>
              <input
                type="number"
                required
                min={18}
                max={99}
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2 bg-noir-950 border border-noir-700 focus:border-thread-600 rounded text-xs text-noir-100 outline-none font-sans"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-noir-300 mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 bg-noir-950 border border-noir-700 focus:border-thread-600 rounded text-xs text-noir-100 outline-none font-sans"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Code Name / Aliases */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-noir-300 mb-1">
              Code Name / Aliases (Press Enter or + to add)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Shadow, Sherlock, Hawk..."
                value={aliasInput}
                onChange={(e) => setAliasInput(e.target.value)}
                onKeyDown={handleAddAlias}
                className="flex-1 px-3 py-2 bg-noir-950 border border-noir-700 focus:border-thread-600 rounded text-xs text-noir-100 outline-none font-sans"
              />
              <button
                type="button"
                onClick={handleAddAlias}
                className="px-3 py-2 rounded bg-noir-850 border border-noir-700 text-noir-200 hover:bg-noir-800 text-xs font-mono"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Aliases Tag Cloud */}
            <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded bg-noir-950 border border-noir-850">
              {aliases.map((alias) => (
                <span
                  key={alias}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-thread-950 border border-thread-800 text-[11px] font-mono text-thread-300"
                >
                  <span>{alias}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAlias(alias)}
                    className="hover:text-thread-100"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
              {aliases.length === 0 && (
                <span className="text-[11px] text-noir-600 font-mono italic">
                  No aliases added yet.
                </span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-noir-800 flex justify-end">
            <button
              type="submit"
              disabled={!firstName.trim() || !lastName.trim() || !age || isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-thread-900 via-thread-800 to-thread-900 border border-thread-600 text-thread-100 hover:from-thread-800 hover:to-thread-700 font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-noir-glow disabled:opacity-50 transition-all"
            >
              <span>Issue Identity Card & Enter Docket</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
