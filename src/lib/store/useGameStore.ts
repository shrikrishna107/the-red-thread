import {
  AccusationResult,
  EmotionalState,
  HypothesisItem,
  InterrogationMessage,
  InvestigationStatus,
  PlayerNote,
  TheoryEvaluationResult,
} from "@/engine/schema";

export type ActiveTab =
  | "BRIEFING"
  | "INTERROGATION"
  | "EVIDENCE"
  | "TIMELINE"
  | "NOTEBOOK"
  | "THEORY"
  | "ACCUSATION";

export interface ClientCharacter {
  character_id: string;
  name: string;
  age: number;
  occupation: string;
  relation_to_victim: string;
  role: "suspect" | "witness" | "police" | "forensics" | "expert";
  avatar_code: string;
  description: string;
  alibi: {
    claimed_location: string;
    claimed_activity: string;
    claimed_time_range: string;
  };
  current_state: EmotionalState;
}

export interface ClientEvidence {
  evidence_id: string;
  name: string;
  category: string;
  location_found: string;
  initial_description: string;
  is_discovered: boolean;
  is_forensically_examined: boolean;
  forensic_facts?: string[];
  discoverable_facts?: string[];
  forensic_analysis?: string;
}

export interface ClientTimelineEvent {
  event_id: string;
  timestamp: string;
  location: string;
  summary: string;
  involved_characters: string[];
  is_unlocked: boolean;
}

export interface GameState {
  investigationId: string | null;
  caseId: string;
  caseNumber: string;
  title: string;
  subtitle: string;
  difficulty: string;
  status: InvestigationStatus;
  createdAt: string;
  setting: any;
  victim: any;
  opening_scene: any;
  forensics: any;
  activeTab: ActiveTab;
  selectedCharacterId: string;
  selectedEvidenceId: string | null;
  characters: ClientCharacter[];
  evidence: ClientEvidence[];
  timeline: ClientTimelineEvent[];
  messages: InterrogationMessage[];
  notes: PlayerNote[];
  hypotheses: HypothesisItem[];
  discoveredEvidenceIds: string[];
  unlockedTimelineIds: string[];
  latestTheoryEvaluation: TheoryEvaluationResult | null;
  finalVerdict: AccusationResult | null;
  isInterrogating: boolean;
  isAudioMuted: boolean;
  detectiveBadgeName: string;
}

const STORAGE_KEY = "TELLTALE_ACTIVE_INVESTIGATION_V2";

export function loadStoredGameState(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse local storage game state:", e);
    return null;
  }
}

export function saveStoredGameState(state: GameState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to write game state to local storage:", e);
  }
}

export function clearStoredGameState() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
