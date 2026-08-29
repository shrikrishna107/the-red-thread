import { NextResponse } from "next/server";
import { CASE_001_GLASS_PAVILION } from "@/engine/cases/case-001-glass-pavilion";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const caseId = body.caseId || CASE_001_GLASS_PAVILION.case_id;
    const investigationId = body.investigationId || `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Prepare client-safe Case view (STRIP CANONICAL TRUTH, SECRETS, LIES, HIDDEN FACTS)
    const clientSafeCharacters = CASE_001_GLASS_PAVILION.characters.map((c) => ({
      character_id: c.character_id,
      name: c.name,
      age: c.age,
      occupation: c.occupation,
      relation_to_victim: c.relation_to_victim,
      role: c.role,
      avatar_code: c.avatar_code,
      description: c.description,
      alibi: {
        claimed_location: c.alibi.claimed_location,
        claimed_activity: c.alibi.claimed_activity,
        claimed_time_range: c.alibi.claimed_time_range,
      },
      current_state: { ...c.initial_state },
    }));

    const clientSafeEvidence = CASE_001_GLASS_PAVILION.evidence.map((e) => ({
      evidence_id: e.evidence_id,
      name: e.name,
      category: e.category,
      location_found: e.location_found,
      initial_description: e.initial_description,
      is_discovered: CASE_001_GLASS_PAVILION.opening_scene.available_evidence.includes(e.evidence_id),
      is_forensically_examined: false,
    }));

    const clientSafeTimeline = CASE_001_GLASS_PAVILION.timeline.map((t) => ({
      event_id: t.event_id,
      timestamp: t.timestamp,
      location: t.location,
      summary: t.public_initial_knowledge ? t.summary : "Undiscovered Timeline Event",
      involved_characters: t.involved_character_ids,
      is_unlocked: t.public_initial_knowledge,
    }));

    const clientSafeForensics = {
      autopsy_id: CASE_001_GLASS_PAVILION.forensics.autopsy_id,
      estimated_time_of_death: CASE_001_GLASS_PAVILION.forensics.estimated_time_of_death,
      official_cause_of_death: CASE_001_GLASS_PAVILION.forensics.official_cause_of_death,
      contusions_and_wounds: CASE_001_GLASS_PAVILION.forensics.contusions_and_wounds,
      initial_examiner_notes: CASE_001_GLASS_PAVILION.forensics.initial_examiner_notes,
    };

    return NextResponse.json({
      success: true,
      investigationId,
      caseNumber: CASE_001_GLASS_PAVILION.case_number,
      title: CASE_001_GLASS_PAVILION.title,
      subtitle: CASE_001_GLASS_PAVILION.subtitle,
      difficulty: CASE_001_GLASS_PAVILION.difficulty,
      setting: CASE_001_GLASS_PAVILION.setting,
      victim: CASE_001_GLASS_PAVILION.victim,
      opening_scene: CASE_001_GLASS_PAVILION.opening_scene,
      characters: clientSafeCharacters,
      evidence: clientSafeEvidence,
      timeline: clientSafeTimeline,
      forensics: clientSafeForensics,
      status: "ACTIVE",
    });
  } catch (error) {
    console.error("Failed to start investigation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initialize investigation session" },
      { status: 500 }
    );
  }
}
