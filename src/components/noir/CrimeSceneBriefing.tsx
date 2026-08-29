"use client";

import React from "react";
import { FileText, MapPin, Clock, CloudRain, UserX, Activity, AlertTriangle } from "lucide-react";

interface CrimeSceneBriefingProps {
  setting: any;
  victim: any;
  opening_scene: any;
  forensics: any;
  onProceedToInterrogation: () => void;
}

export function CrimeSceneBriefing({
  setting,
  victim,
  opening_scene,
  forensics,
  onProceedToInterrogation,
}: CrimeSceneBriefingProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Crime Scene Banner */}
      <div className="bg-gradient-to-b from-noir-900 to-noir-950 border border-noir-800 rounded-lg p-6 shadow-dossier relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-thread-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-noir-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-thread-500 uppercase">
              POLICE INCIDENT DOSSIER
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-noir-100 tracking-wide mt-1">
              {opening_scene?.title || "The Crime Scene at the Glass Pavilion"}
            </h1>
          </div>

          <button
            onClick={onProceedToInterrogation}
            className="px-4 py-2 rounded bg-thread-900 border border-thread-600 text-thread-100 hover:bg-thread-800 font-mono text-xs font-semibold uppercase tracking-wider shadow-noir-glow transition-all"
          >
            Enter Interrogation Room →
          </button>
        </div>

        {/* Environmental Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-1 text-xs font-mono text-noir-300">
          <div className="flex items-center gap-2 bg-noir-850 p-2.5 rounded border border-noir-800">
            <MapPin size={15} className="text-thread-400 shrink-0" />
            <div>
              <span className="text-[10px] text-noir-500 block">LOCATION</span>
              <span className="font-sans font-medium text-noir-200">{setting?.estate_name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-noir-850 p-2.5 rounded border border-noir-800">
            <Clock size={15} className="text-thread-400 shrink-0" />
            <div>
              <span className="text-[10px] text-noir-500 block">DISCOVERY TIME</span>
              <span className="font-sans font-medium text-noir-200">{setting?.time_of_discovery}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-noir-850 p-2.5 rounded border border-noir-800">
            <CloudRain size={15} className="text-thread-400 shrink-0" />
            <div>
              <span className="text-[10px] text-noir-500 block">WEATHER CONDITIONS</span>
              <span className="font-sans font-medium text-noir-200">{setting?.weather}</span>
            </div>
          </div>
        </div>

        {/* Narrative Briefing */}
        <div className="mt-5 space-y-2">
          <h3 className="text-xs font-mono font-semibold uppercase text-noir-400 tracking-wider">
            Lead Detective Case Briefing
          </h3>
          <p className="text-sm font-sans leading-relaxed text-noir-200 bg-noir-850/60 p-4 rounded border border-noir-800">
            {opening_scene?.briefing}
          </p>
        </div>
      </div>

      {/* Two Column Section: Victim Profile & Initial Forensic Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Victim Dossier */}
        <div className="bg-noir-900 border border-noir-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-noir-800 pb-3">
            <UserX size={18} className="text-thread-400" />
            <h2 className="text-base font-serif font-bold text-noir-100">
              Victim Profile: {victim?.name}
            </h2>
          </div>

          <div className="space-y-3 text-xs font-sans">
            <div className="grid grid-cols-2 gap-2 text-noir-300 font-mono">
              <div>
                <span className="text-[10px] text-noir-500 block">AGE & OCCUPATION</span>
                <span>{victim?.age} • {victim?.occupation}</span>
              </div>
              <div>
                <span className="text-[10px] text-noir-500 block">LAST CONFIRMED SIGHTING</span>
                <span>{victim?.last_seen}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-noir-500 uppercase block">BACKGROUND</span>
              <p className="text-noir-300 leading-relaxed bg-noir-950 p-3 rounded border border-noir-850">
                {victim?.background}
              </p>
            </div>
          </div>
        </div>

        {/* Coroner's Preliminary Autopsy Report */}
        <div className="bg-noir-900 border border-noir-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-noir-800 pb-3">
            <Activity size={18} className="text-amber-400" />
            <h2 className="text-base font-serif font-bold text-noir-100">
              Coroner Preliminary Autopsy Summary
            </h2>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="grid grid-cols-2 gap-2 text-noir-300">
              <div>
                <span className="text-[10px] text-noir-500 block">AUTOPSY FILE</span>
                <span>{forensics?.autopsy_id || "AUT-2026-0882"}</span>
              </div>
              <div>
                <span className="text-[10px] text-noir-500 block">EST. TIME OF DEATH</span>
                <span className="text-amber-400 font-bold">{forensics?.estimated_time_of_death}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-noir-500 block uppercase mb-1">OFFICIAL CAUSE OF DEATH</span>
              <p className="text-noir-200 bg-noir-950 p-2.5 rounded border border-noir-850 font-sans">
                {forensics?.official_cause_of_death}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-noir-500 block uppercase mb-1">CONTUSIONS & WOUND PATTERN</span>
              <ul className="space-y-1 text-noir-300 font-sans list-disc list-inside bg-noir-950 p-2.5 rounded border border-noir-850">
                {forensics?.contusions_and_wounds?.map((w: string, i: number) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
