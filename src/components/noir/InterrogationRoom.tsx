"use client";

import React, { useState, useRef, useEffect } from "react";
import { ClientCharacter, ClientEvidence } from "@/lib/store/useGameStore";
import { InterrogationMessage } from "@/engine/schema";
import { Send, Eye, ShieldAlert, Sparkles, MessageSquare, AlertCircle, BookmarkPlus } from "lucide-react";

interface InterrogationRoomProps {
  character: ClientCharacter;
  messages: InterrogationMessage[];
  evidenceList: ClientEvidence[];
  isInterrogating: boolean;
  onAskQuestion: (question: string) => Promise<void>;
  onAddNote: (title: string, content: string, category: any) => void;
}

export function InterrogationRoom({
  character,
  messages,
  evidenceList,
  isInterrogating,
  onAskQuestion,
  onAddNote,
}: InterrogationRoomProps) {
  const [inputQuestion, setInputQuestion] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const characterMessages = messages.filter((m) => m.character_id === character.character_id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [characterMessages, isInterrogating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isInterrogating) return;
    const q = inputQuestion;
    setInputQuestion("");
    await onAskQuestion(q);
  };

  const quickQuestions = [
    { label: "Where were you at 8:56 PM?", text: "Where exactly were you at 8:56 PM when the murder occurred?" },
    { label: "What was your relationship with Lilly?", text: "Can you describe your personal and professional relationship with Lilly?" },
    { label: "Did you hear or see anything unusual?", text: "Did you see or hear anyone moving near the pool or conservatory earlier?" },
    { label: "You seem nervous.", text: "You seem noticeably tense. Is there something you haven't mentioned yet?" },
    { label: "Inquire about the audit", text: "What do you know about the $4.2 million audit Lilly was preparing?" },
    { label: "Ask about the bronze paperweight", text: "Have you handled the bronze paperweight on the study bookshelf tonight?" },
  ];

  const stress = character.current_state?.stress ?? 30;
  const defensiveness = character.current_state?.defensiveness ?? 30;
  const cooperation = character.current_state?.cooperation ?? 60;

  return (
    <div className="flex flex-col h-[calc(100vh-145px)] bg-noir-900 border border-noir-800 rounded-lg overflow-hidden shadow-dossier">
      {/* Subject Header Bar */}
      <div className="p-3.5 bg-noir-950 border-b border-noir-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-thread-950 border border-thread-700 flex items-center justify-center font-mono font-bold text-thread-300 text-sm shadow-noir-glow">
            {character.avatar_code}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-serif font-bold text-noir-100">
                {character.name}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase bg-noir-800 border border-noir-700 text-noir-300">
                {character.role}
              </span>
            </div>
            <p className="text-xs text-noir-400 font-sans">
              {character.occupation} • <span className="text-noir-300">{character.relation_to_victim}</span>
            </p>
          </div>
        </div>

        {/* Psychological Meter Bar */}
        <div className="flex items-center gap-4 bg-noir-900 px-3 py-1.5 rounded border border-noir-800">
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between text-[10px] font-mono text-noir-400 gap-2">
              <span>STRESS</span>
              <span className={stress > 70 ? "text-thread-400 font-bold" : "text-noir-300"}>
                {stress}%
              </span>
            </div>
            <div className="w-16 h-1 bg-noir-800 rounded overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  stress > 70 ? "bg-thread-500" : stress > 45 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${stress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between text-[10px] font-mono text-noir-400 gap-2">
              <span>DEFENSIVE</span>
              <span className="text-noir-300">{defensiveness}%</span>
            </div>
            <div className="w-16 h-1 bg-noir-800 rounded overflow-hidden">
              <div
                className="h-full bg-amber-500/80 transition-all duration-500"
                style={{ width: `${defensiveness}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between text-[10px] font-mono text-noir-400 gap-2">
              <span>COOPERATIVE</span>
              <span className="text-noir-300">{cooperation}%</span>
            </div>
            <div className="w-16 h-1 bg-noir-800 rounded overflow-hidden">
              <div
                className="h-full bg-blue-400/80 transition-all duration-500"
                style={{ width: `${cooperation}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Claimed Alibi Strip */}
      <div className="px-4 py-2 bg-noir-850/90 border-b border-noir-800/80 flex items-center justify-between text-xs font-mono text-noir-300">
        <div className="flex items-center gap-2">
          <span className="text-thread-400 font-semibold">CLAIMED ALIBI:</span>
          <span>{character.alibi.claimed_activity} ({character.alibi.claimed_location})</span>
        </div>
        <span className="text-noir-500 hidden sm:inline">{character.alibi.claimed_time_range}</span>
      </div>

      {/* Interrogation Transcript Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans scrollbar-thin scrollbar-thumb-noir-700">
        {characterMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-noir-500">
            <div className="w-12 h-12 rounded-full bg-noir-850 border border-noir-800 flex items-center justify-center text-noir-400 mb-3">
              <MessageSquare size={22} />
            </div>
            <h3 className="font-serif font-semibold text-noir-300 text-sm mb-1">
              Begin Interrogation of {character.name}
            </h3>
            <p className="text-xs max-w-md text-noir-400">
              Type any question into the console below. You may probe alibis, challenge contradictions, present discovered evidence, or observe physical reactions.
            </p>
          </div>
        ) : (
          characterMessages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              {msg.speaker === "detective" ? (
                /* Detective Question Bubble */
                <div className="flex justify-end">
                  <div className="max-w-[82%] bg-noir-800 border border-noir-700/80 rounded-lg p-3 text-noir-100 shadow-md">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono tracking-wider font-semibold text-thread-400 uppercase">
                        DETECTIVE
                      </span>
                      <span className="text-[10px] font-mono text-noir-500">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm font-sans leading-relaxed text-noir-100">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ) : (
                /* Character Response Card with Split Speech & Body Language */
                <div className="flex justify-start">
                  <div className="max-w-[88%] bg-noir-950 border border-noir-800 rounded-lg p-3.5 space-y-2.5 shadow-dossier">
                    {/* Character Header */}
                    <div className="flex items-center justify-between border-b border-noir-850 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-serif font-bold text-noir-200 uppercase tracking-wide">
                          {character.name}
                        </span>
                        {msg.tone && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-noir-850 text-noir-400 border border-noir-700">
                            {msg.tone}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          onAddNote(
                            `Statement: ${character.name}`,
                            `"${msg.text}"\n\nObservation: ${msg.physical_observation || "None"}`,
                            "PEOPLE"
                          )
                        }
                        title="Save to Detective Notebook"
                        className="text-noir-500 hover:text-thread-300 transition-colors p-1 rounded"
                      >
                        <BookmarkPlus size={14} />
                      </button>
                    </div>

                    {/* Spoken Response */}
                    <p className="font-serif text-sm md:text-[15px] leading-relaxed text-sepia-text italic">
                      “{msg.text}”
                    </p>

                    {/* Observable Body Language Card */}
                    {msg.physical_observation && (
                      <div className="p-2.5 rounded bg-sepia-card border border-sepia-border/70 text-xs font-sans text-amber-200/90 flex items-start gap-2">
                        <Eye size={15} className="text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-semibold uppercase text-amber-400 tracking-wider">
                            PHYSICAL OBSERVATION
                          </span>
                          <p className="italic leading-snug text-noir-300">
                            {msg.physical_observation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isInterrogating && (
          <div className="flex justify-start">
            <div className="bg-noir-950 border border-noir-800 rounded-lg p-3 text-xs font-mono text-thread-400 flex items-center gap-2.5 animate-pulse shadow-noir-glow">
              <div className="w-2 h-2 rounded-full bg-thread-500 animate-ping" />
              <span>{character.name} is considering their response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Inquiries */}
      <div className="px-3 py-2 bg-noir-950 border-t border-noir-850 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono text-noir-500 shrink-0 uppercase flex items-center gap-1">
          <Sparkles size={11} className="text-thread-400" />
          Probes:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isInterrogating}
            onClick={() => setInputQuestion(q.text)}
            className="px-2.5 py-1 rounded text-[11px] font-mono bg-noir-850 border border-noir-700/80 text-noir-300 hover:text-thread-200 hover:border-thread-700 hover:bg-noir-800 transition-all shrink-0 whitespace-nowrap"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Question Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-noir-950 border-t border-noir-800 flex items-center gap-2">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          disabled={isInterrogating}
          placeholder={`Ask ${character.name} anything (e.g. alibis, contradictions, evidence, body language)...`}
          className="flex-1 px-3.5 py-2.5 bg-noir-900 border border-noir-700 focus:border-thread-600 rounded text-sm text-noir-100 placeholder-noir-500 outline-none font-sans transition-all"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || isInterrogating}
          className="px-4 py-2.5 rounded bg-thread-900 border border-thread-600 text-thread-100 hover:bg-thread-800 disabled:opacity-40 disabled:cursor-not-allowed font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-noir-glow transition-all"
        >
          <span>Interrogate</span>
          <Send size={13} />
        </button>
      </form>
    </div>
  );
}
