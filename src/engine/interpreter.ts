import { CaseBible, QuestionInterpretation, QuestionType, RelevanceLevel } from "./schema";

export function interpretQuestion(
  question: string,
  targetCharacterId: string,
  caseBible: CaseBible,
  priorDialogue: { speaker: string; text: string }[] = []
): QuestionInterpretation {
  const cleanQ = question.trim();
  const lowerQ = cleanQ.toLowerCase();

  // 1. Entity Extraction
  const entities: string[] = [];
  for (const char of caseBible.characters) {
    const firstName = char.name.split(" ")[0].toLowerCase();
    const lastName = char.name.split(" ")[1]?.toLowerCase();
    if (lowerQ.includes(firstName) || (lastName && lowerQ.includes(lastName))) {
      entities.push(char.character_id);
    }
  }
  if (
    lowerQ.includes("lilly") ||
    lowerQ.includes("victim") ||
    lowerQ.includes("wife") ||
    lowerQ.includes("ceo")
  ) {
    entities.push(caseBible.victim.victim_id);
  }

  // Evidence Matching
  let referencesEvidenceId: string | undefined = undefined;
  for (const item of caseBible.evidence) {
    const itemName = item.name.toLowerCase();
    const itemWords = itemName.split(" ");
    if (
      lowerQ.includes(itemName) ||
      (itemWords.some((w) => w.length > 4 && lowerQ.includes(w)) &&
        (lowerQ.includes("found") || lowerQ.includes("item") || lowerQ.includes("weapon") || lowerQ.includes("clue") || lowerQ.includes("evidence")))
    ) {
      entities.push(item.evidence_id);
      referencesEvidenceId = item.evidence_id;
    }
  }

  // Specific evidence keyword synonyms
  if (lowerQ.includes("paperweight") || lowerQ.includes("bronze") || lowerQ.includes("blunt object")) {
    referencesEvidenceId = "evidence_paperweight";
    entities.push("evidence_paperweight");
  } else if (lowerQ.includes("phone") || lowerQ.includes("texts") || lowerQ.includes("sms") || lowerQ.includes("messages")) {
    referencesEvidenceId = "evidence_phone_daniel";
    entities.push("evidence_phone_daniel");
  } else if (lowerQ.includes("flash drive") || lowerQ.includes("usb") || lowerQ.includes("audit") || lowerQ.includes("4.2 million") || lowerQ.includes("embezzle") || lowerQ.includes("offshore")) {
    referencesEvidenceId = "evidence_usb_audit";
    entities.push("evidence_usb_audit");
  } else if (lowerQ.includes("pool log") || lowerQ.includes("chlorinator") || lowerQ.includes("wave") || lowerQ.includes("displacement")) {
    referencesEvidenceId = "evidence_pool_chlorine";
    entities.push("evidence_pool_chlorine");
  } else if (lowerQ.includes("footprint") || lowerQ.includes("shoes") || lowerQ.includes("tread") || lowerQ.includes("damp track")) {
    referencesEvidenceId = "evidence_wet_footprints";
    entities.push("evidence_wet_footprints");
  } else if (lowerQ.includes("sedative") || lowerQ.includes("zolpidem") || lowerQ.includes("sleeping pill") || lowerQ.includes("vial")) {
    referencesEvidenceId = "evidence_sedative_vial";
    entities.push("evidence_sedative_vial");
  } else if (lowerQ.includes("cellar log") || lowerQ.includes("sommelier sheet") || lowerQ.includes("inventory")) {
    referencesEvidenceId = "evidence_rebecca_log";
    entities.push("evidence_rebecca_log");
  } else if (lowerQ.includes("earring") || lowerQ.includes("pearl")) {
    referencesEvidenceId = "evidence_lilly_earring";
    entities.push("evidence_lilly_earring");
  }

  // 2. Time & Location Extraction
  let timeReference: string | undefined = undefined;
  const timeRegex = /\b(\d{1,2}(?::\d{2})?\s*(?:am|pm|o'clock)?)\b/i;
  const timeMatch = cleanQ.match(timeRegex);
  if (timeMatch && (lowerQ.includes("at") || lowerQ.includes("around") || lowerQ.includes("between") || lowerQ.includes("pm") || lowerQ.includes("8:") || lowerQ.includes("9:"))) {
    timeReference = timeMatch[1];
  } else if (lowerQ.includes("earlier") || lowerQ.includes("before") || lowerQ.includes("after") || lowerQ.includes("dinner") || lowerQ.includes("when you arrived")) {
    timeReference = "relative_time";
  }

  let locationReference: string | undefined = undefined;
  const locations = [
    "pool", "gazebo", "study", "wine cellar", "cellar", "library",
    "conservatory", "gate", "courtyard", "dining room", "balcony", "terrace"
  ];
  for (const loc of locations) {
    if (lowerQ.includes(loc)) {
      locationReference = loc;
      break;
    }
  }

  // 3. Question Type & Emotional Intent Classification
  const isAccusatory =
    lowerQ.includes("you killed") ||
    lowerQ.includes("did you kill") ||
    lowerQ.includes("murderer") ||
    lowerQ.includes("you did it") ||
    lowerQ.includes("you're lying") ||
    lowerQ.includes("you are lying") ||
    lowerQ.includes("you stole") ||
    lowerQ.includes("confess") ||
    lowerQ.includes("guilty") ||
    lowerQ.includes("admit it");

  const isContradiction =
    lowerQ.includes("earlier you said") ||
    lowerQ.includes("you told me") ||
    lowerQ.includes("but you claimed") ||
    lowerQ.includes("contradict") ||
    lowerQ.includes("doesn't match") ||
    lowerQ.includes("rebecca said") ||
    lowerQ.includes("the log shows") ||
    lowerQ.includes("the gate shows");

  const isBehavioral =
    lowerQ.includes("sweat") ||
    lowerQ.includes("nervous") ||
    lowerQ.includes("shaking") ||
    lowerQ.includes("look away") ||
    lowerQ.includes("eye contact") ||
    lowerQ.includes("fidget") ||
    lowerQ.includes("hands") ||
    lowerQ.includes("voice");

  let questionType: QuestionType = "fact_inquiry";
  if (isAccusatory) {
    questionType = "accusation";
  } else if (isContradiction) {
    questionType = "contradiction_challenge";
  } else if (isBehavioral) {
    questionType = "behavioral_observation";
  } else if (referencesEvidenceId) {
    questionType = "evidence_question";
  } else if (timeReference || lowerQ.includes("where were you") || lowerQ.includes("alibi") || lowerQ.includes("timeline") || lowerQ.includes("what time")) {
    questionType = lowerQ.includes("alibi") ? "alibi_challenge" : "timeline_inquiry";
  } else if (lowerQ.includes("love") || lowerQ.includes("hate") || lowerQ.includes("relationship") || lowerQ.includes("affair") || lowerQ.includes("married") || lowerQ.includes("friend")) {
    questionType = "relationship_question";
  } else if (lowerQ.includes("why would someone") || lowerQ.includes("motive") || lowerQ.includes("money") || lowerQ.includes("audit") || lowerQ.includes("gain")) {
    questionType = "motive_question";
  } else if (lowerQ.includes("feel") || lowerQ.includes("sad") || lowerQ.includes("grief") || lowerQ.includes("cry")) {
    questionType = "emotional_question";
  } else if (lowerQ.includes("what if") || lowerQ.includes("suppose") || lowerQ.includes("hypothetically")) {
    questionType = "hypothetical";
  } else if (lowerQ.includes("pizza") || lowerQ.includes("sandwich") || lowerQ.includes("weather") || lowerQ.includes("favorite color") || lowerQ.includes("hobby")) {
    questionType = "casual";
  } else if (cleanQ.length < 4 || /^[asdfghjklqwertyuiopzxcvbnm\s]+$/i.test(cleanQ) && cleanQ.split(" ").some(w => w.length > 15)) {
    questionType = "nonsense";
  }

  // 4. Emotional Intent
  let emotionalIntent: QuestionInterpretation["emotional_intent"] = "neutral";
  if (isAccusatory || lowerQ.includes("don't lie") || lowerQ.includes("cut the crap")) {
    emotionalIntent = "aggressive";
  } else if (questionType === "contradiction_challenge" || questionType === "alibi_challenge" || lowerQ.includes("explain yourself")) {
    emotionalIntent = "pressuring";
  } else if (lowerQ.includes("sorry for your loss") || lowerQ.includes("must be hard") || lowerQ.includes("are you okay")) {
    emotionalIntent = "sympathetic";
  } else if (questionType === "hypothetical" || lowerQ.includes("if i told you")) {
    emotionalIntent = "baiting";
  } else if (questionType === "casual") {
    emotionalIntent = "casual";
  }

  // 5. Relevance Grading
  let relevance: RelevanceLevel = "POTENTIALLY_RELEVANT";
  if (questionType === "nonsense") {
    relevance = "NONSENSICAL";
  } else if (questionType === "casual") {
    relevance = "IRRELEVANT";
  } else if (
    isAccusatory ||
    isContradiction ||
    referencesEvidenceId === "evidence_paperweight" ||
    referencesEvidenceId === "evidence_usb_audit" ||
    (targetCharacterId === "suspect-cam" && (lowerQ.includes("cellar") || lowerQ.includes("pool") || lowerQ.includes("8:56") || lowerQ.includes("audit") || lowerQ.includes("paperweight"))) ||
    (targetCharacterId === "witness-rebecca" && (lowerQ.includes("cam") || lowerQ.includes("arrival") || lowerQ.includes("9:04") || lowerQ.includes("breath"))) ||
    (targetCharacterId === "suspect-daniel" && (lowerQ.includes("gate") || lowerQ.includes("8:48") || lowerQ.includes("conservatory") || lowerQ.includes("maya")))
  ) {
    relevance = "HIGHLY_RELEVANT";
  } else if (
    questionType === "timeline_inquiry" ||
    questionType === "evidence_question" ||
    questionType === "alibi_challenge" ||
    questionType === "relationship_question"
  ) {
    relevance = "RELEVANT";
  } else if (questionType === "behavioral_observation" || questionType === "emotional_question") {
    relevance = "POTENTIALLY_RELEVANT";
  } else {
    relevance = "LOW_RELEVANCE";
  }

  const referencesPrev = priorDialogue.length > 0 && (
    lowerQ.includes("earlier") ||
    lowerQ.includes("again") ||
    lowerQ.includes("you said") ||
    lowerQ.includes("repeat") ||
    lowerQ.includes("before")
  );

  return {
    target_character_id: targetCharacterId,
    topic: locationReference || referencesEvidenceId || questionType,
    entities,
    time_reference: timeReference,
    location_reference: locationReference,
    question_type: questionType,
    emotional_intent: emotionalIntent,
    is_accusatory: isAccusatory,
    references_previous_statement: referencesPrev,
    references_evidence_id: referencesEvidenceId,
    relevance,
    confidence: 0.92,
  };
}
