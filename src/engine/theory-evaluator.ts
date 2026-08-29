import {
  AccusationResult,
  CaseBible,
  EndingOutcome,
  TheoryEvaluationResult,
  TheorySubmission,
} from "./schema";

export function evaluatePreliminaryTheory(
  submission: TheorySubmission,
  caseBible: CaseBible,
  discoveredEvidenceIds: string[]
): TheoryEvaluationResult {
  const truth = caseBible.truth;
  const criteria = caseBible.solution_criteria;

  const isMurdererCorrect = submission.suspect_id === criteria.required_killer_id;

  const lowerMotive = (submission.motive + " " + submission.explanation).toLowerCase();
  const isMotiveCorrect = criteria.accepted_motive_keywords.some((kw) =>
    lowerMotive.includes(kw.toLowerCase())
  );

  const isWeaponCorrect = criteria.accepted_weapon_ids.includes(submission.weapon_id);

  let evidenceHits = 0;
  for (const critEv of criteria.critical_evidence_ids) {
    if (submission.supporting_evidence_ids.includes(critEv) && discoveredEvidenceIds.includes(critEv)) {
      evidenceHits++;
    }
  }
  const evidenceStrengthScore = Math.min(100, Math.round((evidenceHits / criteria.critical_evidence_ids.length) * 100));

  const lowerTimeline = submission.timeline_summary.toLowerCase();
  let timelineScore = 30;
  if (lowerTimeline.includes("8:56") || lowerTimeline.includes("8:55") || lowerTimeline.includes("before 9")) {
    timelineScore += 35;
  }
  if (lowerTimeline.includes("cellar") || lowerTimeline.includes("rebecca") || lowerTimeline.includes("9:04")) {
    timelineScore += 35;
  }
  timelineScore = Math.min(100, timelineScore);

  let overallScore = 0;
  if (isMurdererCorrect) overallScore += 40;
  if (isMotiveCorrect) overallScore += 20;
  if (isWeaponCorrect) overallScore += 20;
  overallScore += Math.round(evidenceStrengthScore * 0.1);
  overallScore += Math.round(timelineScore * 0.1);
  overallScore = Math.min(100, overallScore);

  const strengths: string[] = [];
  const inconsistencies: string[] = [];
  const unansweredQuestions: string[] = [];

  if (isMurdererCorrect) {
    strengths.push("Correctly identified the perpetrator.");
  } else {
    inconsistencies.push("The primary suspect is contradicted by security logs or alibis.");
  }

  if (isWeaponCorrect) {
    strengths.push("Weapon matches cranial fracture profile.");
  } else {
    inconsistencies.push("The weapon does not match wound geometry.");
  }

  if (isMotiveCorrect) {
    strengths.push("Motive aligns with documented financial ledger anomalies.");
  } else {
    unansweredQuestions.push("Motive remains uncorroborated by tangible evidence.");
  }

  if (evidenceStrengthScore < 50) {
    unansweredQuestions.push("Critical forensic links are missing from the evidentiary chain.");
  }

  let verdict: TheoryEvaluationResult["evaluation_verdict"] = "WILD_GUESS";
  if (overallScore >= 80) verdict = "STRONG_CASE";
  else if (overallScore >= 55) verdict = "PLAUSIBLE_BUT_LEAKY";
  else if (overallScore >= 35) verdict = "FLAWED_THEORY";

  let detectiveCritique = "";
  if (verdict === "STRONG_CASE") {
    detectiveCritique = "A compelling and tightly argued reconstruction. The timeline discrepancies and financial motive are reconciled with precision.";
  } else if (verdict === "PLAUSIBLE_BUT_LEAKY") {
    detectiveCritique = "Important threads have been identified, but significant timeline gaps and physical proof remain open.";
  } else if (verdict === "FLAWED_THEORY") {
    detectiveCritique = "Key contradictions exist between this narrative and the verified physical forensic logs.";
  } else {
    detectiveCritique = "This hypothesis lacks factual substantiation. Re-examine the physical evidence, timeline logs, and suspect movements.";
  }

  return {
    is_murderer_correct: isMurdererCorrect,
    is_motive_correct: isMotiveCorrect,
    is_weapon_correct: isWeaponCorrect,
    timeline_accuracy_score: timelineScore,
    evidence_strength_score: evidenceStrengthScore,
    overall_score: overallScore,
    detective_critique: detectiveCritique,
    strengths,
    inconsistencies,
    unanswered_questions: unansweredQuestions,
    evaluation_verdict: verdict,
  };
}

export function evaluateFinalAccusation(
  submission: TheorySubmission,
  caseBible: CaseBible,
  discoveredEvidenceIds: string[]
): AccusationResult {
  const preliminary = evaluatePreliminaryTheory(submission, caseBible, discoveredEvidenceIds);
  const killer = caseBible.characters.find((c) => c.character_id === caseBible.truth.killer_id)!;
  const accused = caseBible.characters.find((c) => c.character_id === submission.suspect_id);

  let outcome: EndingOutcome = "UNSOLVED";
  let title = "INVESTIGATION UNRESOLVED";
  let summary = "";
  let aftermath = "";

  const whatYouGotRight: string[] = [];
  const whatYouMissed: string[] = [];
  const whatMisledYou: string[] = [];
  const keyCluesFound: string[] = [];

  if (preliminary.is_murderer_correct && preliminary.is_weapon_correct && preliminary.is_motive_correct && preliminary.evidence_strength_score >= 50) {
    outcome = "CASE_SOLVED";
    title = "CASE SOLVED: THE THREAD UNRAVELED";
    summary = `You formally indicted ${killer.name}. Armed with the blood-stained ${caseBible.truth.weapon_name}, the encrypted audit drive, and Rebecca Cole's timeline log, the prosecution secured a unanimous First-Degree Murder conviction.`;
    aftermath = `Under relentless cross-examination and faced with the microscopic blood and pool saline residues embedded in the paperweight's felt base, Cam Sterling broke down in court. He confessed that when Lilly gave him until 9:00 AM to surrender for embezzling $4.2 million, he struck her down by the pool gazebo and pushed her into the water. Cam was sentenced to life imprisonment without parole.`;
    whatYouGotRight.push(`Correctly identified ${killer.name} as the sole perpetrator.`);
    whatYouGotRight.push(`Identified the ${caseBible.truth.weapon_name} as the true murder weapon.`);
    whatYouGotRight.push("Proved the financial fraud and impending audit as the primary motive.");
    whatYouGotRight.push("Exposed the wine cellar timeline contradiction (9:04 PM vs claimed 8:45 PM).");
  } else if (preliminary.is_murderer_correct) {
    outcome = "PARTIALLY_CORRECT";
    title = "PARTIALLY CORRECT: INSUFFICIENT EVIDENCE";
    summary = `You correctly named ${killer.name}, but the prosecution was hindered by missing physical forensic links or timeline discrepancies in your warrant.`;
    aftermath = `Cam Sterling's defense attorneys exploited the evidentiary gaps in your case file. While public suspicion remains permanent, Cam was released on bail due to lack of conclusive forensic proof. You solved the crime in your mind, but the court demanded airtight evidence.`;
    whatYouGotRight.push(`Named the true perpetrator: ${killer.name}.`);
    whatYouMissed.push("Did not fully substantiate the murder weapon with chemical forensic tests.");
    whatYouMissed.push("Failed to completely reconcile the 8:56 PM assault timestamp.");
  } else if (accused) {
    outcome = "WRONG_ACCUSATION";
    title = "MISCARRIAGE OF JUSTICE: WRONG ACCUSATION";
    summary = `You arrested ${accused.name}. Subsequent forensic analysis and security gate ANPR telemetry proved their innocence, allowing the true killer to walk free.`;
    aftermath = `${accused.name} was detained under media scrutiny, but their corroborated alibi and lack of physical connection forced the state to drop all charges. Meanwhile, Cam Sterling liquidated his offshore assets and fled the jurisdiction before authorities could reconstruct the true timeline.`;
    whatMisledYou.push(`${accused.name}'s emotional defensiveness and secret affair.`);
    whatMisledYou.push("The heated conservatory argument right before the fatal assault window.");
    whatYouMissed.push(`Overlooked the security gate ANPR log proving Daniel left at 8:48 PM.`);
    whatYouMissed.push(`Did not catch Cam Sterling's false wine cellar alibi.`);
  } else {
    outcome = "UNSOLVED";
    title = "UNRESOLVED COLD CASE";
    summary = "You were unable to formulate a coherent indictment before state prosecutors took over the file.";
    aftermath = "The investigation stalled in bureaucratic limbo, leaving the case unresolved in county cold case archives.";
    whatYouMissed.push("Failed to discover critical timeline and forensic evidence.");
  }

  for (const evId of discoveredEvidenceIds) {
    const item = caseBible.evidence.find((e) => e.evidence_id === evId);
    if (item) keyCluesFound.push(`${item.name} (${item.location_found})`);
  }

  return {
    outcome,
    title,
    verdict_score: preliminary.overall_score,
    summary,
    detailed_breakdown: {
      murderer_match: preliminary.is_murderer_correct,
      weapon_match: preliminary.is_weapon_correct,
      motive_match: preliminary.is_motive_correct,
      evidence_sufficiency: preliminary.evidence_strength_score >= 50,
    },
    what_you_got_right: whatYouGotRight,
    what_you_missed: whatYouMissed,
    what_misled_you: whatMisledYou,
    key_clues_found: keyCluesFound,
    aftermath_narrative: aftermath,
    canonical_truth_reveal: caseBible.truth,
  };
}
