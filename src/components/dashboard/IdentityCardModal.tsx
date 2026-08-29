"use client";

import React from "react";
import { UserProfile } from "@/engine/schema";
import { X, Shield, Award, Edit3, Fingerprint, Calendar, UserCheck } from "lucide-react";

interface IdentityCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onOpenEditProfile: () => void;
}

export function IdentityCardModal({
  isOpen,
  onClose,
  profile,
  onOpenEditProfile,
}: IdentityCardModalProps) {
  if (!isOpen || !profile) return null;

  const fullName = [profile.firstName, profile.middleName, profile.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-noir-950 border-2 border-noir-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
        {/* Card Header Ribbon */}
        <div className="bg-gradient-to-r from-thread-950 via-thread-900 to-thread-950 border-b border-thread-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-thread-900 border-2 border-thread-400 flex items-center justify-center text-thread-200 font-serif font-bold text-xl shadow-noir-glow">
              Ψ
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-thread-400 font-bold uppercase block">
                SPECIAL HOMICIDE DIVISION
              </span>
              <h2 className="text-base font-serif font-bold text-noir-100 tracking-wider">
                TELLTALE INVESTIGATOR BADGE
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-noir-400 hover:text-noir-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6 bg-gradient-to-b from-noir-900 to-noir-950">
          {/* Top Identifier Row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar / Monogram Box */}
            <div className="w-24 h-28 rounded-lg bg-noir-950 border-2 border-noir-700 flex flex-col items-center justify-center text-center p-2 shrink-0 shadow-inner relative overflow-hidden">
              <div className="absolute top-1 right-1 text-noir-800">
                <Fingerprint size={32} />
              </div>
              <span className="font-serif font-bold text-2xl text-thread-400 tracking-wider">
                {profile.firstName?.[0]}{profile.lastName?.[0]}
              </span>
              <span className="text-[9px] font-mono text-noir-400 uppercase mt-1">
                {profile.detectiveId || "DET-1001"}
              </span>
            </div>

            {/* Detective Metadata */}
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div>
                <span className="text-[10px] font-mono text-noir-500 uppercase block">
                  LEAD INVESTIGATOR
                </span>
                <h3 className="text-xl font-serif font-bold text-noir-100 tracking-wide">
                  {fullName}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-noir-300 pt-1">
                <div>
                  <span className="text-[10px] text-noir-500 block">AGE & GENDER</span>
                  <span>{profile.age} YRS • {profile.gender}</span>
                </div>
                <div>
                  <span className="text-[10px] text-noir-500 block">BADGE ID</span>
                  <span className="text-thread-400 font-bold">{profile.detectiveId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Aliases & Code Names */}
          <div className="bg-noir-950 p-3 rounded-lg border border-noir-850 space-y-1.5">
            <span className="text-[10px] font-mono text-noir-500 uppercase block">
              RECOGNIZED CODE NAMES / ALIASES
            </span>
            <div className="flex flex-wrap gap-1.5">
              {profile.aliases && profile.aliases.length > 0 ? (
                profile.aliases.map((alias) => (
                  <span
                    key={alias}
                    className="px-2 py-0.5 rounded bg-thread-950 border border-thread-800 text-[11px] font-mono text-thread-300 font-semibold"
                  >
                    “{alias}”
                  </span>
                ))
              ) : (
                <span className="text-xs font-mono text-noir-600 italic">None assigned</span>
              )}
            </div>
          </div>

          {/* Service Statistics */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-noir-950 border border-noir-850 text-center">
              <span className="text-[10px] font-mono text-noir-500 uppercase block">CASES SOLVED</span>
              <span className="text-lg font-serif font-bold text-emerald-400">
                {profile.casesSolved || 0}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-noir-950 border border-noir-850 text-center">
              <span className="text-[10px] font-mono text-noir-500 uppercase block">INVESTIGATIONS</span>
              <span className="text-lg font-serif font-bold text-thread-400">
                {profile.casesStarted || 0}
              </span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-noir-850 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-noir-500">
              <Calendar size={12} />
              <span>ISSUED: {new Date(profile.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenEditProfile();
              }}
              className="px-3 py-1.5 rounded bg-noir-850 border border-noir-700 hover:bg-noir-800 text-xs font-mono text-noir-200 flex items-center gap-1.5 transition-colors"
            >
              <Edit3 size={13} />
              <span>Edit Credentials</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
