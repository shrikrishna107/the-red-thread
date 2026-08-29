"use client";

import React, { useState } from "react";
import { ClientCharacter, ClientEvidence } from "@/lib/store/useGameStore";
import { TheoryEvaluationResult, TheorySubmission } from "@/engine/schema";
import { Scale, CheckCircle2, AlertTriangle, HelpCircle, Sparkles, Send } from "lucide-react";

interface TheoryDeskProps {
  characters: ClientCharacter[];
  evidenceList: ClientEvidence[];
  latestEvaluation: TheoryEvaluationResult | null;
  onEvaluateTheory: (submission: Omit<TheorySubmission, "investigation_id">) => Promise<void>;
  onProceedToAccusation: () => void;
}

export function TheoryDesk({
  characters,
  evidenceList,
  latestEvaluation,
  onEvaluateTheory,
  onProceedToAccusation,
}: TheoryDeskProps) {
  const [suspectId, setSuspectId] = useState<string>(
    characters.find((c) => c.role === "suspect")?.character_id || ""
  );
  const [motive, setMotive] = useState<string>("");
  const [weaponId, setWeaponId] = useState<string>(evidenceList[0]?.evidence_id || "");
  const [timelineSummary, setTimelineSummary] = useState<string>("");
  const [supportingEvidenceIds, setSupportingEvidenceIds] = useState<string[]>([]);
  const [explanation, setExplanation] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const discoveredEvidence = evidenceList.filter((e) => e.is_discovered);

  const toggleEvidence = (id: string) => {
    if (supportingEvidenceIds.includes(id)) {
      setSupportingEvidenceIds(supportingEvidenceIds.filter((e) => e !== id));
    } else {
      setSupportingEvidenceIds([...supportingEvidenceIds, id]);
    }
  };

  const handleTestTheory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspectId || !motive.trim() || !weaponId || isEvaluating) return;
    setIsEvaluating(true);
    try {
      await onEvaluateTheory({
        suspect_id: suspectId,
        motive,
        weapon_id: weaponId,
        timeline_summary: timelineSummary,
        supporting_evidence_ids: supportingEvidenceIds,
        explanation,
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="bg-noir-900 border border-noir-800 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-wider text-thread-500 uppercase">
            HYPOTHESIS TESTING
          </span>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-noir-100 mt-0.5">
            Preliminary Theory Desk
          </h2>
          <p className="text-xs text-noir-400 font-sans mt-0.5 max-w-xl">
            Synthesize your clues before committing to formal charges. The system will critique your logic, highlight contradictions, and evaluate evidentiary support.
          </p>
        </div>

        <button
          onClick={onProceedToAccusation}
          className="px-4 py-2.5 rounded bg-gradient-to-r from-thread-900 to-thread-800 border border-thread-600 text-thread-100 font-serif font-semibold text-xs uppercase tracking-wider hover:from-thread-800 hover:to-thread-700 shadow-noir-glow transition-all"
        >
          Make Final Accusation →
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Theory Input Form (7 cols) */}
        <form onSubmit={handleTestTheory} className="lg:col-span-7 bg-noir-900 border border-noir-800 rounded-lg p-5 space-y-4 shadow-dossier">
          {/* Prime Suspect Selector */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
              1. Prime Perpetrator
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

          {/* Motive Input */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
              2. Proposed Motive
            </label>
            <input
              type="text"
              placeholder="e.g. Embezzlement fraud audit / Romantic jealousy / Blackmail..."
              value={motive}
              onChange={(e) => setMotive(e.target.value)}
              className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-sm text-noir-100 placeholder-noir-500 font-sans outline-none focus:border-thread-600"
            />
          </div>

          {/* Weapon Selector */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
              3. Murder Weapon
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

          {/* Timeline Summary */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
              4. Timeline of Assault & Alibi Disproval
            </label>
            <input
              type="text"
              placeholder="e.g. Assault at 8:56 PM by gazebo; entered wine cellar at 9:04 PM..."
              value={timelineSummary}
              onChange={(e) => setTimelineSummary(e.target.value)}
              className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-sm text-noir-100 placeholder-noir-500 font-sans outline-none focus:border-thread-600"
            />
          </div>

          {/* Supporting Evidence Checklist */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1.5">
              5. Supporting Discovered Evidence ({supportingEvidenceIds.length} Selected)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-noir-950 rounded border border-noir-800 scrollbar-thin">
              {discoveredEvidence.map((item) => {
                const isChecked = supportingEvidenceIds.includes(item.evidence_id);
                return (
                  <button
                    type="button"
                    key={item.evidence_id}
                    onClick={() => toggleEvidence(item.evidence_id)}
                    className={`text-left p-2 rounded border text-xs font-sans transition-all flex items-center justify-between ${
                      isChecked
                        ? "bg-noir-850 border-thread-600 text-thread-200"
                        : "bg-noir-900 border-noir-800 text-noir-400 hover:border-noir-700"
                    }`}
                  >
                    <span className="truncate">{item.name}</span>
                    {isChecked ? (
                      <CheckCircle2 size={13} className="text-thread-400 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded border border-noir-700 inline-block shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Narrative Explanation */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
              6. Detective Narrative Synthesis
            </label>
            <textarea
              rows={3}
              placeholder="Explain how the suspect committed the crime and covered their tracks..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full bg-noir-950 border border-noir-700 rounded p-3 text-xs font-sans text-noir-200 placeholder-noir-500 outline-none focus:border-thread-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!suspectId || !motive.trim() || !weaponId || isEvaluating}
              className="w-full py-2.5 rounded bg-thread-900 border border-thread-600 text-thread-100 hover:bg-thread-800 font-mono text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-noir-glow transition-all disabled:opacity-40"
            >
              <Scale size={15} />
              <span>{isEvaluating ? "Evaluating Case Plausibility..." : "Test Theory & Review Diagnostic Feedback"}</span>
            </button>
          </div>
        </form>

        {/* Diagnostic Feedback (5 cols) */}
        <div className="lg:col-span-5 bg-noir-900 border border-noir-800 rounded-lg p-5 space-y-4 shadow-dossier flex flex-col justify-between">
          <div>
            <div className="border-b border-noir-800 pb-3 mb-4">
              <span className="text-xs font-mono font-bold tracking-wider text-noir-400 uppercase">
                DIAGNOSTIC CRITIQUE
              </span>
              <h3 className="text-lg font-serif font-bold text-noir-100 mt-0.5">
                Detective Review Evaluation
              </h3>
            </div>

            {latestEvaluation ? (
              <div className="space-y-4">
                {/* Score & Verdict Banner */}
                <div className={`p-3.5 rounded border text-xs font-mono space-y-1.5 ${
                  latestEvaluation.evaluation_verdict === "STRONG_CASE"
                    ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                    : latestEvaluation.evaluation_verdict === "PLAUSIBLE_BUT_LEAKY"
                    ? "bg-amber-950/40 border-amber-800 text-amber-300"
                    : "bg-thread-950/50 border-thread-800 text-thread-300"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider">
                      VERDICT: {latestEvaluation.evaluation_verdict.replace(/_/g, " ")}
                    </span>
                    <span className="font-bold text-sm">
                      {latestEvaluation.overall_score} / 100
                    </span>
                  </div>
                  <p className="font-sans text-xs opacity-90 leading-relaxed">
                    {latestEvaluation.detective_critique}
                  </p>
                </div>

                {/* Strengths */}
                {latestEvaluation.strengths.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-mono font-semibold uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 size={13} />
                      Strong Elements
                    </h4>
                    <ul className="space-y-1 text-xs font-sans text-noir-300 bg-noir-950 p-2.5 rounded border border-noir-850">
                      {latestEvaluation.strengths.map((s, idx) => (
                        <li key={idx}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Inconsistencies */}
                {latestEvaluation.inconsistencies.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-mono font-semibold uppercase text-thread-400 mb-1 flex items-center gap-1.5">
                      <AlertTriangle size={13} />
                      Identified Contradictions
                    </h4>
                    <ul className="space-y-1 text-xs font-sans text-noir-300 bg-noir-950 p-2.5 rounded border border-noir-850">
                      {latestEvaluation.inconsistencies.map((inc, idx) => (
                        <li key={idx}>• {inc}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Unanswered Questions */}
                {latestEvaluation.unanswered_questions.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-mono font-semibold uppercase text-amber-400 mb-1 flex items-center gap-1.5">
                      <HelpCircle size={13} />
                      Unsubstantiated Points
                    </h4>
                    <ul className="space-y-1 text-xs font-sans text-noir-300 bg-noir-950 p-2.5 rounded border border-noir-850">
                      {latestEvaluation.unanswered_questions.map((q, idx) => (
                        <li key={idx}>• {q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-noir-500">
                <Scale size={32} className="mb-2 text-noir-600" />
                <h4 className="font-serif font-semibold text-sm text-noir-400">
                  No Theory Tested Yet
                </h4>
                <p className="text-xs max-w-xs mt-1">
                  Fill out the theory fields on the left to evaluate your case strength.
                </p>
              </div>
            )}
          </div>

          <div className="text-[11px] font-mono text-noir-500 text-center pt-3 border-t border-noir-850">
            Testing preliminary theories does not lock or end your investigation.
          </div>
        </div>
      </div>
    </div>
  );
}
