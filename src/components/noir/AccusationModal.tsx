"use client";

import React, { useState } from "react";
import { ClientCharacter, ClientEvidence } from "@/lib/store/useGameStore";
import { AccusationResult, TheorySubmission } from "@/engine/schema";
import { ShieldAlert, X, Trophy, AlertOctagon, RotateCcw, CheckCircle2, FileCheck, HelpCircle, AlertTriangle } from "lucide-react";

interface AccusationModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: ClientCharacter[];
  evidenceList: ClientEvidence[];
  finalVerdict: AccusationResult | null;
  onSubmitAccusation: (submission: Omit<TheorySubmission, "investigation_id">) => Promise<void>;
  onReturnToDashboard: () => void;
}

export function AccusationModal({
  isOpen,
  onClose,
  characters,
  evidenceList,
  finalVerdict,
  onSubmitAccusation,
  onReturnToDashboard,
}: AccusationModalProps) {
  const [suspectId, setSuspectId] = useState<string>(
    characters.find((c) => c.role === "suspect")?.character_id || ""
  );
  const [motive, setMotive] = useState<string>("");
  const [weaponId, setWeaponId] = useState<string>(evidenceList[0]?.evidence_id || "");
  const [timelineSummary, setTimelineSummary] = useState<string>("");
  const [supportingEvidenceIds, setSupportingEvidenceIds] = useState<string[]>([]);
  const [explanation, setExplanation] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const discoveredEvidence = evidenceList.filter((e) => e.is_discovered);

  const toggleEvidence = (id: string) => {
    if (supportingEvidenceIds.includes(id)) {
      setSupportingEvidenceIds(supportingEvidenceIds.filter((e) => e !== id));
    } else {
      setSupportingEvidenceIds([...supportingEvidenceIds, id]);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspectId || !motive.trim() || !weaponId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmitAccusation({
        suspect_id: suspectId,
        motive,
        weapon_id: weaponId,
        timeline_summary: timelineSummary,
        supporting_evidence_ids: supportingEvidenceIds,
        explanation,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-noir-900 border border-noir-700 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Top Bar */}
        <div className="p-4 bg-noir-950 border-b border-noir-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert size={18} className="text-thread-500" />
            <span className="font-serif font-bold text-sm tracking-wider uppercase text-noir-100">
              {finalVerdict ? "OFFICIAL CASE RESOLUTION & REVEAL" : "MAKE FORMAL ARREST INDICTMENT"}
            </span>
          </div>
          {!finalVerdict && (
            <button
              onClick={onClose}
              className="p-1 rounded text-noir-400 hover:text-noir-100 hover:bg-noir-800 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {finalVerdict ? (
            /* Cinematic Ending Screen with Detailed Case Reveal */
            <div className="space-y-6">
              <div className={`p-6 rounded-lg border text-center space-y-3 ${
                finalVerdict.outcome === "CASE_SOLVED"
                  ? "bg-emerald-950/40 border-emerald-600 shadow-noir-glow"
                  : finalVerdict.outcome === "PARTIALLY_CORRECT"
                  ? "bg-amber-950/40 border-amber-600"
                  : "bg-thread-950/60 border-thread-600 shadow-noir-glow"
              }`}>
                <div className="w-14 h-14 rounded-full bg-noir-950 border border-noir-700 flex items-center justify-center mx-auto text-2xl">
                  {finalVerdict.outcome === "CASE_SOLVED" ? "🏆" : finalVerdict.outcome === "PARTIALLY_CORRECT" ? "⚠️" : "⚖️"}
                </div>
                <h2 className="text-2xl font-serif font-bold text-noir-100 tracking-wide">
                  {finalVerdict.title}
                </h2>
                <p className="text-sm font-sans leading-relaxed text-noir-200 max-w-xl mx-auto">
                  {finalVerdict.summary}
                </p>
                <div className="font-mono text-xs font-semibold uppercase tracking-wider text-noir-300">
                  FINAL DETECTIVE SCORE: {finalVerdict.verdict_score} / 100
                </div>
              </div>

              {/* Case Reveal Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                {/* What You Got Right */}
                {finalVerdict.what_you_got_right && finalVerdict.what_you_got_right.length > 0 && (
                  <div className="bg-noir-950 p-4 rounded-lg border border-noir-800 space-y-2">
                    <h4 className="font-mono font-semibold uppercase text-emerald-400 flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 size={14} />
                      What You Got Right
                    </h4>
                    <ul className="space-y-1 text-noir-300">
                      {finalVerdict.what_you_got_right.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* What Misled You */}
                {finalVerdict.what_misled_you && finalVerdict.what_misled_you.length > 0 && (
                  <div className="bg-noir-950 p-4 rounded-lg border border-noir-800 space-y-2">
                    <h4 className="font-mono font-semibold uppercase text-amber-400 flex items-center gap-1.5 text-[11px]">
                      <AlertTriangle size={14} />
                      What Misled You (Red Herrings)
                    </h4>
                    <ul className="space-y-1 text-noir-300">
                      {finalVerdict.what_misled_you.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* What You Missed */}
                {finalVerdict.what_you_missed && finalVerdict.what_you_missed.length > 0 && (
                  <div className="bg-noir-950 p-4 rounded-lg border border-noir-800 space-y-2">
                    <h4 className="font-mono font-semibold uppercase text-thread-400 flex items-center gap-1.5 text-[11px]">
                      <HelpCircle size={14} />
                      What You Missed
                    </h4>
                    <ul className="space-y-1 text-noir-300">
                      {finalVerdict.what_you_missed.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Clues Found */}
                {finalVerdict.key_clues_found && finalVerdict.key_clues_found.length > 0 && (
                  <div className="bg-noir-950 p-4 rounded-lg border border-noir-800 space-y-2">
                    <h4 className="font-mono font-semibold uppercase text-blue-400 flex items-center gap-1.5 text-[11px]">
                      <FileCheck size={14} />
                      Key Clues Uncovered
                    </h4>
                    <ul className="space-y-1 text-noir-300">
                      {finalVerdict.key_clues_found.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Judicial Aftermath */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-semibold uppercase text-noir-400">
                  Judicial Aftermath
                </h3>
                <p className="text-sm font-sans leading-relaxed text-noir-200 bg-noir-950 p-4 rounded border border-noir-800">
                  {finalVerdict.aftermath_narrative}
                </p>
              </div>

              {/* Canonical Truth Walkthrough */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-semibold uppercase text-thread-400 flex items-center gap-1.5">
                  <FileCheck size={14} />
                  The Locked Canonical Truth (Unveiled)
                </h3>
                <div className="bg-noir-950 p-4 rounded border border-noir-800 text-xs font-mono space-y-2 text-noir-300">
                  <p><span className="text-noir-500">KILLER:</span> {finalVerdict.canonical_truth_reveal.killer_name}</p>
                  <p><span className="text-noir-500">WEAPON:</span> {finalVerdict.canonical_truth_reveal.weapon_name}</p>
                  <p><span className="text-noir-500">MOTIVE:</span> {finalVerdict.canonical_truth_reveal.motive_details}</p>
                  <p><span className="text-noir-500">NARRATIVE:</span> {finalVerdict.canonical_truth_reveal.complete_narrative}</p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-noir-800 flex justify-end gap-3">
                <button
                  onClick={onReturnToDashboard}
                  className="px-5 py-2.5 rounded bg-thread-900 border border-thread-600 text-thread-100 hover:bg-thread-800 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-noir-glow transition-all"
                >
                  <RotateCcw size={14} />
                  <span>Return to Dashboard Docket</span>
                </button>
              </div>
            </div>
          ) : (
            /* Formal Accusation Submission Form */
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="p-3.5 rounded bg-thread-950/60 border border-thread-800 text-xs text-thread-300 flex items-start gap-2.5 font-sans">
                <AlertOctagon size={16} className="text-thread-400 shrink-0 mt-0.5" />
                <p>
                  <strong>ANTI-HIT-AND-TRY RULE:</strong> Making a formal accusation executes an arrest warrant and concludes the investigation. You cannot guess names repeatedly; ensure your motive, weapon, and evidence are corroborated.
                </p>
              </div>

              {/* Suspect */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
                  Accused Perpetrator
                </label>
                <select
                  value={suspectId}
                  onChange={(e) => setSuspectId(e.target.value)}
                  className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-sm text-noir-100 font-serif outline-none focus:border-thread-600"
                >
                  {characters.map((c) => (
                    <option key={c.character_id} value={c.character_id}>
                      {c.name} ({c.role.toUpperCase()} — {c.occupation})
                    </option>
                  ))}
                </select>
              </div>

              {/* Motive */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
                  Underlying Criminal Motive
                </label>
                <input
                  type="text"
                  placeholder="e.g. Financial fraud embezzlement exposed by impending audit..."
                  value={motive}
                  onChange={(e) => setMotive(e.target.value)}
                  className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-sm text-noir-100 placeholder-noir-500 font-sans outline-none focus:border-thread-600"
                />
              </div>

              {/* Weapon */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
                  Murder Weapon
                </label>
                <select
                  value={weaponId}
                  onChange={(e) => setWeaponId(e.target.value)}
                  className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-sm text-noir-100 font-serif outline-none focus:border-thread-600"
                >
                  {evidenceList.map((e) => (
                    <option key={e.evidence_id} value={e.evidence_id}>
                      {e.name} ({e.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Supporting Evidence */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
                  Corroborating Evidence ({supportingEvidenceIds.length} Attached)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-noir-950 rounded border border-noir-800 scrollbar-thin">
                  {discoveredEvidence.map((item) => {
                    const isChecked = supportingEvidenceIds.includes(item.evidence_id);
                    return (
                      <button
                        type="button"
                        key={item.evidence_id}
                        onClick={() => toggleEvidence(item.evidence_id)}
                        className={`text-left p-1.5 rounded border text-xs font-sans flex items-center justify-between ${
                          isChecked
                            ? "bg-noir-850 border-thread-600 text-thread-200"
                            : "bg-noir-900 border-noir-800 text-noir-400"
                        }`}
                      >
                        <span className="truncate">{item.name}</span>
                        {isChecked ? (
                          <CheckCircle2 size={12} className="text-thread-400 shrink-0" />
                        ) : (
                          <span className="w-3 h-3 rounded border border-noir-700 inline-block shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Narrative */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
                  Prosecution Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail the sequence of events and how the suspect committed the murder..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full bg-noir-950 border border-noir-700 rounded p-3 text-xs font-sans text-noir-200 placeholder-noir-500 outline-none focus:border-thread-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-noir-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded bg-noir-800 border border-noir-700 text-noir-300 text-xs font-mono uppercase hover:bg-noir-750"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!suspectId || !motive.trim() || !weaponId || isSubmitting}
                  className="px-5 py-2 rounded bg-gradient-to-r from-thread-900 to-thread-800 border border-thread-600 text-thread-100 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-noir-glow hover:from-thread-800 hover:to-thread-700 disabled:opacity-40"
                >
                  <ShieldAlert size={14} />
                  <span>{isSubmitting ? "Executing Indictment..." : "Issue Formal Arrest Warrant"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
