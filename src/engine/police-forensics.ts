import { CaseBible, GeminiInterrogationResponse, QuestionInterpretation } from "./schema";

export function handlePoliceInteraction(
  question: string,
  interpretation: QuestionInterpretation,
  caseBible: CaseBible,
  discoveredEvidenceIds: string[]
): GeminiInterrogationResponse {
  const lowerQ = question.toLowerCase();

  if (lowerQ.includes("gate") || lowerQ.includes("car") || lowerQ.includes("vehicle") || lowerQ.includes("anpr") || lowerQ.includes("plate") || lowerQ.includes("exit")) {
    return {
      spoken_response: "We pulled the automated security gate logs from the guardhouse terminal. Daniel Mehra's Audi Q7 (Plate 7XYZ49) was logged outbound through the front gate at exactly 8:48:12 PM. No other vehicles entered or exited until our patrol unit arrived at 9:22 PM.",
      physical_observation: "Officer Briggs taps the laminated gate registry on his clipboard, pointing to the computer-generated timestamp.",
      tone: "Procedural & Direct",
      revealed_fact_ids: ["fact_daniel_left_early"],
      referenced_fact_ids: ["fact_daniel_left_estate"],
      emotional_shift: { stress: 0, fear: 0, anger: 0, defensiveness: 0, cooperation: 5 },
      follow_up_hook: "The gate record confirms Daniel was driving away at 8:48 PM.",
    };
  }

  if (lowerQ.includes("footprint") || lowerQ.includes("tread") || lowerQ.includes("shoe") || lowerQ.includes("track")) {
    return {
      spoken_response: "We preserved a set of faint, chlorinated shoe impressions leading across the covered terrace from the poolside gazebo straight into the study French doors. They correspond to Italian leather dress shoes, approximately size 11.",
      physical_observation: "Officer Briggs aims his heavy-duty flashlight at the flagstones beneath the terrace overhang.",
      tone: "Observant & Helpful",
      revealed_fact_ids: ["fact_footprints_terrace"],
      referenced_fact_ids: [],
      emotional_shift: { stress: 0, fear: 0, anger: 0, defensiveness: 0, cooperation: 5 },
      follow_up_hook: "The tracks lead directly from the pool into the study.",
    };
  }

  if (lowerQ.includes("witness") || lowerQ.includes("rebecca") || lowerQ.includes("statement") || lowerQ.includes("cellar")) {
    return {
      spoken_response: "House manager Rebecca Cole has been cooperative. She provided her handwritten wine cellar audit log. She entered the cellar at 8:50 PM and logged Cam Sterling arriving at 9:04 PM, visibly winded.",
      physical_observation: "He flips to the witness summary section of his carbon notebook.",
      tone: "Factual",
      revealed_fact_ids: ["fact_rebecca_cellar_delay"],
      referenced_fact_ids: ["fact_rebecca_log_signed"],
      emotional_shift: { stress: 0, fear: 0, anger: 0, defensiveness: 0, cooperation: 5 },
    };
  }

  if (lowerQ.includes("phone") || lowerQ.includes("call") || lowerQ.includes("text") || lowerQ.includes("cell tower")) {
    return {
      spoken_response: "We recovered Daniel Mehra's phone. Tower records place his device connecting to Tower 14 on Highway 1 at 8:54 PM. The device also contained deleted text exchanges with Maya Lin earlier in the evening.",
      physical_observation: "Officer Briggs holds up the sealed digital evidence bag with Daniel's smartphone.",
      tone: "Official",
      revealed_fact_ids: ["fact_daniel_maya_affair"],
      referenced_fact_ids: ["fact_daniel_left_early"],
      emotional_shift: { stress: 0, fear: 0, anger: 0, defensiveness: 0, cooperation: 5 },
    };
  }

  return {
    spoken_response: `Perimeter is secure, Detective. All six persons present on the grounds have been isolated in the salon. What specific procedural or crime scene log do you need?`,
    physical_observation: "Officer Briggs adjusts his radio shoulder mic, maintaining watch over the pool tape cordon.",
    tone: "Standard Protocol",
    revealed_fact_ids: [],
    referenced_fact_ids: [],
    emotional_shift: { stress: 0, fear: 0, anger: 0, defensiveness: 0, cooperation: 5 },
  };
}

export function handleForensicsMedicalInteraction(
  question: string,
  interpretation: QuestionInterpretation,
  caseBible: CaseBible,
  discoveredEvidenceIds: string[]
): GeminiInterrogationResponse {
  const lowerQ = question.toLowerCase();
  const f = caseBible.forensics;

  if (
    lowerQ.includes("cause") ||
    lowerQ.includes("caused") ||
    lowerQ.includes("how did she die") ||
    lowerQ.includes("how did he die") ||
    lowerQ.includes("manner of death") ||
    lowerQ.includes("drown") ||
    lowerQ.includes("water")
  ) {
    return {
      spoken_response: `Official cause of death is asphyxiation secondary to freshwater drowning, preceded by concussive craniocerebral blunt trauma. The victim's lungs contained 480 mL of chlorinated pool freshwater, proving she was still breathing when she entered the pool water.`,
      physical_observation: "The forensic pathologist pulls up the macroscopic pulmonary cross-section on the terminal display.",
      tone: "Clinical & Precise",
      revealed_fact_ids: ["fact_initial_coroner_blunt_force"],
      referenced_fact_ids: ["fact_pool_water_temp"],
      emotional_shift: { stress: 0, fear: 0, anger: 0, defensiveness: 0, cooperation: 5 },
      follow_up_hook: "Victim was unconscious but alive when submerged in the pool.",
    };
  }

  if (lowerQ.includes("wound") || lowerQ.includes("fracture") || lowerQ.includes("skull") || lowerQ.includes("head") || lowerQ.includes("blunt") || lowerQ.includes("weapon")) {
    return {
      spoken_response: `We documented a 4.2 cm transverse laceration over the right occipital-parietal scalp with an underlying depressed linear fracture. The geometry matches a dense rectangular object with beveled brass or bronze perimeter, struck with downward mechanical force from behind.`,
      physical_observation: "The pathologist points to the skull radiograph and calipers measuring the fracture width.",
      tone: "Scientific",
      revealed_fact_ids: ["fact_initial_coroner_blunt_force"],
      referenced_fact_ids: ["fact_paperweight_cleaned"],
      emotional_shift: { stress: 0, fear: 0, anger: 0, defensiveness: 0, cooperation: 5 },
      follow_up_hook: "The strike came from behind with a heavy rectangular edge.",
    };
  }

  if (lowerQ.includes("toxicology") || lowerQ.includes("poison") || lowerQ.includes("drug") || lowerQ.includes("sedative") || lowerQ.includes("zolpidem") || lowerQ.includes("alcohol")) {
    return {
      spoken_response: `Toxicology screen identified trace blood alcohol (0.03 g/dL) and sub-clinical therapeutic Zolpidem (0.04 mg/L). Neither substance was near lethal or paralyzing concentrations; they would cause mild drowsiness at most. No poisons or paralytics detected.`,
      physical_observation: "She prints out the mass spectrometry chromatogram and highlights the sedative peaks.",
      tone: "Exacting",
      revealed_fact_ids: ["fact_vance_prescriptions"],
      referenced_fact_ids: [],
      emotional_shift: { stress: 0, fear: 0, anger: 0, defensiveness: 0, cooperation: 5 },
      follow_up_hook: "Sedatives were therapeutic and did not cause the drowning on their own.",
    };
  }

  if (lowerQ.includes("time of death") || lowerQ.includes("when did she die") || lowerQ.includes("estimated time")) {
    return {
      spoken_response: `Based on vitreous humor potassium assay, core body cooling rate, and stomach contents, time of death is firmly bracketed between 8:50 PM and 9:05 PM.`,
      physical_observation: "The examiner cross-references the ambient temperature log with the gastric digestion index.",
      tone: "Analytical",
      revealed_fact_ids: [],
      referenced_fact_ids: ["fact_attack_poolside"],
      emotional_shift: { stress: 0, fear: 0, anger: 0, defensiveness: 0, cooperation: 5 },
    };
  }

  return {
    spoken_response: `Autopsy file ${f?.autopsy_id || "AUT-2026-0882"} is active. I can walk you through the cranial trauma analysis, lung fluid spectroscopy, or toxicology findings.`,
    physical_observation: "The medical examiner gestures toward the autopsy case files.",
    tone: "Clinical",
    revealed_fact_ids: [],
    referenced_fact_ids: [],
    emotional_shift: { stress: 0, fear: 0, anger: 0, defensiveness: 0, cooperation: 5 },
  };
}
