import { GoogleGenerativeAI } from "@google/generative-ai";
import { CaseBible, Difficulty, Character } from "./schema";
import { validateCaseBible } from "./validator";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Available production models in priority order
const MODEL_CASCADE = ["gemini-3.6-flash", "gemini-flash-latest"];

// Procedural archetypes for dynamic variety
const CASE_ARCHETYPES = [
  {
    title: "The Solarium Cipher",
    settingName: "The Sterling Solarium, Highcliff Heights",
    victimName: "Julian Vance",
    victimOccupation: "Cryptographer & Rare Antiquities Dealer",
    killerName: "Evelyn Cross",
    killerOccupation: "Senior Archivist & Art Broker",
    weaponName: "Heavy Cast-Iron Astrolabe",
    weaponDesc: "16th-century cast-iron nautical astrolabe with a heavy brass hub. Traces of limestone dust on the bevel.",
    motiveCategory: "greed" as const,
    motive: "Julian discovered Evelyn was forging 17th-century maritime charts and pocketing millions from European auction houses.",
    method: "Struck Julian from behind in the glass conservatory, staged as a fall from the spiral library ladder at 10:15 PM.",
  },
  {
    title: "The Midnight Sonata",
    settingName: "Blackwood Symphony Hall, Private Salon",
    victimName: "Clara Lindt",
    victimOccupation: "Principal Conductor & Philanthropist",
    killerName: "Dominic Thorne",
    killerOccupation: "Orchestra Executive Director",
    weaponName: "Weighted Brass Metronome",
    weaponDesc: "Heavy mechanical Maelzel brass metronome with blood traces wiped from the weighted base.",
    motiveCategory: "cover_up" as const,
    motive: "Dominic was caught embezzling foundation endowment funds before Clara was to announce the international audit at midnight.",
    method: "Assaulted Clara in the backstage salon at 9:45 PM and cleaned the brass base with piano polishing oil.",
  },
  {
    title: "The Vanishing Ledger",
    settingName: "The Oakhaven Country Club, President's Suite",
    victimName: "Harrison Vance",
    victimOccupation: "Real Estate Tycoon & Club President",
    killerName: "Victoria Sterling",
    killerOccupation: "Chief Investment Officer",
    weaponName: "Solid Bronze Championship Trophy",
    weaponDesc: "Heavy vintage 1974 bronze golf championship trophy with hairline fractures on the marble plinth.",
    motiveCategory: "blackmail" as const,
    motive: "Harrison threatened to expose Victoria's fraudulent zoning bribes to state prosecutors the following morning.",
    method: "Bludgeoned Harrison beside the private terrace fountain at 11:20 PM and fabricated an alibi with the sommelier in the lounge.",
  }
];

export async function generateNewCase(
  difficulty: Difficulty = "Medium",
  themeHint?: string
): Promise<CaseBible> {
  const caseId = `case-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const caseNum = `CASE #T-${Math.floor(1000 + Math.random() * 9000)}`;

  // If Gemini is available, attempt multi-model prompt generation with fallback
  if (genAI) {
    for (const modelName of MODEL_CASCADE) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.75,
          },
        });

        const prompt = `Generate a complete, airtight, deterministic murder mystery Case Bible in JSON.
Difficulty: ${difficulty}.
Theme: ${themeHint || "Classic high-stakes noir estate murder"}.

CRITICAL REQUIREMENTS:
- Exactly 1 Victim and 1 Killer.
- Total 3-4 suspects/witnesses.
- Exactly 1 locked murder weapon in evidence.
- Every character must have: character_id, name, age, occupation, relation_to_victim, role ('suspect' or 'witness'), avatar_code, description, personality, initial_state (stress, fear, anger, defensiveness, confidence, cooperation), alibi (claimed_location, claimed_activity, claimed_time_range, is_true, vulnerabilities), murder_involvement (is_killer, is_accomplice, knows_killer_identity, knows_murder_occurred), known_facts, hidden_facts, secrets, lies, fears, motivations.
- Canonical truth must specify: killer_id, killer_name, motive_category, motive_details, method, weapon_id, weapon_name, cause_of_death, murder_location, murder_timestamp, body_disposal, complete_narrative.
- Solution criteria must specify: required_killer_id, accepted_motive_keywords, accepted_weapon_ids, accepted_timeline_events, critical_evidence_ids, key_contradictions.

Return strict JSON conforming to CaseBible schema.`;

        const res = await model.generateContent(prompt);
        const text = res.response.text();
        const raw = JSON.parse(text);
        const sanitized = sanitizeCaseBible(raw, caseId, caseNum, difficulty);

        const val = validateCaseBible(sanitized);
        if (val.isValid) {
          return sanitized;
        }
      } catch (err) {
        console.warn(`Case generation on ${modelName} failed, falling back:`, err);
      }
    }
  }

  // Fallback to procedural authored archetype
  return createProceduralArchetypeCase(caseId, caseNum, difficulty);
}

function sanitizeCaseBible(
  raw: any,
  caseId: string,
  caseNum: string,
  difficulty: Difficulty
): CaseBible {
  const killerId = raw.truth?.killer_id || raw.characters?.[0]?.character_id || "suspect-1";
  const weaponId = raw.truth?.weapon_id || raw.evidence?.[0]?.evidence_id || "evidence-weapon-primary";

  const sanitizedCharacters: Character[] = (raw.characters || []).map((c: any, idx: number) => {
    const isKiller = c.character_id === killerId || Boolean(c.murder_involvement?.is_killer);
    return {
      character_id: c.character_id || `char-${idx + 1}`,
      name: c.name || `Suspect ${idx + 1}`,
      age: Number(c.age) || 35,
      occupation: c.occupation || "Estate Guest",
      relation_to_victim: c.relation_to_victim || "Acquaintance",
      role: c.role || "suspect",
      avatar_code: c.avatar_code || "CH",
      description: c.description || "A person of interest at the scene.",
      personality: c.personality || {
        temperament: "Guarded",
        communication_style: "Measured",
        baseline_confidence: 60,
        baseline_cooperativeness: 50,
        baseline_aggression: 20,
        vulnerability_triggers: ["financial discrepancies"],
        tell_patterns: ["avoids direct gaze", "swallows nervously"],
      },
      initial_state: c.initial_state || {
        stress: isKiller ? 45 : 20,
        fear: isKiller ? 35 : 15,
        anger: 10,
        defensiveness: isKiller ? 50 : 20,
        confidence: isKiller ? 60 : 70,
        cooperation: isKiller ? 50 : 80,
      },
      alibi: c.alibi || {
        claimed_location: "Library lounge",
        claimed_activity: "Reading",
        claimed_time_range: "Evening",
        is_true: !isKiller,
        vulnerabilities: isKiller ? ["No one else in the room"] : [],
      },
      murder_involvement: {
        is_killer: isKiller,
        is_accomplice: false,
        knows_killer_identity: isKiller,
        knows_murder_occurred: true,
      },
      known_facts: Array.isArray(c.known_facts) ? c.known_facts : [],
      hidden_facts: Array.isArray(c.hidden_facts) ? c.hidden_facts : [],
      secrets: Array.isArray(c.secrets) ? c.secrets : [],
      lies: Array.isArray(c.lies) ? c.lies : [],
      fears: Array.isArray(c.fears) ? c.fears : ["Exposure"],
      motivations: Array.isArray(c.motivations) ? c.motivations : ["Self-preservation"],
    };
  });

  return {
    ...raw,
    case_id: caseId,
    case_number: caseNum,
    difficulty: difficulty,
    setting: raw.setting || {
      estate_name: "The Highcliff Estate",
      location_description: "Private manor under rainstorm",
      weather: "Torrential downpour",
      time_of_discovery: "9:30 PM",
      atmosphere: "Dark, tense, stormy",
    },
    victim: raw.victim || {
      victim_id: "victim-main",
      name: "Arthur Vance",
      age: 45,
      occupation: "Industrialist",
      background: "Wealthy estate owner",
      last_seen: "8:45 PM in the study",
    },
    characters: sanitizedCharacters,
    truth: {
      ...raw.truth,
      killer_id: killerId,
      weapon_id: weaponId,
    },
    solution_criteria: raw.solution_criteria || {
      required_killer_id: killerId,
      accepted_motive_keywords: ["money", "fraud", "audit", "greed", "blackmail"],
      accepted_weapon_ids: [weaponId],
      accepted_timeline_events: ["tl-2"],
      critical_evidence_ids: [weaponId],
      key_contradictions: ["alibi mismatch"],
    },
  };
}

function createProceduralArchetypeCase(
  caseId: string,
  caseNum: string,
  difficulty: Difficulty
): CaseBible {
  const archetype = CASE_ARCHETYPES[Math.floor(Math.random() * CASE_ARCHETYPES.length)];

  return {
    case_id: caseId,
    case_number: caseNum,
    title: archetype.title,
    subtitle: `A homicide investigation at ${archetype.settingName}`,
    difficulty: difficulty,
    setting: {
      estate_name: archetype.settingName,
      location_description: "Private salon and estate grounds under heavy rainfall",
      weather: "Cold torrential downpour, howling gusts",
      time_of_discovery: "9:45 PM",
      atmosphere: "Claustrophobic, high-stakes noir tension",
    },
    victim: {
      victim_id: "victim-main",
      name: archetype.victimName,
      age: 42,
      occupation: archetype.victimOccupation,
      background: "Prominent high-society figure with intricate financial ties",
      last_seen: "8:30 PM in the grand foyer",
    },
    truth: {
      killer_id: "suspect-killer",
      killer_name: archetype.killerName,
      motive_category: archetype.motiveCategory,
      motive_details: archetype.motive,
      method: archetype.method,
      weapon_id: "evidence-weapon-primary",
      weapon_name: archetype.weaponName,
      cause_of_death: "Asphyxiation secondary to drowning preceded by severe blunt cranial trauma",
      murder_location: "Private conservatory grounds",
      murder_timestamp: "8:56 PM",
      body_disposal: "Submerged in the private fountain basin",
      complete_narrative: `At 8:56 PM, ${archetype.killerName} ambushed ${archetype.victimName} using the ${archetype.weaponName}. After striking the fatal blow, they pushed the victim into the water and fabricated an alibi.`,
    },
    solution_criteria: {
      required_killer_id: "suspect-killer",
      accepted_motive_keywords: ["fraud", "embezzlement", "bribe", "audit", "forgery", "money", "greed"],
      accepted_weapon_ids: ["evidence-weapon-primary"],
      accepted_timeline_events: ["tl-2"],
      critical_evidence_ids: ["evidence-weapon-primary", "evidence-clue-2"],
      key_contradictions: ["The killer claimed to be in the wine cellar, but security logs prove they were at the scene."],
    },
    characters: [
      {
        character_id: "suspect-killer",
        name: archetype.killerName,
        age: 38,
        occupation: archetype.killerOccupation || "Executive",
        relation_to_victim: "Business Partner & Associate",
        role: "suspect",
        avatar_code: "EC",
        description: "Sharp, immaculately dressed, but displays subtle micro-tremors in their hands.",
        personality: {
          temperament: "Calculating, highly composed until trapped",
          communication_style: "Precise, articulate",
          baseline_confidence: 65,
          baseline_cooperativeness: 45,
          baseline_aggression: 25,
          vulnerability_triggers: ["financial audit", "surveillance records"],
          tell_patterns: ["swallows nervously when questioned on timeline"],
        },
        initial_state: {
          stress: 45,
          fear: 30,
          anger: 15,
          defensiveness: 55,
          confidence: 65,
          cooperation: 45,
        },
        alibi: {
          claimed_location: "Wine Cellar / Lounge",
          claimed_activity: "Sampling vintage reserve",
          claimed_time_range: "8:30 PM - 9:30 PM",
          is_true: false,
          vulnerabilities: ["Refuted by keycard telemetry log"],
        },
        murder_involvement: {
          is_killer: true,
          is_accomplice: false,
          knows_killer_identity: true,
          knows_murder_occurred: true,
        },
        known_facts: ["fact-murder-weapon", "fact-scene-access"],
        hidden_facts: ["fact-scene-access"],
        secrets: [
          {
            secret_id: "sec-killer-1",
            topic: "Financial embezzlement",
            description: archetype.motive,
            reason_to_hide: "Proves fatal motive for murder",
            trigger_keywords: ["audit", "money", "funds"],
          }
        ],
        lies: [
          {
            lie_id: "lie-killer-1",
            claim: "I was in the wine cellar continuously from 8:30 PM onwards.",
            actual_truth: "Left the cellar at 8:50 PM to commit the assault.",
            motivation_for_lie: "Fabricate an unbreakable alibi.",
            contradicting_evidence_ids: ["evidence-clue-2"],
            break_threshold_stress: 70,
          }
        ],
        fears: ["Prison", "Financial disgrace"],
        motivations: ["Concealing fraudulent transactions"],
      },
      {
        character_id: "suspect-witness",
        name: "Arthur Pendelton",
        age: 51,
        occupation: "Head Sommelier & Groundskeeper",
        relation_to_victim: "Estate Staff",
        role: "witness",
        avatar_code: "AP",
        description: "An observant, meticulous sommelier who manages the estate cellar registry.",
        personality: {
          temperament: "Cautious, detail-oriented",
          communication_style: "Formal, precise",
          baseline_confidence: 75,
          baseline_cooperativeness: 85,
          baseline_aggression: 5,
          vulnerability_triggers: ["threat of police arrest"],
          tell_patterns: ["adjusts spectacles when recalling times"],
        },
        initial_state: {
          stress: 20,
          fear: 10,
          anger: 5,
          defensiveness: 15,
          confidence: 75,
          cooperation: 85,
        },
        alibi: {
          claimed_location: "Cellar Tasting Vault",
          claimed_activity: "Inventory logging",
          claimed_time_range: "8:00 PM - 10:00 PM",
          is_true: true,
          vulnerabilities: [],
        },
        murder_involvement: {
          is_killer: false,
          is_accomplice: false,
          knows_killer_identity: false,
          knows_murder_occurred: true,
        },
        known_facts: ["fact-scene-access"],
        hidden_facts: [],
        secrets: [],
        lies: [],
        fears: ["Losing employment"],
        motivations: ["Assisting police faithfully"],
      }
    ],
    relationships: [
      {
        source_character_id: "suspect-killer",
        target_character_id: "victim-main",
        relation_type: "Business Partners",
        public_status: "Close associates",
        hidden_truth: "Bitter hostility over pending audit",
        tension_level: 90,
      }
    ],
    facts: [
      {
        fact_id: "fact-murder-weapon",
        category: "forensic",
        summary: `The ${archetype.weaponName} inflicted the fatal cranial trauma.`,
        details: "Matches microscopic fracture pattern on posterior parietal bone.",
        is_canonical_truth: true,
      },
      {
        fact_id: "fact-scene-access",
        category: "timeline",
        summary: "Security access log proves killer entered conservatory at 8:52 PM.",
        details: "Refutes claimed continuous presence in the wine cellar.",
        is_canonical_truth: true,
      }
    ],
    timeline: [
      {
        event_id: "tl-1",
        timestamp: "8:30 PM",
        time_numeric: 2030,
        location: "Grand Foyer",
        summary: "Guests gather for evening drinks as rain intensifies.",
        involved_character_ids: ["suspect-killer", "victim-main"],
        is_murder_event: false,
        witness_character_ids: ["suspect-witness"],
        canonical_truth: "Public gathering before dinner",
        public_initial_knowledge: true,
      },
      {
        event_id: "tl-2",
        timestamp: "8:56 PM",
        time_numeric: 2056,
        location: "Private Conservatory Grounds",
        summary: "The victim is ambushed with the heavy blunt weapon.",
        involved_character_ids: ["suspect-killer", "victim-main"],
        is_murder_event: true,
        witness_character_ids: [],
        canonical_truth: "Killer strikes victim and flees to cellar",
        public_initial_knowledge: false,
      }
    ],
    evidence: [
      {
        evidence_id: "evidence-weapon-primary",
        name: archetype.weaponName,
        category: "physical",
        location_found: "Behind conservatory planters",
        initial_description: archetype.weaponDesc,
        canonical_truth: "The murder weapon used in the fatal assault",
        discoverable_facts: ["fact-murder-weapon"],
        forensic_facts: ["Traces of victim's blood and chlorinated water on handle"],
        related_characters: ["suspect-killer"],
        related_events: ["tl-2"],
        examined_initially: false,
      },
      {
        evidence_id: "evidence-clue-2",
        name: "Security Access Keycard Log",
        category: "digital",
        location_found: "Estate Guardhouse Terminal",
        initial_description: "Automated digital electronic log showing gate access and corridor swipes.",
        canonical_truth: "Proves killer accessed scene at 8:52 PM",
        discoverable_facts: ["fact-scene-access"],
        forensic_facts: ["Unaltered system logs with verified timestamp telemetry"],
        related_characters: ["suspect-killer", "suspect-witness"],
        related_events: ["tl-1", "tl-2"],
        examined_initially: true,
      }
    ],
    forensics: {
      autopsy_id: "AUT-7721",
      estimated_time_of_death: "Between 8:45 PM and 9:15 PM",
      official_cause_of_death: "Asphyxiation secondary to drowning preceded by severe blunt cranial trauma",
      contusions_and_wounds: [
        "Depressed comminuted fracture on posterior-right parietal bone",
        "Linear abrasion on left shoulder consistent with struggle"
      ],
      toxicology_findings: [
        "Blood Alcohol Concentration: 0.03%",
        "Negative for narcotics or sedatives"
      ],
      pool_water_analysis: "Lungs contained 480 mL of chlorinated freshwater, indicating victim was breathing when submerged",
      initial_examiner_notes: "Blunt force trauma caused immediate loss of consciousness followed by drowning in fountain basin.",
      deep_forensics_revealed: true,
    },
    red_herrings: [
      {
        herring_id: "rh-1",
        title: "Disputed Inheritance Letter",
        description: "An angry handwritten letter from an estranged cousin threatening litigation.",
        apparent_suspicion: "Suggests outside motive from family relative",
        innocent_explanation: "The cousin was confirmed in another city with an ironclad alibi",
      }
    ],
    opening_scene: {
      title: "The Crime Scene",
      briefing: `You arrive at ${archetype.settingName} amidst a torrential downpour. The victim, ${archetype.victimName}, was discovered in the private grounds. State police have secured the perimeter.`,
      initial_observations: [
        "Victim positioned face-down with severe posterior cranial trauma.",
        "Rain has washed away exterior footprints, but indoor access points remain intact.",
        "Key suspects and staff are assembled in the private lounge awaiting interrogation."
      ],
      available_characters: ["suspect-killer", "suspect-witness"],
      available_evidence: ["evidence-weapon-primary", "evidence-clue-2"],
    },
  };
}
