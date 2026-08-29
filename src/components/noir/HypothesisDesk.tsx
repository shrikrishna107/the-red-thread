"use client";

import React, { useState } from "react";
import { ClientCharacter, ClientEvidence } from "@/lib/store/useGameStore";
import { HypothesisItem } from "@/engine/schema";
import { Scale, Plus, Trash2, Edit3, BookmarkCheck, CheckCircle2, ShieldAlert } from "lucide-react";

interface HypothesisDeskProps {
  characters: ClientCharacter[];
  evidenceList: ClientEvidence[];
  hypotheses: HypothesisItem[];
  onSaveHypothesis: (hypothesis: Omit<HypothesisItem, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void;
  onDeleteHypothesis: (hypothesisId: string) => void;
  onProceedToAccusation: () => void;
}

export function HypothesisDesk({
  characters,
  evidenceList,
  hypotheses,
  onSaveHypothesis,
  onDeleteHypothesis,
  onProceedToAccusation,
}: HypothesisDeskProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("Working Hypothesis #1");
  const [suspectId, setSuspectId] = useState(characters.find((c) => c.role === "suspect")?.character_id || "");
  const [motive, setMotive] = useState("");
  const [weaponId, setWeaponId] = useState(evidenceList[0]?.evidence_id || "");
  const [timelineSummary, setTimelineSummary] = useState("");
  const [supportingEvidenceIds, setSupportingEvidenceIds] = useState<string[]>([]);
  const [narrative, setNarrative] = useState("");
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const discoveredEvidence = evidenceList.filter((e) => e.is_discovered);

  const toggleEvidence = (id: string) => {
    if (supportingEvidenceIds.includes(id)) {
      setSupportingEvidenceIds(supportingEvidenceIds.filter((e) => e !== id));
    } else {
      setSupportingEvidenceIds([...supportingEvidenceIds, id]);
    }
  };

  const handleEdit = (h: HypothesisItem) => {
    setEditingId(h.id);
    setTitle(h.title);
    setSuspectId(h.suspect_id);
    setMotive(h.motive);
    setWeaponId(h.weapon_id);
    setTimelineSummary(h.timeline_summary);
    setSupportingEvidenceIds(h.supporting_evidence_ids || []);
    setNarrative(h.narrative);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspectId || !motive.trim()) return;

    onSaveHypothesis({
      id: editingId || undefined,
      investigation_id: "active",
      title: title.trim() || `Working Theory #${hypotheses.length + 1}`,
      suspect_id: suspectId,
      motive: motive.trim(),
      weapon_id: weaponId,
      timeline_summary: timelineSummary.trim(),
      supporting_evidence_ids: supportingEvidenceIds,
      narrative: narrative.trim(),
    });

    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3500);

    // Reset form
    setIsFormOpen(false);
    setEditingId(null);
    setTitle(`Working Hypothesis #${hypotheses.length + 2}`);
    setMotive("");
    setTimelineSummary("");
    setNarrative("");
    setSupportingEvidenceIds([]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Top Banner */}
      <div className="bg-noir-900 border border-noir-800 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-wider text-thread-500 uppercase">
            DETECTIVE RECONSTRUCTION
          </span>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-noir-100 mt-0.5">
            Hypothesis & Case Theories
          </h2>
          <p className="text-xs text-noir-400 font-sans mt-0.5 max-w-xl">
            Develop multiple working theories as your clues accumulate. Hypotheses are recorded in your docket without confirming or denying them until final accusation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingId(null);
              setIsFormOpen(!isFormOpen);
            }}
            className="px-3.5 py-2 rounded bg-noir-850 border border-noir-700 hover:border-noir-600 text-xs font-mono font-semibold uppercase text-noir-200 flex items-center gap-1.5 transition-colors"
          >
            <Plus size={14} />
            <span>{isFormOpen ? "Close Form" : "Draft New Theory"}</span>
          </button>

          <button
            onClick={onProceedToAccusation}
            className="px-4 py-2 rounded bg-gradient-to-r from-thread-900 to-thread-800 border border-thread-600 text-thread-100 font-serif font-semibold text-xs uppercase tracking-wider hover:from-thread-800 hover:to-thread-700 shadow-noir-glow transition-all flex items-center gap-1.5"
          >
            <ShieldAlert size={14} className="text-thread-400" />
            <span>Make Final Accusation</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {saveSuccessNotice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={15} className="text-emerald-400" />
          <span>Hypothesis saved to detective docket. The investigation remains open.</span>
        </div>
      )}

      {/* Hypothesis Form */}
      {isFormOpen && (
        <form onSubmit={handleSave} className="bg-noir-900 border border-thread-700/80 rounded-xl p-5 space-y-4 shadow-noir-glow">
          <div className="flex items-center justify-between border-b border-noir-800 pb-2">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-serif font-bold text-base bg-transparent text-noir-100 outline-none w-full"
              placeholder="Hypothesis Title..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
                Prime Suspect
              </label>
              <select
                value={suspectId}
                onChange={(e) => setSuspectId(e.target.value)}
                className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-xs text-noir-100 font-serif outline-none focus:border-thread-600"
              >
                {characters.map((c) => (
                  <option key={c.character_id} value={c.character_id}>
                    {c.name} ({c.role.toUpperCase()} — {c.occupation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
                Murder Weapon
              </label>
              <select
                value={weaponId}
                onChange={(e) => setWeaponId(e.target.value)}
                className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-xs text-noir-100 font-serif outline-none focus:border-thread-600"
              >
                {evidenceList.map((e) => (
                  <option key={e.evidence_id} value={e.evidence_id}>
                    {e.name} ({e.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
              Motive
            </label>
            <input
              type="text"
              required
              placeholder="Why did they commit the crime? (e.g. Audit embezzlement, inheritance, affair concealment)..."
              value={motive}
              onChange={(e) => setMotive(e.target.value)}
              className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-xs text-noir-100 outline-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
              Timeline & Alibi Refutation
            </label>
            <input
              type="text"
              placeholder="e.g. Assault at 8:56 PM; entered wine cellar at 9:04 PM..."
              value={timelineSummary}
              onChange={(e) => setTimelineSummary(e.target.value)}
              className="w-full bg-noir-950 border border-noir-700 rounded px-3 py-2 text-xs text-noir-100 outline-none font-sans"
            />
          </div>

          {/* Supporting Evidence */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
              Supporting Discovered Evidence ({supportingEvidenceIds.length} Attached)
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

          <div>
            <label className="block text-xs font-mono font-semibold uppercase text-noir-300 mb-1">
              Detailed Detective Synthesis Narrative
            </label>
            <textarea
              rows={3}
              placeholder="Synthesize the sequence of events, contradictions caught, and physical proof..."
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              className="w-full bg-noir-950 border border-noir-700 rounded p-3 text-xs font-sans text-noir-200 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 rounded bg-noir-850 text-noir-400 text-xs font-mono uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded bg-thread-900 border border-thread-600 text-thread-100 text-xs font-mono font-semibold uppercase tracking-wider hover:bg-thread-800 shadow-noir-glow"
            >
              {editingId ? "Update Hypothesis" : "Record Hypothesis in Docket"}
            </button>
          </div>
        </form>
      )}

      {/* Hypotheses List */}
      <div className="space-y-4">
        {hypotheses.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-noir-800 rounded-xl space-y-2">
            <Scale size={32} className="text-noir-600 mx-auto" />
            <h4 className="font-serif font-bold text-sm text-noir-300">
              No Hypotheses Formulated Yet
            </h4>
            <p className="text-xs text-noir-500 font-sans max-w-sm mx-auto">
              Draft theories to organize your suspicions. When ready, click "Make Final Accusation" to resolve the case.
            </p>
          </div>
        ) : (
          hypotheses.map((h, idx) => {
            const suspect = characters.find((c) => c.character_id === h.suspect_id);
            const weapon = evidenceList.find((e) => e.evidence_id === h.weapon_id);

            return (
              <div
                key={h.id || idx}
                className="p-5 rounded-xl bg-noir-900 border border-noir-800 hover:border-noir-750 transition-all space-y-3 shadow-dossier"
              >
                <div className="flex items-start justify-between gap-2 border-b border-noir-850 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-noir-950 border border-noir-800 text-[10px] font-mono uppercase text-thread-400 font-bold">
                      THEORY #{idx + 1}
                    </span>
                    <h3 className="font-serif font-bold text-base text-noir-100">
                      {h.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(h)}
                      title="Edit Theory"
                      className="p-1 rounded text-noir-400 hover:text-noir-100"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteHypothesis(h.id)}
                      title="Delete Theory"
                      className="p-1 rounded text-noir-500 hover:text-thread-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-noir-300">
                  <div>
                    <span className="text-[10px] text-noir-500 uppercase block">SUSPECT:</span>
                    <span className="font-semibold text-noir-200">{suspect?.name || h.suspect_id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-noir-500 uppercase block">WEAPON:</span>
                    <span className="text-noir-200">{weapon?.name || h.weapon_id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-noir-500 uppercase block">MOTIVE:</span>
                    <span className="text-noir-200 truncate">{h.motive}</span>
                  </div>
                </div>

                {h.narrative && (
                  <p className="text-xs font-sans text-noir-300 leading-relaxed bg-noir-950 p-3 rounded border border-noir-850">
                    {h.narrative}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
