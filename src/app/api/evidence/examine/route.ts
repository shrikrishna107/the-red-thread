import { NextResponse } from "next/server";
import { CASE_001_GLASS_PAVILION } from "@/engine/cases/case-001-glass-pavilion";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { evidenceId, question } = body;

    if (!evidenceId) {
      return NextResponse.json(
        { success: false, error: "Missing evidenceId" },
        { status: 400 }
      );
    }

    const item = CASE_001_GLASS_PAVILION.evidence.find(
      (e) => e.evidence_id === evidenceId
    );

    if (!item) {
      return NextResponse.json(
        { success: false, error: `Evidence ${evidenceId} not found` },
        { status: 404 }
      );
    }

    // Return discoverable facts and forensic details
    let forensicAnalysis = item.forensic_facts.join(" ");
    if (!forensicAnalysis) {
      forensicAnalysis = "Forensic swab yielded no foreign biological markers or chemical anomalies.";
    }

    return NextResponse.json({
      success: true,
      evidence: {
        evidence_id: item.evidence_id,
        name: item.name,
        category: item.category,
        location_found: item.location_found,
        initial_description: item.initial_description,
        discoverable_facts: item.discoverable_facts,
        forensic_facts: item.forensic_facts,
        forensic_analysis: forensicAnalysis,
        related_characters: item.related_characters,
        is_examined: true,
      },
    });
  } catch (error) {
    console.error("Evidence examination error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to examine evidence" },
      { status: 500 }
    );
  }
}
