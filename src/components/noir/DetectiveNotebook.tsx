"use client";

import React, { useState } from "react";
import { PlayerNote } from "@/engine/schema";
import { Plus, Pin, Trash2, BookOpen, AlertCircle } from "lucide-react";

interface DetectiveNotebookProps {
  notes: PlayerNote[];
  onAddNote: (title: string, content: string, category: PlayerNote["category"]) => void;
  onTogglePin: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export function DetectiveNotebook({
  notes,
  onAddNote,
  onTogglePin,
  onDeleteNote,
}: DetectiveNotebookProps) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<PlayerNote["category"]>("FACTS");
  const [isAdding, setIsAdding] = useState(false);

  const categories: (PlayerNote["category"] | "ALL")[] = [
    "ALL",
    "PEOPLE",
    "EVIDENCE",
    "FACTS",
    "CONTRADICTIONS",
    "PERSONAL",
  ];

  const filteredNotes = notes.filter((n) =>
    activeCategory === "ALL" ? true : n.category === activeCategory
  );

  // Pinned notes first
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    onAddNote(newTitle, newContent, newCategory);
    setNewTitle("");
    setNewContent("");
    setIsAdding(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="bg-noir-900 border border-noir-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono font-bold tracking-wider text-thread-500 uppercase">
            DETECTIVE DOSSIER
          </span>
          <h2 className="text-xl font-serif font-bold text-noir-100 mt-0.5">
            Field Notes & Contradictions Ledger
          </h2>
          <p className="text-xs text-noir-400 font-sans mt-0.5">
            Record clues, log alibi inconsistencies, and maintain personal deductions.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-2 rounded bg-thread-900 border border-thread-600 text-thread-100 hover:bg-thread-800 text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-noir-glow transition-all"
        >
          <Plus size={14} />
          <span>{isAdding ? "Cancel Note" : "Add Deduction"}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-noir-800 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded text-xs font-mono uppercase transition-all whitespace-nowrap border ${
              activeCategory === cat
                ? "bg-thread-950 border-thread-600 text-thread-300 shadow-inner"
                : "bg-noir-900 border-noir-800 text-noir-400 hover:text-noir-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Note Creation Form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="bg-noir-900 border border-thread-700/80 rounded-lg p-4 space-y-3 shadow-noir-glow"
        >
          <div className="flex items-center justify-between gap-3">
            <input
              type="text"
              placeholder="Note Headline / Key Contradiction..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 bg-noir-950 border border-noir-700 rounded px-3 py-2 text-sm text-noir-100 placeholder-noir-500 font-serif outline-none focus:border-thread-500"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as PlayerNote["category"])}
              className="bg-noir-950 border border-noir-700 rounded px-2.5 py-2 text-xs font-mono text-noir-300 outline-none"
            >
              <option value="FACTS">FACTS</option>
              <option value="PEOPLE">PEOPLE</option>
              <option value="EVIDENCE">EVIDENCE</option>
              <option value="CONTRADICTIONS">CONTRADICTIONS</option>
              <option value="PERSONAL">PERSONAL</option>
            </select>
          </div>

          <textarea
            placeholder="Write your detective observation, cross-reference, or theory..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={3}
            className="w-full bg-noir-950 border border-noir-700 rounded p-3 text-xs font-sans text-noir-200 placeholder-noir-500 outline-none focus:border-thread-500"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newTitle.trim() || !newContent.trim()}
              className="px-4 py-1.5 rounded bg-thread-800 border border-thread-500 text-thread-100 text-xs font-mono uppercase font-semibold hover:bg-thread-700 disabled:opacity-40"
            >
              Pin to Notebook
            </button>
          </div>
        </form>
      )}

      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-noir-500 border border-dashed border-noir-800 rounded-lg">
          <BookOpen size={28} className="mb-2 text-noir-600" />
          <h4 className="font-serif font-semibold text-sm text-noir-300">
            No notes in this category
          </h4>
          <p className="text-xs max-w-sm mt-1">
            Bookmark character statements during interrogation or click "Add Deduction" above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${
                note.pinned
                  ? "bg-noir-850 border-thread-700/80 shadow-noir-glow"
                  : "bg-noir-900 border-noir-800 hover:border-noir-700"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-noir-950 border border-noir-700 text-thread-400 font-semibold">
                    {note.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onTogglePin(note.id)}
                      title={note.pinned ? "Unpin Note" : "Pin Note"}
                      className={`p-1 rounded transition-colors ${
                        note.pinned ? "text-thread-400" : "text-noir-500 hover:text-noir-300"
                      }`}
                    >
                      <Pin size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      title="Delete Note"
                      className="p-1 rounded text-noir-500 hover:text-thread-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-sm text-noir-100 mb-1">
                  {note.title}
                </h3>
                <p className="text-xs font-sans text-noir-300 leading-relaxed whitespace-pre-line bg-noir-950 p-2.5 rounded border border-noir-850">
                  {note.content}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-noir-850 text-[10px] font-mono text-noir-500">
                Logged: {new Date(note.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
