import { ref, set, get, child, remove, update } from "firebase/database";
import { rtdb } from "./config";
import { UserProfile, InvestigationSummary, PlayerNote, HypothesisItem, InterrogationMessage, AccusationResult } from "@/engine/schema";
import { GameState } from "@/lib/store/useGameStore";

const LOCAL_PROFILE_PREFIX = "TELLTALE_RTDB_PROFILE_";
const LOCAL_CASES_PREFIX = "TELLTALE_RTDB_CASES_";
const LOCAL_INV_PREFIX = "TELLTALE_RTDB_INV_";

// ============================================================================
// 1. USER PROFILE REALTIME DATABASE OPERATIONS
// ============================================================================

export async function saveUserProfile(userId: string, profile: UserProfile): Promise<boolean> {
  let rtdbSuccess = false;

  try {
    if (rtdb && typeof window !== "undefined") {
      const profileRef = ref(rtdb, `users/${userId}/profile`);
      await set(profileRef, profile);
      rtdbSuccess = true;
    }
  } catch (err) {
    console.warn("Firebase Realtime Database save profile error (fallback to local mirror):", err);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(`${LOCAL_PROFILE_PREFIX}${userId}`, JSON.stringify(profile));
  }

  return true;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    if (rtdb && typeof window !== "undefined") {
      const dbRef = ref(rtdb);
      const snapshot = await get(child(dbRef, `users/${userId}/profile`));
      if (snapshot.exists()) {
        const val = snapshot.val() as UserProfile;
        if (typeof window !== "undefined") {
          localStorage.setItem(`${LOCAL_PROFILE_PREFIX}${userId}`, JSON.stringify(val));
        }
        return val;
      }
    }
  } catch (err) {
    console.warn("Firebase Realtime Database fetch profile error (using local mirror):", err);
  }

  if (typeof window !== "undefined") {
    const local = localStorage.getItem(`${LOCAL_PROFILE_PREFIX}${userId}`);
    if (local) {
      try {
        return JSON.parse(local) as UserProfile;
      } catch (e) {
        console.error("Local profile parse error:", e);
      }
    }
  }
  return null;
}

// ============================================================================
// 2. INVESTIGATION CASES REALTIME DATABASE OPERATIONS
// ============================================================================

export async function getUserInvestigations(userId: string): Promise<InvestigationSummary[]> {
  try {
    if (rtdb && typeof window !== "undefined") {
      const dbRef = ref(rtdb);
      const snapshot = await get(child(dbRef, `users/${userId}/cases`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list: InvestigationSummary[] = [];

        Object.keys(data).forEach((caseId) => {
          const c = data[caseId];
          const meta = c.metadata || {};
          list.push({
            investigationId: caseId,
            caseId: meta.caseId || caseId,
            caseNumber: meta.caseNumber || "CASE #T-001",
            title: meta.title || "Untitled Case",
            victimName: meta.victimName || "Unknown Victim",
            location: meta.location || "Unknown Location",
            difficulty: meta.difficulty || "Medium",
            status: meta.status || "ACTIVE",
            lastInvestigated: meta.lastInvestigated || new Date().toISOString(),
            createdAt: meta.createdAt || new Date().toISOString(),
            verdictScore: c.result?.verdict_score,
          });
        });

        list.sort((a, b) => new Date(b.lastInvestigated).getTime() - new Date(a.lastInvestigated).getTime());
        
        if (typeof window !== "undefined") {
          localStorage.setItem(`${LOCAL_CASES_PREFIX}${userId}`, JSON.stringify(list));
        }
        return list;
      }
    }
  } catch (err) {
    console.warn("Firebase Realtime Database fetch cases error (using local mirror):", err);
  }

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(`${LOCAL_CASES_PREFIX}${userId}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error("Local parse error:", e);
      }
    }
  }
  return [];
}

export async function saveFullInvestigationState(userId: string, state: GameState): Promise<boolean> {
  if (!state.investigationId) return false;
  const caseId = state.investigationId;
  const now = new Date().toISOString();

  const casePayload = {
    metadata: {
      caseId: state.caseId || "case-001",
      caseNumber: state.caseNumber,
      title: state.title,
      subtitle: state.subtitle,
      difficulty: state.difficulty,
      victimName: state.victim?.name || "Unknown",
      location: state.setting?.estate_name || "Unknown",
      status: state.status || "ACTIVE",
      createdAt: state.createdAt || now,
      lastInvestigated: now,
    },
    setting: state.setting,
    victim: state.victim,
    opening_scene: state.opening_scene,
    forensics: state.forensics,
    activeTab: state.activeTab,
    selectedCharacterId: state.selectedCharacterId,
    characters: state.characters || [],
    evidence: state.evidence || [],
    discoveredEvidenceIds: state.discoveredEvidenceIds || [],
    timeline: state.timeline || [],
    unlockedTimelineIds: state.unlockedTimelineIds || [],
    messages: state.messages || [],
    notes: state.notes || [],
    hypotheses: state.hypotheses || [],
    result: state.finalVerdict || null,
  };

  try {
    if (rtdb && typeof window !== "undefined") {
      const caseRef = ref(rtdb, `users/${userId}/cases/${caseId}`);
      await set(caseRef, casePayload);
    }
  } catch (err) {
    console.warn("Firebase Realtime Database write error for case (saved locally):", err);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(`${LOCAL_INV_PREFIX}${caseId}`, JSON.stringify(state));
    const existing = await getUserInvestigations(userId);
    const summary: InvestigationSummary = {
      investigationId: caseId,
      caseId: state.caseId || "case-001",
      caseNumber: state.caseNumber,
      title: state.title,
      victimName: state.victim?.name || "Unknown",
      location: state.setting?.estate_name || "Unknown",
      difficulty: state.difficulty as any || "Medium",
      status: state.status || "ACTIVE",
      lastInvestigated: now,
      createdAt: state.createdAt || now,
      verdictScore: state.finalVerdict?.verdict_score,
    };
    const updatedList = [summary, ...existing.filter((i) => i.investigationId !== caseId)];
    localStorage.setItem(`${LOCAL_CASES_PREFIX}${userId}`, JSON.stringify(updatedList));
  }

  return true;
}

export async function getFullInvestigationState(userId: string, investigationId: string): Promise<GameState | null> {
  try {
    if (rtdb && typeof window !== "undefined") {
      const dbRef = ref(rtdb);
      const snapshot = await get(child(dbRef, `users/${userId}/cases/${investigationId}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const meta = data.metadata || {};

        const reconstructed: GameState = {
          investigationId,
          caseId: meta.caseId || "case-001",
          caseNumber: meta.caseNumber || "CASE #T-001",
          title: meta.title || "The Case",
          subtitle: meta.subtitle || "",
          difficulty: meta.difficulty || "Medium",
          status: meta.status || "ACTIVE",
          createdAt: meta.createdAt || new Date().toISOString(),
          setting: data.setting || {},
          victim: data.victim || {},
          opening_scene: data.opening_scene || {},
          forensics: data.forensics || {},
          activeTab: data.activeTab || "BRIEFING",
          selectedCharacterId: data.selectedCharacterId || "suspect-cam",
          selectedEvidenceId: null,
          characters: data.characters || [],
          evidence: data.evidence || [],
          timeline: data.timeline || [],
          messages: data.messages || [],
          notes: data.notes || [],
          hypotheses: data.hypotheses || [],
          discoveredEvidenceIds: data.discoveredEvidenceIds || [],
          unlockedTimelineIds: data.unlockedTimelineIds || [],
          latestTheoryEvaluation: null,
          finalVerdict: data.result || null,
          isInterrogating: false,
          isAudioMuted: true,
          detectiveBadgeName: "Lead Detective",
        };

        if (typeof window !== "undefined") {
          localStorage.setItem(`${LOCAL_INV_PREFIX}${investigationId}`, JSON.stringify(reconstructed));
        }

        return reconstructed;
      }
    }
  } catch (err) {
    console.warn("Firebase Realtime Database fetch state error (using local mirror):", err);
  }

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(`${LOCAL_INV_PREFIX}${investigationId}`);
    if (raw) {
      try {
        return JSON.parse(raw) as GameState;
      } catch (e) {
        console.error("Local parse error:", e);
      }
    }
  }
  return null;
}

export async function deleteUserInvestigation(userId: string, investigationId: string): Promise<boolean> {
  try {
    if (rtdb && typeof window !== "undefined") {
      const caseRef = ref(rtdb, `users/${userId}/cases/${investigationId}`);
      await remove(caseRef);
    }
  } catch (err) {
    console.warn("Firebase Realtime Database delete error:", err);
  }

  if (typeof window !== "undefined") {
    const existing = await getUserInvestigations(userId);
    const filtered = existing.filter((s) => s.investigationId !== investigationId);
    localStorage.setItem(`${LOCAL_CASES_PREFIX}${userId}`, JSON.stringify(filtered));
    localStorage.removeItem(`${LOCAL_INV_PREFIX}${investigationId}`);
  }

  return true;
}
