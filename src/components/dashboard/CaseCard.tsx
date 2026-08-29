"use client";

import React, { useState } from "react";
import { InvestigationSummary } from "@/engine/schema";
import { Folder, Trash2, ArrowRight, Clock, MapPin, UserX, CheckCircle2, AlertCircle } from "lucide-react";

interface CaseCardProps {
  summary: InvestigationSummary;
  onResume: (investigationId: string) => void;
  onDelete: (investigationId: string) => void;
}

export function CaseCard({ summary, onResume, onDelete }: CaseCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const getStatusBadge = (status: InvestigationSummary["status"]) => {
    switch (status) {
      case "SOLVED":
        return {
          label: "SOLVED",
          bg: "bg-emerald-950/80 border-emerald-700 text-emerald-300",
          icon: <CheckCircle2 size={12} className="text-emerald-400" />,
        };
      case "ACTIVE":
        return {
          label: "ACTIVE",
          bg: "bg-thread-950/80 border-thread-700 text-thread-300",
          icon: <span className="w-1.5 h-1.5 rounded-full bg-thread-500 animate-ping inline-block" />,
        };
      default:
        return {
          label: "PENDING",
          bg: "bg-amber-950/80 border-amber-700 text-amber-300",
          icon: <Clock size={12} className="text-amber-400" />,
        };
    }
  };

  const badge = getStatusBadge(summary.status);

  return (
    <div className="bg-noir-900 border border-noir-800 rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-noir-700 transition-all shadow-dossier relative group">
      {/* Top Details */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-noir-850 border border-noir-750 text-noir-300 font-bold">
              {summary.caseNumber || "CASE #T-1001"}
            </span>
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border flex items-center gap-1.5 ${badge.bg}`}>
              {badge.icon}
              <span>{badge.label}</span>
            </span>
          </div>

          <button
            onClick={() => setShowConfirmDelete(true)}
            title="Delete Investigation"
            className="text-noir-600 hover:text-thread-400 transition-colors p-1"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-serif font-bold text-noir-100 group-hover:text-thread-200 transition-colors">
            {summary.title}
          </h3>
          <p className="text-xs text-noir-400 font-sans flex items-center gap-1.5 mt-1">
            <UserX size={13} className="text-thread-400" />
            <span>Victim: <strong className="text-noir-200 font-semibold">{summary.victimName}</strong></span>
          </p>
        </div>

        <div className="text-xs font-mono text-noir-400 flex items-center gap-1.5">
          <MapPin size={13} className="text-noir-500 shrink-0" />
          <span className="truncate">{summary.location}</span>
        </div>
      </div>

      {/* Bottom Metadata & Resume CTA */}
      <div className="pt-3 border-t border-noir-850 flex items-center justify-between gap-3 text-xs font-mono">
        <span className="text-noir-500 text-[11px]">
          {new Date(summary.lastInvestigated).toLocaleDateString()}
        </span>

        <button
          onClick={() => onResume(summary.investigationId)}
          className="px-3.5 py-1.5 rounded bg-noir-850 border border-noir-700 hover:border-thread-600 hover:bg-thread-950 text-noir-200 hover:text-thread-200 uppercase font-semibold text-[11px] tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
        >
          <span>{summary.status === "SOLVED" ? "Review Docket" : "Resume Case"}</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-noir-950/95 backdrop-blur-sm rounded-lg p-5 flex flex-col justify-center text-center space-y-3 z-20 border border-thread-800">
          <AlertCircle size={24} className="text-thread-400 mx-auto" />
          <p className="text-xs font-sans text-noir-200">
            Delete this investigation permanently? All recorded statements and notes will be removed.
          </p>
          <div className="flex justify-center gap-2 pt-1">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-3 py-1.5 rounded bg-noir-800 border border-noir-700 text-noir-300 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowConfirmDelete(false);
                onDelete(summary.investigationId);
              }}
              className="px-3 py-1.5 rounded bg-thread-900 border border-thread-600 text-thread-100 text-xs font-mono uppercase font-semibold hover:bg-thread-800 shadow-noir-glow"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
