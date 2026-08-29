"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/authContext";
import {
  GameState,
  loadStoredGameState,
  saveStoredGameState,
  clearStoredGameState,
  ActiveTab,
} from "@/lib/store/useGameStore";
import {
  InvestigationSummary,
  Difficulty,
  InterrogationMessage,
  PlayerNote,
  HypothesisItem,
  TheorySubmission,
} from "@/engine/schema";
import {
  getUserInvestigations,
  saveFullInvestigationState,
  getFullInvestigationState,
  deleteUserInvestigation,
} from "@/lib/firebase/realtimeDb";
import { LandingPage } from "@/components/landing/LandingPage";
import { AuthModal } from "@/components/auth/AuthModal";
import { ApplicationFormModal } from "@/components/auth/ApplicationFormModal";
import { DetectiveDashboard } from "@/components/dashboard/DetectiveDashboard";
import { IdentityCardModal } from "@/components/dashboard/IdentityCardModal";
import { ProfileEditModal } from "@/components/dashboard/ProfileEditModal";
import { NoirHeader } from "@/components/noir/NoirHeader";
import { SuspectDossier } from "@/components/noir/SuspectDossier";
import { InterrogationRoom } from "@/components/noir/InterrogationRoom";
import { EvidenceLocker } from "@/components/noir/EvidenceLocker";
import { CrimeSceneBriefing } from "@/components/noir/CrimeSceneBriefing";
import { TimelineBoard } from "@/components/noir/TimelineBoard";
import { DetectiveNotebook } from "@/components/noir/DetectiveNotebook";
import { HypothesisDesk } from "@/components/noir/HypothesisDesk";
import { AccusationModal } from "@/components/noir/AccusationModal";
import { ambientSound } from "@/lib/audio/ambientAudio";
import { Loader2 } from "lucide-react";

export default function TelltaleMasterPage() {
  const { user, profile, loading, needsOnboarding, logout } = useAuth();

  // Modals & UI States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isIdentityCardOpen, setIsIdentityCardOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isAccusationModalOpen, setIsAccusationModalOpen] = useState(false);
  const [isGeneratingCase, setIsGeneratingCase] = useState(false);

  // Investigation & Docket States
  const [userInvestigations, setUserInvestigations] = useState<InvestigationSummary[]>([]);
  const [activeInvestigationState, setActiveInvestigationState] = useState<GameState | null>(null);
  const [isInterrogating, setIsInterrogating] = useState(false);

  // Load user investigation docket on auth from Realtime Database
  useEffect(() => {
    async function loadDocket() {
      if (user) {
        const list = await getUserInvestigations(user.uid);
        setUserInvestigations(list);
      }
    }
    loadDocket();
  }, [user]);

  // Save active investigation state to Realtime Database on change
  useEffect(() => {
    if (activeInvestigationState && user) {
      saveFullInvestigationState(user.uid, activeInvestigationState);
    }
  }, [activeInvestigationState, user]);

  // Audio Ambience
  const handleToggleAudio = () => {
    if (!activeInvestigationState) return;
    const isPlaying = ambientSound.toggle();
    setActiveInvestigationState((prev) => (prev ? { ...prev, isAudioMuted: !isPlaying } : null));
  };

  // Generate / Start New Case
  const handleNewCase = async (difficulty: Difficulty = "Medium", useTestLillyCase: boolean = false) => {
    setIsGeneratingCase(true);
    try {
      const res = await fetch("/api/case/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty, useTestLillyCase }),
      });
      const data = await res.json();
      if (data.success) {
        const initialCharacterId = data.characters[0]?.character_id || "suspect-cam";
        const now = new Date().toISOString();

        const newState: GameState = {
          investigationId: data.investigationId,
          caseId: data.caseId || "case-001",
          caseNumber: data.caseNumber,
          title: data.title,
          subtitle: data.subtitle,
          difficulty: data.difficulty,
          status: "ACTIVE",
          createdAt: now,
          setting: data.setting,
          victim: data.victim,
          opening_scene: data.opening_scene,
          forensics: data.forensics,
          activeTab: "BRIEFING",
          selectedCharacterId: initialCharacterId,
          selectedEvidenceId: null,
          characters: data.characters,
          evidence: data.evidence,
          timeline: data.timeline,
          messages: [],
          notes: [
            {
              id: `note-init-${Date.now()}`,
              investigation_id: data.investigationId,
              category: "FACTS",
              title: `Initial Incident Report: ${data.caseNumber}`,
              content: `Victim ${data.victim?.name} discovered at ${data.setting?.estate_name}. Investigation opened under lead detective.`,
              is_auto_generated: true,
              pinned: true,
              created_at: now,
            },
          ],
          hypotheses: [],
          discoveredEvidenceIds: data.evidence.filter((e: any) => e.is_discovered).map((e: any) => e.evidence_id),
          unlockedTimelineIds: data.timeline.filter((t: any) => t.is_unlocked).map((t: any) => t.event_id),
          latestTheoryEvaluation: null,
          finalVerdict: null,
          isInterrogating: false,
          isAudioMuted: true,
          detectiveBadgeName: profile?.lastName ? `Detective ${profile.lastName}` : "Lead Detective",
        };

        setActiveInvestigationState(newState);

        if (user) {
          await saveFullInvestigationState(user.uid, newState);
          const updatedList = await getUserInvestigations(user.uid);
          setUserInvestigations(updatedList);
        }
      }
    } catch (err) {
      console.error("Failed to generate new case:", err);
    } finally {
      setIsGeneratingCase(false);
    }
  };

  // Resume Case from Docket
  const handleResumeCase = async (investigationId: string) => {
    if (!user) return;
    const loaded = await getFullInvestigationState(user.uid, investigationId);
    if (loaded) {
      setActiveInvestigationState(loaded);
    }
  };

  // Delete Case from Docket
  const handleDeleteCase = async (investigationId: string) => {
    if (!user) return;
    await deleteUserInvestigation(user.uid, investigationId);
    setUserInvestigations((prev) => prev.filter((i) => i.investigationId !== investigationId));
    if (activeInvestigationState?.investigationId === investigationId) {
      setActiveInvestigationState(null);
    }
  };

  // Return to Dashboard
  const handleReturnToDashboard = () => {
    if (activeInvestigationState && user) {
      saveFullInvestigationState(user.uid, activeInvestigationState);
    }
    setActiveInvestigationState(null);
  };

  // Interrogation Handler
  const handleAskQuestion = async (question: string) => {
    if (!activeInvestigationState || isInterrogating) return;

    const activeChar = activeInvestigationState.characters.find(
      (c) => c.character_id === activeInvestigationState.selectedCharacterId
    ) || {
      character_id: activeInvestigationState.selectedCharacterId,
      name: activeInvestigationState.selectedCharacterId === "police-dept" ? "Police Investigator" : "Medical Examiner",
      current_state: { stress: 20, fear: 10, anger: 10, defensiveness: 10, confidence: 80, cooperation: 80 },
    };

    const detectiveMsg: InterrogationMessage = {
      id: `msg-det-${Date.now()}`,
      investigation_id: activeInvestigationState.investigationId!,
      character_id: activeInvestigationState.selectedCharacterId,
      speaker: "detective",
      text: question,
      created_at: new Date().toISOString(),
    };

    setActiveInvestigationState((prev) => prev ? { ...prev, messages: [...prev.messages, detectiveMsg] } : null);
    setIsInterrogating(true);

    try {
      const prior = activeInvestigationState.messages
        .filter((m) => m.character_id === activeInvestigationState.selectedCharacterId)
        .slice(-6)
        .map((m) => ({ speaker: m.speaker, text: m.text }));

      const res = await fetch("/api/interrogation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investigationId: activeInvestigationState.investigationId,
          characterId: activeInvestigationState.selectedCharacterId,
          question,
          currentState: (activeChar as any).current_state,
          discoveredEvidenceIds: activeInvestigationState.discoveredEvidenceIds,
          priorMessages: prior,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setActiveInvestigationState((prev) => {
          if (!prev) return null;

          const updatedCharacters = prev.characters.map((c) =>
            c.character_id === activeInvestigationState.selectedCharacterId
              ? { ...c, current_state: data.emotionalState }
              : c
          );

          const newDiscoveredIds = Array.from(
            new Set([...prev.discoveredEvidenceIds, ...(data.newlyDiscoveredEvidenceIds || [])])
          );

          const updatedEvidence = prev.evidence.map((e) => ({
            ...e,
            is_discovered: newDiscoveredIds.includes(e.evidence_id),
          }));

          return {
            ...prev,
            characters: updatedCharacters,
            evidence: updatedEvidence,
            discoveredEvidenceIds: newDiscoveredIds,
            messages: [...prev.messages, data.message],
          };
        });
      }
    } catch (err) {
      console.error("Interrogation failure:", err);
    } finally {
      setIsInterrogating(false);
    }
  };

  // Examine Evidence
  const handleExamineEvidence = async (evidenceId: string) => {
    if (!activeInvestigationState) return;
    try {
      const res = await fetch("/api/evidence/examine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evidenceId }),
      });
      const data = await res.json();
      if (data.success && data.evidence) {
        setActiveInvestigationState((prev) => {
          if (!prev) return null;
          const updatedEvidence = prev.evidence.map((e) =>
            e.evidence_id === evidenceId
              ? {
                  ...e,
                  is_forensically_examined: true,
                  forensic_analysis: data.evidence.forensic_analysis,
                  forensic_facts: data.evidence.forensic_facts,
                  discoverable_facts: data.evidence.discoverable_facts,
                }
              : e
          );
          return { ...prev, evidence: updatedEvidence };
        });
      }
    } catch (err) {
      console.error("Evidence examine error:", err);
    }
  };

  // Notes
  const handleAddNote = (title: string, content: string, category: PlayerNote["category"]) => {
    if (!activeInvestigationState) return;
    const newNote: PlayerNote = {
      id: `note-${Date.now()}`,
      investigation_id: activeInvestigationState.investigationId!,
      category,
      title,
      content,
      is_auto_generated: false,
      pinned: false,
      created_at: new Date().toISOString(),
    };
    setActiveInvestigationState((prev) => prev ? { ...prev, notes: [newNote, ...prev.notes] } : null);
  };

  const handleTogglePinNote = (noteId: string) => {
    setActiveInvestigationState((prev) =>
      prev ? { ...prev, notes: prev.notes.map((n) => (n.id === noteId ? { ...n, pinned: !n.pinned } : n)) } : null
    );
  };

  const handleDeleteNote = (noteId: string) => {
    setActiveInvestigationState((prev) =>
      prev ? { ...prev, notes: prev.notes.filter((n) => n.id !== noteId) } : null
    );
  };

  // Hypotheses
  const handleSaveHypothesis = (
    hypothesisData: Omit<HypothesisItem, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ) => {
    if (!activeInvestigationState) return;
    const now = new Date().toISOString();
    const existingId = hypothesisData.id;

    if (existingId) {
      setActiveInvestigationState((prev) => {
        if (!prev) return null;
        const updated = prev.hypotheses.map((h) =>
          h.id === existingId
            ? { ...h, ...hypothesisData, updatedAt: now }
            : h
        );
        return { ...prev, hypotheses: updated };
      });
    } else {
      const newHypothesis: HypothesisItem = {
        ...hypothesisData,
        id: `hypo-${Date.now()}`,
        investigation_id: activeInvestigationState.investigationId!,
        createdAt: now,
        updatedAt: now,
      };
      setActiveInvestigationState((prev) =>
        prev ? { ...prev, hypotheses: [newHypothesis, ...prev.hypotheses] } : null
      );
    }
  };

  const handleDeleteHypothesis = (hypothesisId: string) => {
    setActiveInvestigationState((prev) =>
      prev ? { ...prev, hypotheses: prev.hypotheses.filter((h) => h.id !== hypothesisId) } : null
    );
  };

  // Final Accusation Submission
  const handleSubmitAccusation = async (
    submission: Omit<TheorySubmission, "investigation_id">
  ) => {
    if (!activeInvestigationState) return;
    try {
      const res = await fetch("/api/accusation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...submission,
          investigationId: activeInvestigationState.investigationId,
          discoveredEvidenceIds: activeInvestigationState.discoveredEvidenceIds,
        }),
      });
      const data = await res.json();
      if (data.success && data.verdict) {
        const resolvedStatus = data.verdict.outcome === "CASE_SOLVED" ? "SOLVED" : "FAILED";
        setActiveInvestigationState((prev) =>
          prev ? { ...prev, finalVerdict: data.verdict, status: resolvedStatus } : null
        );

        if (user) {
          const updatedSummary: InvestigationSummary = {
            investigationId: activeInvestigationState.investigationId!,
            caseId: activeInvestigationState.caseId,
            caseNumber: activeInvestigationState.caseNumber,
            title: activeInvestigationState.title,
            victimName: activeInvestigationState.victim?.name || "Unknown",
            location: activeInvestigationState.setting?.estate_name || "Unknown",
            difficulty: activeInvestigationState.difficulty as any,
            status: resolvedStatus,
            lastInvestigated: new Date().toISOString(),
            createdAt: activeInvestigationState.createdAt,
            verdictScore: data.verdict.verdict_score,
          };
          const existingList = await getUserInvestigations(user.uid);
          const filtered = existingList.filter((i) => i.investigationId !== updatedSummary.investigationId);
          setUserInvestigations([updatedSummary, ...filtered]);
        }
      }
    } catch (err) {
      console.error("Accusation processing error:", err);
    }
  };

  // 1. Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-noir-950 flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-12 h-12 rounded bg-thread-950 border border-thread-600 flex items-center justify-center text-thread-400 font-serif font-bold text-2xl shadow-noir-glow animate-pulse">
          Ψ
        </div>
        <h2 className="font-serif font-bold text-lg text-noir-100 uppercase tracking-widest">
          TELLTALE
        </h2>
        <Loader2 size={18} className="animate-spin text-thread-500" />
      </div>
    );
  }

  // 2. Unauthenticated: Landing Page
  if (!user) {
    return (
      <>
        <LandingPage onStartInterrogation={() => setIsAuthModalOpen(true)} />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  // 3. New User Onboarding: MY APPLICATION
  if (needsOnboarding || !profile) {
    return (
      <ApplicationFormModal
        isOpen={true}
        onComplete={() => setIsAuthModalOpen(false)}
      />
    );
  }

  // 4. Authenticated: Dashboard (when no active case in play)
  if (!activeInvestigationState) {
    return (
      <>
        <DetectiveDashboard
          profile={profile}
          investigations={userInvestigations}
          isGeneratingCase={isGeneratingCase}
          onNewCase={handleNewCase}
          onResumeCase={handleResumeCase}
          onDeleteCase={handleDeleteCase}
          onOpenIdentityCard={() => setIsIdentityCardOpen(true)}
          onOpenEditProfile={() => setIsProfileEditOpen(true)}
          onLogout={logout}
        />

        <IdentityCardModal
          isOpen={isIdentityCardOpen}
          onClose={() => setIsIdentityCardOpen(false)}
          profile={profile}
          onOpenEditProfile={() => setIsProfileEditOpen(true)}
        />

        <ProfileEditModal
          isOpen={isProfileEditOpen}
          onClose={() => setIsProfileEditOpen(false)}
          profile={profile}
        />
      </>
    );
  }

  // 5. Active Case Investigation Room
  const selectedChar =
    activeInvestigationState.characters.find(
      (c) => c.character_id === activeInvestigationState.selectedCharacterId
    ) ||
    (activeInvestigationState.selectedCharacterId === "police-dept" || activeInvestigationState.selectedCharacterId === "witness-briggs"
      ? {
          character_id: "witness-briggs",
          name: "Officer Thomas Briggs (Police)",
          age: 49,
          occupation: "Senior Patrol Officer, County Sheriff",
          relation_to_victim: "First Responder / Scene Security",
          role: "police" as any,
          avatar_code: "TB",
          description: "Weathered patrol officer in a drenched raincoat. He logs vehicle gate records and secures the scene.",
          alibi: { claimed_location: "Patrol Sector 4", claimed_activity: "Road patrol", claimed_time_range: "All Evening" },
          current_state: { stress: 20, fear: 10, anger: 10, defensiveness: 10, confidence: 90, cooperation: 95 },
        }
      : activeInvestigationState.selectedCharacterId === "forensics-dept"
      ? {
          character_id: "forensics-dept",
          name: "Dr. Karen Moss (Forensics & Pathology)",
          age: 44,
          occupation: "Chief Forensic Medical Examiner",
          relation_to_victim: "Official State Pathologist",
          role: "forensics" as any,
          avatar_code: "KM",
          description: "Scientific and precise. Conducts cranial trauma assays, lung fluid spectroscopy, and toxicology reports.",
          alibi: { claimed_location: "County Morgue", claimed_activity: "Autopsy analysis", claimed_time_range: "Post-Mortem" },
          current_state: { stress: 10, fear: 5, anger: 5, defensiveness: 10, confidence: 95, cooperation: 95 },
        }
      : activeInvestigationState.characters[0]);

  return (
    <div className="min-h-screen bg-noir-950 text-noir-100 flex flex-col font-sans selection:bg-thread-900 selection:text-thread-100">
      {/* Universal Header */}
      <NoirHeader
        caseNumber={activeInvestigationState.caseNumber}
        title={activeInvestigationState.title}
        activeTab={activeInvestigationState.activeTab}
        setActiveTab={(tab) =>
          setActiveInvestigationState((prev) => (prev ? { ...prev, activeTab: tab } : null))
        }
        isAudioMuted={activeInvestigationState.isAudioMuted}
        toggleAudio={handleToggleAudio}
        onReturnToDashboard={handleReturnToDashboard}
        onOpenAccusation={() => setIsAccusationModalOpen(true)}
        discoveredEvidenceCount={activeInvestigationState.evidence.filter((e) => e.is_discovered).length}
        totalEvidenceCount={activeInvestigationState.evidence.length}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-5">
        {activeInvestigationState.activeTab === "BRIEFING" && (
          <CrimeSceneBriefing
            setting={activeInvestigationState.setting}
            victim={activeInvestigationState.victim}
            opening_scene={activeInvestigationState.opening_scene}
            forensics={activeInvestigationState.forensics}
            onProceedToInterrogation={() =>
              setActiveInvestigationState((prev) => (prev ? { ...prev, activeTab: "INTERROGATION" } : null))
            }
          />
        )}

        {activeInvestigationState.activeTab === "INTERROGATION" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Suspect Roster Left Panel (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <SuspectDossier
                characters={activeInvestigationState.characters}
                selectedCharacterId={activeInvestigationState.selectedCharacterId}
                onSelectCharacter={(id) =>
                  setActiveInvestigationState((prev) => (prev ? { ...prev, selectedCharacterId: id } : null))
                }
              />
            </div>

            {/* Interrogation Room Center (8 cols) */}
            <div className="lg:col-span-8">
              <InterrogationRoom
                character={selectedChar}
                messages={activeInvestigationState.messages}
                evidenceList={activeInvestigationState.evidence}
                isInterrogating={isInterrogating}
                onAskQuestion={handleAskQuestion}
                onAddNote={handleAddNote}
              />
            </div>
          </div>
        )}

        {activeInvestigationState.activeTab === "EVIDENCE" && (
          <EvidenceLocker
            evidenceList={activeInvestigationState.evidence}
            onExamineEvidence={handleExamineEvidence}
            onAddNote={handleAddNote}
          />
        )}

        {activeInvestigationState.activeTab === "TIMELINE" && (
          <TimelineBoard
            timeline={activeInvestigationState.timeline}
            characters={activeInvestigationState.characters}
          />
        )}

        {activeInvestigationState.activeTab === "NOTEBOOK" && (
          <DetectiveNotebook
            notes={activeInvestigationState.notes}
            onAddNote={handleAddNote}
            onTogglePin={handleTogglePinNote}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {activeInvestigationState.activeTab === "THEORY" && (
          <HypothesisDesk
            characters={activeInvestigationState.characters}
            evidenceList={activeInvestigationState.evidence}
            hypotheses={activeInvestigationState.hypotheses}
            onSaveHypothesis={handleSaveHypothesis}
            onDeleteHypothesis={handleDeleteHypothesis}
            onProceedToAccusation={() => setIsAccusationModalOpen(true)}
          />
        )}
      </main>

      {/* Final Accusation Modal */}
      <AccusationModal
        isOpen={isAccusationModalOpen}
        onClose={() => setIsAccusationModalOpen(false)}
        characters={activeInvestigationState.characters}
        evidenceList={activeInvestigationState.evidence}
        finalVerdict={activeInvestigationState.finalVerdict}
        onSubmitAccusation={handleSubmitAccusation}
        onReturnToDashboard={handleReturnToDashboard}
      />
    </div>
  );
}
