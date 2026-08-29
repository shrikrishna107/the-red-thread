"use client";

import React, { useState } from "react";
import { ClientEvidence } from "@/lib/store/useGameStore";
import { Search, FlaskConical, Lock, CheckCircle2, BookmarkPlus, Tag } from "lucide-react";

interface EvidenceLockerProps {
  evidenceList: ClientEvidence[];
  onExamineEvidence: (evidenceId: string) => Promise<void>;
  onAddNote: (title: string, content: string, category: any) => void;
}

export function EvidenceLocker({
  evidenceList,
  onExamineEvidence,
  onAddNote,
}: EvidenceLockerProps) {
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(
    evidenceList.find((e) => e.is_discovered)?.evidence_id || evidenceList[0]?.evidence_id || ""
  );
  const [isExamining, setIsExamining] = useState(false);

  const selectedEvidence = evidenceList.find((e) => e.evidence_id === selectedEvidenceId);

  const handleExamine = async (evidenceId: string) => {
    setIsExamining(true);
    try {
      await onExamineEvidence(evidenceId);
    } finally {
      setIsExamining(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-145px)]">
      {/* Evidence Directory (Left 5 Columns) */}
      <div className="lg:col-span-5 bg-noir-900 border border-noir-800 rounded-lg p-3 overflow-y-auto space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-noir-800">
          <span className="text-xs font-mono font-bold tracking-wider text-noir-300 uppercase">
            EVIDENCE LOCKER
          </span>
          <span className="text-[11px] font-mono text-thread-400">
            {evidenceList.filter((e) => e.is_discovered).length} / {evidenceList.length} LOGGED
          </span>
        </div>

        <div className="space-y-2">
          {evidenceList.map((item) => {
            const isSelected = item.evidence_id === selectedEvidenceId;
            return (
              <button
                key={item.evidence_id}
                onClick={() => setSelectedEvidenceId(item.evidence_id)}
                className={`w-full text-left p-3 rounded border transition-all relative ${
                  isSelected
                    ? "bg-noir-850 border-thread-600 shadow-noir-glow"
                    : "bg-noir-950 border-noir-800/80 hover:border-noir-700"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-semibold text-sm text-noir-100">
                        {item.is_discovered ? item.name : "Uncatalogued Physical Clue"}
                      </span>
                      {item.is_discovered && item.is_forensically_examined && (
                        <CheckCircle2 size={13} className="text-emerald-400" />
                      )}
                    </div>
                    <p className="text-xs text-noir-400 font-sans">
                      {item.is_discovered ? `Found in: ${item.location_found}` : "Location concealed until investigation progress"}
                    </p>
                  </div>

                  <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                    item.is_discovered
                      ? "bg-noir-800 border-noir-700 text-noir-300"
                      : "bg-noir-900 border-noir-800 text-noir-600"
                  }`}>
                    {item.is_discovered ? item.category : "SEALED"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inspection & Forensics View (Right 7 Columns) */}
      <div className="lg:col-span-7 bg-noir-900 border border-noir-800 rounded-lg p-5 overflow-y-auto flex flex-col justify-between shadow-dossier">
        {selectedEvidence ? (
          <div className="space-y-5">
            {/* Header */}
            <div className="border-b border-noir-800 pb-3 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-noir-800 border border-noir-700 text-thread-400 uppercase font-semibold">
                    {selectedEvidence.category}
                  </span>
                  <span className="text-xs font-mono text-noir-500">ID: {selectedEvidence.evidence_id}</span>
                </div>
                <h2 className="text-xl font-serif font-bold text-noir-100">
                  {selectedEvidence.is_discovered ? selectedEvidence.name : "Uncatalogued Evidence"}
                </h2>
                <p className="text-xs text-noir-400 font-mono mt-0.5">
                  Location: {selectedEvidence.is_discovered ? selectedEvidence.location_found : "Unknown"}
                </p>
              </div>

              {selectedEvidence.is_discovered && (
                <button
                  onClick={() =>
                    onAddNote(
                      `Evidence Note: ${selectedEvidence.name}`,
                      `Found: ${selectedEvidence.location_found}\n\nDescription: ${selectedEvidence.initial_description}\n\nForensics: ${
                        selectedEvidence.forensic_analysis || selectedEvidence.forensic_facts?.join(" ") || "Pending examination"
                      }`,
                      "EVIDENCE"
                    )
                  }
                  title="Tag into Notebook"
                  className="p-2 rounded bg-noir-800 border border-noir-700 text-noir-300 hover:text-thread-300 hover:border-thread-700 transition-colors"
                >
                  <BookmarkPlus size={16} />
                </button>
              )}
            </div>

            {selectedEvidence.is_discovered ? (
              <div className="space-y-4">
                {/* Physical Description */}
                <div>
                  <h3 className="text-xs font-mono font-semibold uppercase text-noir-400 mb-1.5">
                    Field Description & Initial Notes
                  </h3>
                  <p className="text-sm font-sans leading-relaxed text-noir-200 bg-noir-950 p-3.5 rounded border border-noir-800">
                    {selectedEvidence.initial_description}
                  </p>
                </div>

                {/* Discoverable Facts */}
                {selectedEvidence.discoverable_facts && selectedEvidence.discoverable_facts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-mono font-semibold uppercase text-noir-400 mb-1.5">
                      Key Discoverable Facts
                    </h3>
                    <ul className="space-y-1.5 bg-noir-950 p-3.5 rounded border border-noir-800 text-xs font-sans text-noir-300">
                      {selectedEvidence.discoverable_facts.map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-thread-500">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Forensic Chemical & Lab Report */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-xs font-mono font-semibold uppercase text-noir-400 flex items-center gap-1.5">
                      <FlaskConical size={14} className="text-amber-400" />
                      Forensic Lab Analysis
                    </h3>
                    {selectedEvidence.is_forensically_examined ? (
                      <span className="text-[10px] font-mono text-emerald-400 uppercase bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                        ANALYSIS COMPLETE
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-amber-400 uppercase">
                        PENDING CHEMICAL ASSAY
                      </span>
                    )}
                  </div>

                  {selectedEvidence.is_forensically_examined ? (
                    <div className="bg-sepia-card border border-sepia-border p-3.5 rounded text-xs font-mono text-sepia-text leading-relaxed space-y-2">
                      <p>
                        {selectedEvidence.forensic_analysis ||
                          selectedEvidence.forensic_facts?.join(" ") ||
                          "Spectroscopic & fingerprint assays completed."}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-noir-950 border border-noir-800 p-4 rounded text-center space-y-2">
                      <p className="text-xs text-noir-400">
                        Item requires lab processing to reveal microscopic biological residues, chemical traces, and latent prints.
                      </p>
                      <button
                        onClick={() => handleExamine(selectedEvidence.evidence_id)}
                        disabled={isExamining}
                        className="px-4 py-2 rounded bg-thread-900 border border-thread-600 text-thread-200 hover:bg-thread-800 text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-2 mx-auto transition-all shadow-noir-glow disabled:opacity-50"
                      >
                        <FlaskConical size={14} />
                        <span>{isExamining ? "Processing Swab..." : "Run Forensic Assay"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-noir-500">
                <Lock size={28} className="mb-2 text-noir-600" />
                <h4 className="font-serif font-semibold text-sm text-noir-400">
                  Item Not Yet Discovered
                </h4>
                <p className="text-xs max-w-sm mt-1">
                  Interrogate suspects or investigate locations to uncover this evidence piece.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-noir-500 text-xs font-mono">
            Select an item from the locker to view details.
          </div>
        )}
      </div>
    </div>
  );
}
