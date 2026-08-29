import { NextResponse } from "next/server";
import { generateNewCase } from "@/engine/generator";
import { CASE_001_GLASS_PAVILION } from "@/engine/cases/case-001-glass-pavilion";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { difficulty = "Medium", useTestLillyCase = false } = body;

    const caseBible = useTestLillyCase ? CASE_001_GLASS_PAVILION : await generateNewCase(difficulty);

    const investigationId = `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Prepare safe client representation
    const clientSafeCharacters = caseBible.characters.map((c) => ({
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

    const clientSafeEvidence = caseBible.evidence.map((e) => ({
      evidence_id: e.evidence_id,
      name: e.name,
      category: e.category,
      location_found: e.location_found,
      initial_description: e.initial_description,
      is_discovered: caseBible.opening_scene.available_evidence.includes(e.evidence_id),
      is_forensically_examined: false,
    }));

    const clientSafeTimeline = caseBible.timeline.map((t) => ({
      event_id: t.event_id,
      timestamp: t.timestamp,
      location: t.location,
      summary: t.public_initial_knowledge ? t.summary : "Undiscovered Timeline Event",
      involved_characters: t.involved_character_ids,
      is_unlocked: t.public_initial_knowledge,
    }));

    const clientSafeForensics = {
      autopsy_id: caseBible.forensics.autopsy_id,
      estimated_time_of_death: caseBible.forensics.estimated_time_of_death,
      official_cause_of_death: caseBible.forensics.official_cause_of_death,
      contusions_and_wounds: caseBible.forensics.contusions_and_wounds,
      initial_examiner_notes: caseBible.forensics.initial_examiner_notes,
    };

    return NextResponse.json({
      success: true,
      caseId: caseBible.case_id,
      investigationId,
      caseNumber: caseBible.case_number,
      title: caseBible.title,
      subtitle: caseBible.subtitle,
      difficulty: caseBible.difficulty,
      setting: caseBible.setting,
      victim: caseBible.victim,
      opening_scene: caseBible.opening_scene,
      characters: clientSafeCharacters,
      evidence: clientSafeEvidence,
      timeline: clientSafeTimeline,
      forensics: clientSafeForensics,
      status: "ACTIVE",
    });
  } catch (err) {
    console.error("Case generation error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to generate new case" },
      { status: 500 }
    );
  }
}
