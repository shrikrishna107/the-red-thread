import { NextResponse } from "next/server";
import { CASE_001_GLASS_PAVILION } from "@/engine/cases/case-001-glass-pavilion";
import { evaluateFinalAccusation } from "@/engine/theory-evaluator";
import { TheorySubmission } from "@/engine/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      investigationId,
      suspectId,
      motive,
      weaponId,
      timelineSummary,
      supportingEvidenceIds = [],
      explanation,
      discoveredEvidenceIds = [],
    } = body;

    if (!suspectId || !motive || !weaponId) {
      return NextResponse.json(
        { success: false, error: "Incomplete formal accusation payload" },
        { status: 400 }
      );
    }

    const submission: TheorySubmission = {
      investigation_id: investigationId || "inv-default",
      suspect_id: suspectId,
      motive,
      weapon_id: weaponId,
      timeline_summary: timelineSummary || "",
      supporting_evidence_ids: supportingEvidenceIds,
      explanation: explanation || "",
    };

    const result = evaluateFinalAccusation(
      submission,
      CASE_001_GLASS_PAVILION,
      discoveredEvidenceIds
    );

    return NextResponse.json({
      success: true,
      verdict: result,
    });
  } catch (error) {
    console.error("Accusation processing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to evaluate final accusation" },
      { status: 500 }
    );
  }
}
