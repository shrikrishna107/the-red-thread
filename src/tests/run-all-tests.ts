import { CASE_001_GLASS_PAVILION } from "../engine/cases/case-001-glass-pavilion";
import { validateCaseBible } from "../engine/validator";
import { interpretQuestion } from "../engine/interpreter";
import { evaluateCharacterKnowledge } from "../engine/knowledge";
import { handlePoliceInteraction, handleForensicsMedicalInteraction } from "../engine/police-forensics";
import { evaluatePreliminaryTheory, evaluateFinalAccusation } from "../engine/theory-evaluator";
import { generateNewCase } from "../engine/generator";

export async function runAllTests() {
  console.log("=================================================");
  console.log("TELLTALE — DETERMINISTIC ENGINE TEST SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // --- 1. Case Bible Validation Tests ---
  console.log("--- 1. Testing Case Bible Schema & Immutability ---");
  const validation = validateCaseBible(CASE_001_GLASS_PAVILION);
  assert(validation.isValid, "Master Case 001 validates with 0 schema errors");
  assert(validation.errors.length === 0, "No fatal errors in Case Bible");
  assert(CASE_001_GLASS_PAVILION.truth.killer_id === "suspect-cam", "Canonical killer is locked to Cam Sterling");
  assert(CASE_001_GLASS_PAVILION.truth.weapon_id === "evidence_paperweight", "Canonical weapon is locked to Bronze Paperweight");

  // Check character knowledge containment
  const daniel = CASE_001_GLASS_PAVILION.characters.find((c) => c.character_id === "suspect-daniel")!;
  const cam = CASE_001_GLASS_PAVILION.characters.find((c) => c.character_id === "suspect-cam")!;
  const rebecca = CASE_001_GLASS_PAVILION.characters.find((c) => c.character_id === "witness-rebecca")!;

  assert(!daniel.known_facts.includes("fact_attack_poolside"), "Innocent suspect Daniel does NOT possess internal murder attack knowledge");
  assert(cam.known_facts.includes("fact_attack_poolside"), "Killer Cam knows the murder attack details");
  assert(rebecca.known_facts.includes("fact_rebecca_cellar_delay"), "Witness Rebecca knows Cam's actual cellar arrival time (9:04 PM)");

  // --- 2. Dynamic Procedural Case Generation ---
  console.log("\n--- 2. Testing Procedural Case Generator ---");
  const generatedCase = await generateNewCase("Hard");
  const genVal = validateCaseBible(generatedCase);
  assert(genVal.isValid, "Procedurally generated case passes all deterministic validation rules");
  assert(Boolean(generatedCase.case_id), "Generated case possesses unique ID");
  assert(Boolean(generatedCase.truth.killer_id), "Generated case possesses locked canonical killer");

  // --- 3. Question Interpreter Tests ---
  console.log("\n--- 3. Testing Question Interpreter & Intent Extraction ---");
  const q1 = interpretQuestion("Did you kill Lilly with the bronze paperweight?", "suspect-cam", CASE_001_GLASS_PAVILION);
  assert(q1.is_accusatory, "Identifies direct murder accusation");
  assert(q1.entities.includes("evidence_paperweight"), "Extracts weapon entity from query");
  assert(q1.relevance === "HIGHLY_RELEVANT", "Accusation with weapon is graded HIGHLY_RELEVANT");

  const q2 = interpretQuestion("What is your favorite type of pizza?", "suspect-cam", CASE_001_GLASS_PAVILION);
  assert(q2.question_type === "casual", "Identifies casual question");
  assert(q2.relevance === "IRRELEVANT", "Casual query is graded IRRELEVANT");

  // --- 4. Police and Forensics Interactions ---
  console.log("\n--- 4. Testing Police & Forensics Actors ---");
  const policeQ = interpretQuestion("What do the gate logs show?", "witness-briggs", CASE_001_GLASS_PAVILION);
  const policeResp = handlePoliceInteraction("What do the gate logs show?", policeQ, CASE_001_GLASS_PAVILION, ["evidence_gate_log"]);
  assert(policeResp.spoken_response.includes("8:48"), "Police response cites ANPR security gate timestamp");

  const forensicsQ = interpretQuestion("What caused the death?", "forensics-dept", CASE_001_GLASS_PAVILION);
  const forensicsResp = handleForensicsMedicalInteraction("What caused the death?", forensicsQ, CASE_001_GLASS_PAVILION, []);
  assert(forensicsResp.spoken_response.includes("drowning") || forensicsResp.spoken_response.includes("asphyxiation"), "Forensics correctly explains autopsy cause of death");

  // --- 5. Psychological State & Secret Triggers ---
  console.log("\n--- 5. Testing Psychological State & Secret Triggers ---");
  const camState = { ...cam.initial_state };
  const evalCam = evaluateCharacterKnowledge(
    cam,
    camState,
    q1,
    CASE_001_GLASS_PAVILION,
    ["evidence_paperweight"]
  );
  assert(evalCam.computedEmotionalShift.stress > 0, "Cam experiences elevated stress when confronted with murder & weapon");
  assert(evalCam.computedEmotionalShift.defensiveness > 0, "Cam's defensiveness spikes on accusation");
  assert(evalCam.contextForGemini.what_character_must_hide.length > 0, "Secrets remain strictly hidden in generation context");

  // --- 6. Theory & Accusation Grading Tests ---
  console.log("\n--- 6. Testing Theory & Final Accusation Engine ---");
  const perfectTheory = {
    investigation_id: "inv-test-1",
    suspect_id: "suspect-cam",
    motive: "Cam embezzled $4.2 million from Mehra Biologics and killed Lilly to stop the audit.",
    weapon_id: "evidence_paperweight",
    timeline_summary: "Lilly struck at 8:56 PM by pool; Cam entered wine cellar at 9:04 PM.",
    supporting_evidence_ids: ["evidence_paperweight", "evidence_usb_audit", "evidence_wet_footprints", "evidence_rebecca_log"],
    explanation: "Cam struck Lilly with the bronze paperweight, wiped it in the study, and fabricated an alibi with Rebecca in the wine cellar.",
  };

  const perfectEval = evaluatePreliminaryTheory(
    perfectTheory,
    CASE_001_GLASS_PAVILION,
    ["evidence_paperweight", "evidence_usb_audit", "evidence_wet_footprints", "evidence_rebecca_log"]
  );
  assert(perfectEval.is_murderer_correct, "Theory correctly flags murderer");
  assert(perfectEval.is_motive_correct, "Theory correctly flags motive");
  assert(perfectEval.is_weapon_correct, "Theory correctly flags weapon");
  assert(perfectEval.overall_score >= 80, "Perfect theory achieves >= 80 score");

  const verdict = evaluateFinalAccusation(
    perfectTheory,
    CASE_001_GLASS_PAVILION,
    ["evidence_paperweight", "evidence_usb_audit", "evidence_wet_footprints", "evidence_rebecca_log"]
  );
  assert(verdict.outcome === "CASE_SOLVED", "Perfect theory produces CASE_SOLVED ending");
  assert(verdict.what_you_got_right.length > 0, "Case reveal contains 'What You Got Right' details");

  // Wrong suspect theory
  const wrongTheory = {
    ...perfectTheory,
    suspect_id: "suspect-daniel",
    motive: "Daniel had an affair with Maya and argued with Lilly in the conservatory.",
  };
  const wrongVerdict = evaluateFinalAccusation(
    wrongTheory,
    CASE_001_GLASS_PAVILION,
    ["evidence_paperweight"]
  );
  assert(wrongVerdict.outcome === "WRONG_ACCUSATION", "Accusing innocent Daniel produces WRONG_ACCUSATION ending");
  assert(wrongVerdict.what_misled_you.length > 0, "Case reveal explains 'What Misled You'");

  console.log("\n=================================================");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((e) => {
  console.error("Test execution failed:", e);
  process.exit(1);
});
