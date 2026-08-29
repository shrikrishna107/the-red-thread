"use client";

import React, { useState } from "react";
import { UserProfile } from "@/engine/schema";
import { useAuth } from "@/lib/firebase/authContext";
import { X, Save, Plus } from "lucide-react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export function ProfileEditModal({ isOpen, onClose, profile }: ProfileEditModalProps) {
  const { saveProfile } = useAuth();
  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [middleName, setMiddleName] = useState(profile?.middleName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");
  const [age, setAge] = useState<number | "">(profile?.age || 30);
  const [gender, setGender] = useState<"Male" | "Female" | "Other">(profile?.gender || "Male");
  const [aliasInput, setAliasInput] = useState("");
  const [aliases, setAliases] = useState<string[]>(profile?.aliases || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddAlias = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (("key" in e && e.key === "Enter") || e.type === "click") {
      e.preventDefault();
      if (aliasInput.trim() && !aliases.includes(aliasInput.trim())) {
        setAliases([...aliases, aliasInput.trim()]);
        setAliasInput("");
      }
    }
  };

  const handleRemoveAlias = (tag: string) => {
    setAliases(aliases.filter((a) => a !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !age || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await saveProfile({
        firstName: firstName.trim(),
        middleName: middleName.trim() || undefined,
        lastName: lastName.trim(),
        age: Number(age),
        gender,
        aliases,
        detectiveId: profile.detectiveId,
      });
      onClose();
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-noir-900 border border-noir-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 bg-noir-950 border-b border-noir-800 flex items-center justify-between">
          <span className="font-serif font-bold text-sm tracking-wider uppercase text-noir-100">
            EDIT INVESTIGATOR CREDENTIALS
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded text-noir-400 hover:text-noir-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-noir-300 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 bg-noir-950 border border-noir-700 focus:border-thread-600 rounded text-xs text-noir-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-noir-400 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-full px-3 py-2 bg-noir-950 border border-noir-700 focus:border-thread-600 rounded text-xs text-noir-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-noir-300 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 bg-noir-950 border border-noir-700 focus:border-thread-600 rounded text-xs text-noir-100 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-noir-300 mb-1">
                Age *
              </label>
              <input
                type="number"
                required
                min={18}
                max={99}
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2 bg-noir-950 border border-noir-700 focus:border-thread-600 rounded text-xs text-noir-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase text-noir-300 mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 bg-noir-950 border border-noir-700 focus:border-thread-600 rounded text-xs text-noir-100 outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Aliases */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-noir-300 mb-1">
              Code Names / Aliases
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add alias..."
                value={aliasInput}
                onChange={(e) => setAliasInput(e.target.value)}
                onKeyDown={handleAddAlias}
                className="flex-1 px-3 py-2 bg-noir-950 border border-noir-700 focus:border-thread-600 rounded text-xs text-noir-100 outline-none"
              />
              <button
                type="button"
                onClick={handleAddAlias}
                className="px-3 py-2 rounded bg-noir-850 border border-noir-700 text-noir-200 hover:bg-noir-800 text-xs font-mono"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded bg-noir-950 border border-noir-850">
              {aliases.map((alias) => (
                <span
                  key={alias}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-thread-950 border border-thread-800 text-[11px] font-mono text-thread-300"
                >
                  <span>{alias}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAlias(alias)}
                    className="hover:text-thread-100"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-noir-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-noir-800 border border-noir-700 text-noir-300 text-xs font-mono uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded bg-thread-900 border border-thread-600 text-thread-100 text-xs font-mono uppercase font-semibold flex items-center gap-2 hover:bg-thread-800 shadow-noir-glow"
            >
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
