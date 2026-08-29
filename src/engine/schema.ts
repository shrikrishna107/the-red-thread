// ============================================================================
// TELLTALE — CORE ENGINE SCHEMA & DOMAIN TYPES
// ============================================================================

export type Difficulty = "Easy" | "Medium" | "Hard" | "Expert";

export type RoleType = "suspect" | "witness" | "police" | "forensics" | "expert" | "investigator";

export type QuestionType =
  | "fact_inquiry"
  | "timeline_inquiry"
  | "alibi_challenge"
  | "accusation"
  | "contradiction_challenge"
  | "evidence_question"
  | "relationship_question"
  | "motive_question"
  | "emotional_question"
  | "behavioral_observation"
  | "clarification"
  | "hypothetical"
  | "procedural_police"
  | "forensic_medical"
  | "casual"
  | "irrelevant"
  | "nonsense"
  | "meta_investigation";

export type RelevanceLevel =
  | "HIGHLY_RELEVANT"
  | "RELEVANT"
  | "POTENTIALLY_RELEVANT"
  | "LOW_RELEVANCE"
  | "IRRELEVANT"
  | "NONSENSICAL";

export interface EmotionalState {
  stress: number; // 0 - 100
  fear: number; // 0 - 100
  anger: number; // 0 - 100
  defensiveness: number; // 0 - 100
  confidence: number; // 0 - 100
  cooperation: number; // 0 - 100
}

export interface CharacterPersonality {
  temperament: string;
  communication_style: string;
  baseline_confidence: number;
  baseline_cooperativeness: number;
  baseline_aggression: number;
  vulnerability_triggers: string[];
  tell_patterns: string[];
}

export interface MurderInvolvement {
  is_killer: boolean;
  is_accomplice: boolean;
  knows_killer_identity: boolean;
  knows_murder_occurred: boolean;
}

export interface CharacterSecret {
  secret_id: string;
  topic: string;
  description: string;
  reason_to_hide: string;
  related_character_ids?: string[];
  related_evidence_ids?: string[];
  trigger_keywords: string[];
}

export interface CharacterLie {
  lie_id: string;
  claim: string;
  actual_truth: string;
  motivation_for_lie: string;
  contradicting_evidence_ids: string[];
  contradicting_statement_ids?: string[];
  break_threshold_stress: number;
}

export interface Character {
  character_id: string;
  name: string;
  age: number;
  occupation: string;
  relation_to_victim: string;
  role: RoleType;
  avatar_code: string;
  description: string;
  personality: CharacterPersonality;
  murder_involvement: MurderInvolvement;
  known_facts: string[];
  hidden_facts: string[];
  secrets: CharacterSecret[];
  lies: CharacterLie[];
  fears: string[];
  motivations: string[];
  alibi: {
    claimed_location: string;
    claimed_activity: string;
    claimed_time_range: string;
    is_true: boolean;
    vulnerabilities: string[];
  };
  initial_state: EmotionalState;
}

export interface CaseFact {
  fact_id: string;
  category: "timeline" | "forensic" | "motive" | "relationship" | "location" | "behavior" | "police";
  summary: string;
  details: string;
  is_canonical_truth: boolean;
  is_red_herring?: boolean;
}

export interface TimelineEvent {
  event_id: string;
  timestamp: string;
  time_numeric: number;
  location: string;
  summary: string;
  involved_character_ids: string[];
  is_murder_event: boolean;
  witness_character_ids: string[];
  canonical_truth: string;
  public_initial_knowledge: boolean;
}

export interface EvidenceItem {
  evidence_id: string;
  name: string;
  category: "physical" | "document" | "digital" | "forensic" | "biological";
  location_found: string;
  initial_description: string;
  canonical_truth: string;
  discoverable_facts: string[];
  forensic_facts: string[];
  related_characters: string[];
  related_events: string[];
  examined_initially: boolean;
  is_red_herring?: boolean;
}

export interface ForensicReport {
  autopsy_id: string;
  estimated_time_of_death: string;
  official_cause_of_death: string;
  contusions_and_wounds: string[];
  toxicology_findings: string[];
  stomach_contents?: string;
  pool_water_analysis?: string;
  initial_examiner_notes: string;
  deep_forensics_revealed: boolean;
}

export interface CaseRelationship {
  source_character_id: string;
  target_character_id: string;
  relation_type: string;
  public_status: string;
  hidden_truth: string;
  tension_level: number;
}

export interface CanonicalTruth {
  killer_id: string;
  killer_name: string;
  motive_category: "greed" | "revenge" | "blackmail" | "passion" | "fear" | "cover_up";
  motive_details: string;
  method: string;
  weapon_id: string;
  weapon_name: string;
  cause_of_death: string;
  murder_location: string;
  murder_timestamp: string;
  body_disposal: string;
  complete_narrative: string;
}

export interface CaseSolutionCriteria {
  required_killer_id: string;
  accepted_motive_keywords: string[];
  accepted_weapon_ids: string[];
  accepted_timeline_events: string[];
  critical_evidence_ids: string[];
  key_contradictions: string[];
}

export interface CaseBible {
  case_id: string;
  case_number: string;
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  setting: {
    estate_name: string;
    location_description: string;
    weather: string;
    time_of_discovery: string;
    atmosphere: string;
  };
  victim: {
    victim_id: string;
    name: string;
    age: number;
    occupation: string;
    background: string;
    last_seen: string;
  };
  truth: CanonicalTruth;
  solution_criteria: CaseSolutionCriteria;
  characters: Character[];
  relationships: CaseRelationship[];
  facts: CaseFact[];
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
  forensics: ForensicReport;
  red_herrings: {
    herring_id: string;
    title: string;
    description: string;
    apparent_suspicion: string;
    innocent_explanation: string;
  }[];
  opening_scene: {
    title: string;
    briefing: string;
    initial_observations: string[];
    available_characters: string[];
    available_evidence: string[];
  };
}

// ============================================================================
// USER PROFILES, IDENTITY CARDS & DASHBOARD TYPES
// ============================================================================

export interface UserProfile {
  userId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  aliases: string[];
  email: string;
  photoURL?: string;
  detectiveId: string;
  casesSolved: number;
  casesStarted: number;
  createdAt: string;
  updatedAt: string;
}

export type InvestigationStatus =
  | "GENERATING"
  | "READY"
  | "ACTIVE"
  | "PENDING"
  | "PAUSED"
  | "SOLVED"
  | "FAILED"
  | "ABANDONED";

export interface InvestigationSummary {
  investigationId: string;
  caseId: string;
  caseNumber: string;
  title: string;
  victimName: string;
  location: string;
  difficulty: Difficulty;
  status: InvestigationStatus;
  lastInvestigated: string;
  createdAt: string;
  verdictScore?: number;
}

export interface HypothesisItem {
  id: string;
  investigation_id: string;
  title: string;
  suspect_id: string;
  motive: string;
  weapon_id: string;
  timeline_summary: string;
  supporting_evidence_ids: string[];
  narrative: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// RUNTIME INTERACTION & INTERROGATION TYPES
// ============================================================================

export interface QuestionInterpretation {
  target_character_id: string;
  topic: string;
  entities: string[];
  time_reference?: string;
  location_reference?: string;
  question_type: QuestionType;
  emotional_intent: "neutral" | "pressuring" | "sympathetic" | "aggressive" | "baiting" | "casual";
  is_accusatory: boolean;
  references_previous_statement: boolean;
  references_evidence_id?: string;
  relevance: RelevanceLevel;
  confidence: number;
}

export interface GeminiInterrogationContext {
  character_name: string;
  character_role: string;
  personality_summary: string;
  current_emotional_state: EmotionalState;
  what_character_knows: string[];
  what_character_must_hide: string[];
  character_active_lies: string[];
  relevant_discovered_evidence: string[];
  prior_dialogue_summary: string[];
  player_question: string;
  interpretation: QuestionInterpretation;
  setting_atmosphere: string;
}

export interface GeminiInterrogationResponse {
  spoken_response: string;
  physical_observation: string;
  emotional_shift: {
    stress: number;
    fear: number;
    anger: number;
    defensiveness: number;
    cooperation: number;
  };
  revealed_fact_ids: string[];
  referenced_fact_ids: string[];
  tone: string;
  follow_up_hook?: string;
}

export interface InterrogationMessage {
  id: string;
  investigation_id: string;
  character_id: string;
  speaker: "detective" | "character";
  text: string;
  physical_observation?: string;
  tone?: string;
  question_type?: QuestionType;
  relevance?: RelevanceLevel;
  emotional_snapshot?: EmotionalState;
  created_at: string;
}

export interface PlayerNote {
  id: string;
  investigation_id: string;
  category: "PEOPLE" | "EVIDENCE" | "FACTS" | "TIMELINE" | "CONTRADICTIONS" | "THEORIES" | "PERSONAL";
  title: string;
  content: string;
  is_auto_generated: boolean;
  pinned: boolean;
  created_at: string;
}

export interface TheorySubmission {
  investigation_id: string;
  suspect_id: string;
  motive: string;
  weapon_id: string;
  timeline_summary: string;
  supporting_evidence_ids: string[];
  explanation: string;
}

export interface TheoryEvaluationResult {
  is_murderer_correct: boolean;
  is_motive_correct: boolean;
  is_weapon_correct: boolean;
  timeline_accuracy_score: number;
  evidence_strength_score: number;
  overall_score: number;
  detective_critique: string;
  strengths: string[];
  inconsistencies: string[];
  unanswered_questions: string[];
  evaluation_verdict: "STRONG_CASE" | "PLAUSIBLE_BUT_LEAKY" | "FLAWED_THEORY" | "WILD_GUESS";
}

export type EndingOutcome =
  | "CASE_SOLVED"
  | "PARTIALLY_CORRECT"
  | "WRONG_ACCUSATION"
  | "INSUFFICIENT_EVIDENCE"
  | "UNSOLVED";

export interface AccusationResult {
  outcome: EndingOutcome;
  title: string;
  verdict_score: number;
  summary: string;
  detailed_breakdown: {
    murderer_match: boolean;
    weapon_match: boolean;
    motive_match: boolean;
    evidence_sufficiency: boolean;
  };
  what_you_got_right: string[];
  what_you_missed: string[];
  what_misled_you: string[];
  key_clues_found: string[];
  aftermath_narrative: string;
  canonical_truth_reveal: CanonicalTruth;
}
