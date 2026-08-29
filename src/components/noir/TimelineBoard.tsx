"use client";

import React from "react";
import { ClientTimelineEvent, ClientCharacter } from "@/lib/store/useGameStore";
import { Clock, MapPin, AlertCircle, CheckCircle2, Lock } from "lucide-react";

interface TimelineBoardProps {
  timeline: ClientTimelineEvent[];
  characters: ClientCharacter[];
}

export function TimelineBoard({ timeline, characters }: TimelineBoardProps) {
  const getCharacterName = (id: string) => {
    if (id === "victim-lilly") return "Lilly Mehra (Victim)";
    return characters.find((c) => c.character_id === id)?.name || id;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="bg-noir-900 border border-noir-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono font-bold tracking-wider text-thread-500 uppercase">
            CHRONOLOGY RECONSTRUCTION
          </span>
          <h2 className="text-xl font-serif font-bold text-noir-100 mt-0.5">
            Timeline of October 24 (The Murder Night)
          </h2>
          <p className="text-xs text-noir-400 font-sans mt-0.5">
            Reconstruct suspect movements between dinner conclusion (8:20 PM) and body discovery (9:18 PM).
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-noir-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-thread-500" />
            <span>Critical Murder Window (8:50 PM - 9:05 PM)</span>
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 border-l-2 border-noir-800 space-y-6">
        {timeline.map((event, idx) => {
          const isCriticalWindow =
            event.timestamp.includes("8:50") ||
            event.timestamp.includes("8:52") ||
            event.timestamp.includes("8:56") ||
            event.timestamp.includes("9:00") ||
            event.timestamp.includes("9:04");

          return (
            <div key={event.event_id || idx} className="relative group">
              {/* Timeline Pin Node */}
              <div
                className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                  isCriticalWindow
                    ? "bg-thread-950 border-thread-500 shadow-noir-glow"
                    : "bg-noir-900 border-noir-600"
                }`}
              />

              {/* Event Card */}
              <div
                className={`p-4 rounded-lg border transition-all ${
                  isCriticalWindow
                    ? "bg-noir-900 border-thread-700/60 shadow-md"
                    : "bg-noir-950/80 border-noir-800"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-noir-850 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-thread-400">
                      {event.timestamp}
                    </span>
                    <span className="text-noir-600">•</span>
                    <span className="text-xs font-sans text-noir-300 flex items-center gap-1">
                      <MapPin size={12} className="text-noir-400" />
                      {event.location}
                    </span>
                  </div>

                  {isCriticalWindow && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-thread-950 border border-thread-800 text-thread-300 font-semibold">
                      CRITICAL WINDOW
                    </span>
                  )}
                </div>

                <p className="text-sm font-sans text-noir-200 leading-relaxed">
                  {event.summary}
                </p>

                {event.involved_characters && event.involved_characters.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-noir-850 flex flex-wrap items-center gap-1.5 text-xs font-mono text-noir-400">
                    <span className="text-[10px] text-noir-500 uppercase mr-1">Involved:</span>
                    {event.involved_characters.map((cId) => (
                      <span
                        key={cId}
                        className="px-2 py-0.5 rounded bg-noir-850 border border-noir-700 text-noir-300 text-[11px]"
                      >
                        {getCharacterName(cId)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
