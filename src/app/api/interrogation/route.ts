import { NextResponse } from "next/server";
import { CASE_001_GLASS_PAVILION } from "@/engine/cases/case-001-glass-pavilion";
import { interpretQuestion } from "@/engine/interpreter";
import { evaluateCharacterKnowledge } from "@/engine/knowledge";
import { generateInterrogationDialogue } from "@/engine/gemini";
import { handlePoliceInteraction, handleForensicsMedicalInteraction } from "@/engine/police-forensics";
import { EmotionalState, GeminiInterrogationResponse } from "@/engine/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      investigationId,
      characterId,
      question,
      currentState,
      discoveredEvidenceIds = [],
      priorMessages = [],
    } = body;

    if (!characterId || !question) {
      return NextResponse.json(
        { success: false, error: "Missing characterId or question" },
        { status: 400 }
      );
    }

    const interpretation = interpretQuestion(
      question,
      characterId,
      CASE_001_GLASS_PAVILION,
      priorMessages
    );

    let geminiResponse: GeminiInterrogationResponse;
    let nextEmotionalState: EmotionalState = currentState || {
      stress: 20,
      fear: 10,
      anger: 10,
      defensiveness: 10,
      confidence: 80,
      cooperation: 80,
    };

    // 1. Check for Police Interaction
    if (characterId === "police-dept" || characterId === "witness-briggs") {
      geminiResponse = handlePoliceInteraction(
        question,
        interpretation,
        CASE_001_GLASS_PAVILION,
        discoveredEvidenceIds
      );
    }
    // 2. Check for Forensics & Medical Department
    else if (characterId === "forensics-dept") {
      geminiResponse = handleForensicsMedicalInteraction(
        question,
        interpretation,
        CASE_001_GLASS_PAVILION,
        discoveredEvidenceIds
      );
    }
    // 3. Suspect / Civilian Witness Interrogation
    else {
      const character = CASE_001_GLASS_PAVILION.characters.find(
        (c) => c.character_id === characterId
      );

      if (!character) {
        return NextResponse.json(
          { success: false, error: `Character ${characterId} not found` },
          { status: 404 }
        );
      }

      const currentEmotionalState: EmotionalState = currentState || { ...character.initial_state };

      const knowledgeEval = evaluateCharacterKnowledge(
        character,
        currentEmotionalState,
        interpretation,
        CASE_001_GLASS_PAVILION,
        discoveredEvidenceIds,
        priorMessages
      );

      geminiResponse = await generateInterrogationDialogue(
        knowledgeEval.contextForGemini,
        question
      );

      nextEmotionalState = {
        stress: Math.min(100, Math.max(0, currentEmotionalState.stress + (geminiResponse.emotional_shift?.stress ?? knowledgeEval.computedEmotionalShift.stress))),
        fear: Math.min(100, Math.max(0, currentEmotionalState.fear + (geminiResponse.emotional_shift?.fear ?? knowledgeEval.computedEmotionalShift.fear))),
        anger: Math.min(100, Math.max(0, currentEmotionalState.anger + (geminiResponse.emotional_shift?.anger ?? knowledgeEval.computedEmotionalShift.anger))),
        defensiveness: Math.min(100, Math.max(0, currentEmotionalState.defensiveness + (geminiResponse.emotional_shift?.defensiveness ?? knowledgeEval.computedEmotionalShift.defensiveness))),
        confidence: Math.max(0, Math.min(100, currentEmotionalState.confidence - Math.floor(Math.abs(geminiResponse.emotional_shift?.stress ?? 5) / 2))),
        cooperation: Math.min(100, Math.max(0, currentEmotionalState.cooperation + (geminiResponse.emotional_shift?.cooperation ?? knowledgeEval.computedEmotionalShift.cooperation))),
      };
    }

    // Determine if any evidence or facts are unlocked
    const newlyDiscoveredEvidenceIds: string[] = [];
    const lowerResp = (geminiResponse.spoken_response + " " + geminiResponse.physical_observation).toLowerCase();
    
    if (lowerResp.includes("gate") || lowerResp.includes("8:48")) {
      newlyDiscoveredEvidenceIds.push("evidence_gate_log");
    }
    if (lowerResp.includes("cellar") || lowerResp.includes("inventory") || lowerResp.includes("9:04")) {
      newlyDiscoveredEvidenceIds.push("evidence_rebecca_log");
    }
    if (lowerResp.includes("paperweight") || lowerResp.includes("bookshelf")) {
      newlyDiscoveredEvidenceIds.push("evidence_paperweight");
    }
    if (lowerResp.includes("audit") || lowerResp.includes("flash drive") || lowerResp.includes("ledger")) {
      newlyDiscoveredEvidenceIds.push("evidence_usb_audit");
    }
    if (lowerResp.includes("prescription") || lowerResp.includes("zolpidem") || lowerResp.includes("vial")) {
      newlyDiscoveredEvidenceIds.push("evidence_sedative_vial");
    }

    return NextResponse.json({
      success: true,
      message: {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        investigation_id: investigationId,
        character_id: characterId,
        speaker: "character",
        text: geminiResponse.spoken_response,
        physical_observation: geminiResponse.physical_observation,
        tone: geminiResponse.tone || "Guarded",
        question_type: interpretation.question_type,
        relevance: interpretation.relevance,
        emotional_snapshot: nextEmotionalState,
        follow_up_hook: geminiResponse.follow_up_hook,
        created_at: new Date().toISOString(),
      },
      emotionalState: nextEmotionalState,
      revealedFacts: geminiResponse.revealed_fact_ids || [],
      newlyDiscoveredEvidenceIds,
      interpretation: {
        topic: interpretation.topic,
        question_type: interpretation.question_type,
        emotional_intent: interpretation.emotional_intent,
        relevance: interpretation.relevance,
      },
    });
  } catch (error) {
    console.error("Interrogation error:", error);
    return NextResponse.json(
      { success: false, error: "The interrogation system encountered an issue. Your investigation has been preserved. Please try again." },
      { status: 500 }
    );
  }
}
