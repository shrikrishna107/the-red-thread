import {
  CaseBible,
  Character,
  EmotionalState,
  GeminiInterrogationContext,
  QuestionInterpretation,
} from "./schema";

export interface KnowledgeEvaluationResult {
  allowedRevealedFactIds: string[];
  forbiddenFactIds: string[];
  activeLie?: {
    lieId: string;
    claim: string;
    actualTruth: string;
  };
  triggeredSecret?: {
    secretId: string;
    description: string;
  };
  isUnderCrackingPressure: boolean;
  computedEmotionalShift: {
    stress: number;
    fear: number;
    anger: number;
    defensiveness: number;
    cooperation: number;
  };
  contextForGemini: GeminiInterrogationContext;
}

export function evaluateCharacterKnowledge(
  character: Character,
  currentState: EmotionalState,
  interpretation: QuestionInterpretation,
  caseBible: CaseBible,
  discoveredEvidenceIds: string[] = [],
  priorDialogue: { speaker: string; text: string }[] = []
): KnowledgeEvaluationResult {
  const lowerQ = interpretation.topic.toLowerCase();
  let stressDelta = 0;
  let fearDelta = 0;
  let angerDelta = 0;
  let defDelta = 0;
  let coopDelta = 0;

  // 1. Check Personality Vulnerability Triggers
  const hitVulnerability = character.personality.vulnerability_triggers.some((trig) =>
    interpretation.entities.includes(trig) ||
    lowerQ.includes(trig.toLowerCase()) ||
    (interpretation.references_evidence_id && trig.toLowerCase().includes(interpretation.references_evidence_id.replace("evidence_", "")))
  );

  if (hitVulnerability) {
    stressDelta += 15;
    defDelta += 15;
    fearDelta += 10;
    coopDelta -= 10;
  }

  // 2. Check Intent Pressure
  if (interpretation.is_accusatory) {
    stressDelta += 20;
    angerDelta += 15;
    defDelta += 25;
    coopDelta -= 15;
  } else if (interpretation.question_type === "contradiction_challenge") {
    stressDelta += 25;
    defDelta += 20;
    coopDelta -= 10;
  } else if (interpretation.emotional_intent === "sympathetic") {
    stressDelta -= 5;
    defDelta -= 10;
    coopDelta += 10;
  } else if (interpretation.question_type === "casual") {
    stressDelta -= 5;
    defDelta -= 5;
  }

  // 3. Secrets Evaluation
  let triggeredSecret: { secretId: string; description: string } | undefined = undefined;
  for (const secret of character.secrets) {
    const matched = secret.trigger_keywords.some((kw) =>
      lowerQ.includes(kw.toLowerCase()) ||
      interpretation.entities.some((e) => e.toLowerCase().includes(kw.toLowerCase()))
    );
    if (matched) {
      triggeredSecret = {
        secretId: secret.secret_id,
        description: secret.description,
      };
      stressDelta += 20;
      fearDelta += 25;
      defDelta += 20;
      break;
    }
  }

  // 4. Lies & Contradictions Evaluation
  let activeLie: { lieId: string; claim: string; actualTruth: string } | undefined = undefined;
  for (const lie of character.lies) {
    const evidencePresented = lie.contradicting_evidence_ids.some((eId) =>
      discoveredEvidenceIds.includes(eId) && interpretation.entities.includes(eId)
    );
    if (evidencePresented || interpretation.question_type === "alibi_challenge" || interpretation.question_type === "contradiction_challenge") {
      activeLie = {
        lieId: lie.lie_id,
        claim: lie.claim,
        actualTruth: lie.actual_truth,
      };
      break;
    }
  }

  // Check if stress exceeds cracking threshold (stress >= 85)
  const projectedStress = Math.min(100, Math.max(0, currentState.stress + stressDelta));
  const isUnderCrackingPressure = projectedStress >= 85;

  // 5. Allowed vs Forbidden Facts
  const allFactsMap = new Map(caseBible.facts.map((f) => [f.fact_id, f]));
  const knownFactSummaries: string[] = [];
  const hiddenFactSummaries: string[] = [];
  const allowedFactIds: string[] = [];

  for (const secret of character.secrets) {
    hiddenFactSummaries.push(`[SECRET - CONCEAL]: ${secret.topic} - ${secret.description}`);
  }

  for (const factId of character.known_facts) {
    const fact = allFactsMap.get(factId);
    if (fact) {
      if (character.hidden_facts.includes(factId)) {
        hiddenFactSummaries.push(`[GUILTY KNOWLEDGE - DO NOT VOLUNTEER]: ${fact.summary}`);
        if (isUnderCrackingPressure) {
          allowedFactIds.push(factId);
          knownFactSummaries.push(`[UNDER CRACKING STRESS, MAY STUMBLE OR ACCIDENTALLY HINT AT]: ${fact.summary}`);
        }
      } else {
        allowedFactIds.push(factId);
        knownFactSummaries.push(fact.summary);
      }
    }
  }

  const forbiddenFactIds = caseBible.facts
    .map((f) => f.fact_id)
    .filter((id) => !character.known_facts.includes(id));

  // 6. Build Structured Context for Gemini
  const relevantDiscoveredEvidence = caseBible.evidence
    .filter((e) => discoveredEvidenceIds.includes(e.evidence_id))
    .map((e) => `${e.name} (${e.location_found}): ${e.initial_description}`);

  const priorSummaries = priorDialogue.slice(-6).map((d) => `${d.speaker}: ${d.text}`);

  const contextForGemini: GeminiInterrogationContext = {
    character_name: character.name,
    character_role: `${character.role.toUpperCase()} (${character.occupation}, ${character.relation_to_victim})`,
    personality_summary: `${character.personality.temperament}. Style: ${character.personality.communication_style}. Baseline Cooperativeness: ${character.personality.baseline_cooperativeness}/100.`,
    current_emotional_state: {
      stress: projectedStress,
      fear: Math.min(100, Math.max(0, currentState.fear + fearDelta)),
      anger: Math.min(100, Math.max(0, currentState.anger + angerDelta)),
      defensiveness: Math.min(100, Math.max(0, currentState.defensiveness + defDelta)),
      confidence: Math.max(0, currentState.confidence - Math.floor(stressDelta / 2)),
      cooperation: Math.min(100, Math.max(0, currentState.cooperation + coopDelta)),
    },
    what_character_knows: knownFactSummaries,
    what_character_must_hide: hiddenFactSummaries,
    character_active_lies: activeLie ? [`Current Lie: "${activeLie.claim}" (Actual truth: ${activeLie.actualTruth})`] : [],
    relevant_discovered_evidence: relevantDiscoveredEvidence,
    prior_dialogue_summary: priorSummaries,
    player_question: interpretation.topic,
    interpretation,
    setting_atmosphere: caseBible.setting.atmosphere,
  };

  return {
    allowedRevealedFactIds: allowedFactIds,
    forbiddenFactIds,
    activeLie,
    triggeredSecret,
    isUnderCrackingPressure: Boolean(isUnderCrackingPressure),
    computedEmotionalShift: {
      stress: stressDelta,
      fear: fearDelta,
      anger: angerDelta,
      defensiveness: defDelta,
      cooperation: coopDelta,
    },
    contextForGemini,
  };
}
