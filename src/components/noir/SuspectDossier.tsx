"use client";

import React from "react";
import { ClientCharacter } from "@/lib/store/useGameStore";
import { User, Shield, FlaskConical, Eye, CheckCircle2 } from "lucide-react";

interface SuspectDossierProps {
  characters: ClientCharacter[];
  selectedCharacterId: string;
  onSelectCharacter: (charId: string) => void;
}

export function SuspectDossier({
  characters,
  selectedCharacterId,
  onSelectCharacter,
}: SuspectDossierProps) {
  const suspects = characters.filter((c) => c.role === "suspect");
  const witnesses = characters.filter((c) => c.role === "witness");

  return (
    <div className="flex flex-col gap-4">
      {/* Suspects Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs font-semibold tracking-wider text-noir-400 uppercase">
            Suspects ({suspects.length})
          </span>
          <span className="text-[10px] font-mono text-thread-400">PERSONS OF INTEREST</span>
        </div>
        <div className="space-y-2">
          {suspects.map((char) => {
            const isSelected = char.character_id === selectedCharacterId;
            const stress = char.current_state?.stress ?? 30;

            return (
              <button
                key={char.character_id}
                onClick={() => onSelectCharacter(char.character_id)}
                className={`w-full text-left p-3 rounded border transition-all relative overflow-hidden group ${
                  isSelected
                    ? "bg-noir-850 border-thread-600/90 shadow-noir-glow"
                    : "bg-noir-900/80 border-noir-800 hover:border-noir-700 hover:bg-noir-850"
                }`}
              >
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-thread-600" />
                )}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded flex items-center justify-center font-mono font-bold text-xs border ${
                        isSelected
                          ? "bg-thread-950 border-thread-700 text-thread-300"
                          : "bg-noir-800 border-noir-700 text-noir-300"
                      }`}
                    >
                      {char.avatar_code}
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-sm text-noir-100 group-hover:text-thread-200 transition-colors">
                        {char.name}
                      </h4>
                      <p className="text-xs text-noir-400 font-sans">
                        {char.occupation}
                      </p>
                    </div>
                  </div>

                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-thread-950/80 border border-thread-800/80 text-thread-400">
                    Suspect
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-noir-800/80 flex items-center justify-between text-[11px] font-mono text-noir-400">
                  <span className="truncate max-w-[140px] text-noir-400">
                    {char.relation_to_victim}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-noir-500">STRESS</span>
                    <div className="w-12 h-1.5 bg-noir-800 rounded-full overflow-hidden border border-noir-700">
                      <div
                        className={`h-full transition-all duration-500 ${
                          stress > 70
                            ? "bg-thread-500"
                            : stress > 45
                            ? "bg-amber-500"
                            : "bg-emerald-500/70"
                        }`}
                        style={{ width: `${stress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Witnesses */}
      {witnesses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-semibold tracking-wider text-noir-400 uppercase">
              Civilian Witnesses ({witnesses.length})
            </span>
          </div>
          <div className="space-y-2">
            {witnesses.map((char) => {
              const isSelected = char.character_id === selectedCharacterId;
              return (
                <button
                  key={char.character_id}
                  onClick={() => onSelectCharacter(char.character_id)}
                  className={`w-full text-left p-2.5 rounded border transition-all relative ${
                    isSelected
                      ? "bg-noir-850 border-noir-600 shadow-md"
                      : "bg-noir-900/60 border-noir-800 hover:border-noir-700 hover:bg-noir-850"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-noir-800 border border-noir-700 flex items-center justify-center font-mono font-bold text-xs text-noir-300">
                        {char.avatar_code}
                      </div>
                      <div>
                        <h4 className="font-serif font-semibold text-xs text-noir-200">
                          {char.name}
                        </h4>
                        <p className="text-[10px] text-noir-400 font-sans">
                          {char.occupation}
                        </p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-noir-800 border border-noir-700 text-noir-400">
                      Witness
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dedicated Police & Forensics Departments */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs font-semibold tracking-wider text-noir-400 uppercase">
            Investigation Departments
          </span>
          <span className="text-[10px] font-mono text-noir-500">CONSULT</span>
        </div>

        <div className="space-y-2">
          {/* Police / Lead Officer */}
          <button
            onClick={() => onSelectCharacter("witness-briggs")}
            className={`w-full text-left p-3 rounded border transition-all relative ${
              selectedCharacterId === "witness-briggs" || selectedCharacterId === "police-dept"
                ? "bg-noir-850 border-blue-600/80 shadow-md"
                : "bg-noir-900/70 border-noir-800 hover:border-noir-700 hover:bg-noir-850"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-300">
                  <Shield size={16} />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-xs text-noir-100">
                    Police & Scene Security
                  </h4>
                  <p className="text-[11px] text-noir-400 font-sans">
                    Officer Briggs • Gate Logs & Reports
                  </p>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-blue-950 border border-blue-800 text-blue-300">
                POLICE
              </span>
            </div>
          </button>

          {/* Forensics & Medical Dept */}
          <button
            onClick={() => onSelectCharacter("forensics-dept")}
            className={`w-full text-left p-3 rounded border transition-all relative ${
              selectedCharacterId === "forensics-dept"
                ? "bg-noir-850 border-amber-600/80 shadow-md"
                : "bg-noir-900/70 border-noir-800 hover:border-noir-700 hover:bg-noir-850"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-300">
                  <FlaskConical size={16} />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-xs text-noir-100">
                    Forensics & Pathology
                  </h4>
                  <p className="text-[11px] text-noir-400 font-sans">
                    Medical Examiner • Autopsy & Lab
                  </p>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-amber-950 border border-amber-800 text-amber-300">
                LAB
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
