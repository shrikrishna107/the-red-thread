import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiInterrogationContext, GeminiInterrogationResponse } from "./schema";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Production models in priority order
const INTERROGATION_MODEL_CASCADE = ["gemini-3.6-flash", "gemini-flash-latest"];

// In-memory dialogue cache to prevent redundant quota burn
const dialogueCache = new Map<string, GeminiInterrogationResponse>();

export async function generateInterrogationDialogue(
  context: GeminiInterrogationContext,
  rawPlayerQuestion: string
): Promise<GeminiInterrogationResponse> {
  const cacheKey = `${context.character_name}:${context.current_emotional_state.stress}:${rawPlayerQuestion.trim().toLowerCase()}`;
  if (dialogueCache.has(cacheKey)) {
    return dialogueCache.get(cacheKey)!;
  }

  const systemPrompt = `You are an expert acting engine for a serious noir murder mystery detective game called "The Red Thread" (TELLTALE).
Your task is to generate the in-character spoken dialogue and observable physical body language of a specific character during police interrogation.

CRITICAL LAWS:
1. THE TRUTH IS LOCKED. You must NEVER invent new murder methods, weapons, timelines, suspects, or change who the killer is.
2. ADHERE TO CHARACTER KNOWLEDGE. You may ONLY speak about facts listed under WHAT THE CHARACTER KNOWS.
3. CONCEAL SECRETS. If something is in WHAT THE CHARACTER MUST HIDE, you must deflect, lie, minimize, or become defensive UNLESS the character is cracked under extreme stress (>75).
4. BODY LANGUAGE IS FIRST-CLASS. Describe subtle, realistic, cinematic physical tells (glances, jaw clenches, posture shifts, fidgeting, breathing changes). Describe only what is visually and audibly observable.
5. NEVER BREAK CHARACTER. Never say "As an AI", never mention the "Case Bible" or game mechanics.
6. RESPOND TO EVERYTHING. Even if the question is casual, bizarre, sarcastic, or aggressive, respond naturally in character.

RETURN STRICT JSON conforming to this schema:
{
  "spoken_response": "Exact spoken words of the character in quotation marks or natural speech.",
  "physical_observation": "Third-person observation of the character's observable body language, facial expression, posture, or voice cadence.",
  "emotional_shift": {
    "stress": 0, // integer delta (-10 to +20)
    "fear": 0,
    "anger": 0,
    "defensiveness": 0,
    "cooperation": 0
  },
  "revealed_fact_ids": [],
  "referenced_fact_ids": [],
  "tone": "Measured / Defensive / Grieving / Anxious / Arrogant / Shaken",
  "follow_up_hook": "Optional subtle detail that might catch a sharp detective's ear"
}`;

  const promptContent = `
CHARACTER PROFILE:
- Name: ${context.character_name}
- Role & Relation: ${context.character_role}
- Personality: ${context.personality_summary}
- Current State: Stress ${context.current_emotional_state.stress}/100, Defensiveness ${context.current_emotional_state.defensiveness}/100, Cooperation ${context.current_emotional_state.cooperation}/100, Fear ${context.current_emotional_state.fear}/100.

FACTS KNOWN:
${context.what_character_knows.length > 0 ? context.what_character_knows.map((k) => `- ${k}`).join("\n") : "None relevant."}

FACTS TO CONCEAL / ACTIVE SECRETS:
${context.what_character_must_hide.length > 0 ? context.what_character_must_hide.map((h) => `- ${h}`).join("\n") : "None."}

ACTIVE LIES:
${context.character_active_lies.length > 0 ? context.character_active_lies.map((l) => `- ${l}`).join("\n") : "None."}

DISCOVERED EVIDENCE IN PLAY:
${context.relevant_discovered_evidence.length > 0 ? context.relevant_discovered_evidence.map((e) => `- ${e}`).join("\n") : "None currently presented."}

PRIOR CONVERSATION TRANSCRIPT:
${context.prior_dialogue_summary.length > 0 ? context.prior_dialogue_summary.join("\n") : "(No previous dialogue)"}

DETECTIVE'S QUESTION:
"${rawPlayerQuestion}"

QUESTION INTERPRETATION:
Type: ${context.interpretation.question_type} | Intent: ${context.interpretation.emotional_intent} | Accusatory: ${context.interpretation.is_accusatory} | Relevance: ${context.interpretation.relevance}

Generate the character's authentic response and observable body language as JSON.`;

  if (genAI) {
    for (const modelName of INTERROGATION_MODEL_CASCADE) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        });

        const result = await model.generateContent({
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\n${promptContent}` }] },
          ],
        });

        const responseText = result.response.text();
        const parsed = JSON.parse(responseText) as GeminiInterrogationResponse;

        if (parsed.spoken_response && parsed.physical_observation) {
          dialogueCache.set(cacheKey, parsed);
          return parsed;
        }
      } catch (err: any) {
        // Continue cascade on 429 quota or 503 service unavailable
        const status = err.status || (err.message?.includes("429") ? 429 : err.message?.includes("503") ? 503 : null);
        if (status === 429 || status === 503) {
          continue;
        }
        console.warn(`Gemini dialogue error on ${modelName}:`, err.message || err);
      }
    }
  }

  // High-fidelity deterministic fallback engine ensuring seamless uninterrupted gameplay
  const fallback = generateDeterministicFallbackResponse(context, rawPlayerQuestion);
  dialogueCache.set(cacheKey, fallback);
  return fallback;
}

function generateDeterministicFallbackResponse(
  context: GeminiInterrogationContext,
  rawPlayerQuestion: string
): GeminiInterrogationResponse {
  const isAccusatory = context.interpretation.is_accusatory;
  const isKiller = context.what_character_must_hide.length > 0;
  const stress = context.current_emotional_state.stress;
  const lowerQ = rawPlayerQuestion.toLowerCase();

  let spoken = "";
  let observation = "";
  let deltaStress = 0;
  let deltaDefensiveness = 0;
  let deltaFear = 0;
  let deltaCooperation = 0;
  let tone = "Measured";
  let hook: string | undefined;

  if (isAccusatory) {
    if (isKiller) {
      deltaStress = 14;
      deltaDefensiveness = 18;
      deltaFear = 12;
      deltaCooperation = -10;
      tone = "Defensive & Agitated";
      if (stress > 65) {
        spoken = `"You have no right to throw reckless allegations around without proof! Look at the timeline—I couldn't have been in two places at once!"`;
        observation = `${context.character_name}'s eyes dart toward the exit; their breathing becomes noticeably shallow and hurried.`;
        hook = "Their voice momentarily cracked when challenged on the timeline.";
      } else {
        spoken = `"That is an outrageous accusation, Detective. I loved them as a colleague and partner. Check the security logs if you doubt my word."`;
        observation = `${context.character_name} tightens their posture, resting both hands flat against the table to conceal a tremor.`;
      }
    } else {
      deltaStress = 6;
      deltaDefensiveness = 10;
      tone = "Indignant";
      spoken = `"Me? You're barking up the wrong tree, Detective. I was nowhere near the scene, and I have nothing to hide from your investigation."`;
      observation = `${context.character_name} shakes their head with a mixture of disbelief and quiet frustration.`;
    }
  } else if (lowerQ.includes("alibi") || lowerQ.includes("where were you") || lowerQ.includes("at the time")) {
    if (isKiller) {
      deltaStress = 8;
      deltaDefensiveness = 10;
      spoken = context.character_active_lies[0] || `"I was in the lounge reviewing documents the entire evening until the commotion began."`;
      observation = `${context.character_name} delivers the statement with rehearsed precision, refusing to break eye contact.`;
      hook = "The timing feels unusually precise, almost recited.";
    } else {
      spoken = `"I was attending to my duties throughout the evening. You can ask any of the staff; I was never alone for long."`;
      observation = `${context.character_name} speaks calmly, gesturing with open palms.`;
    }
  } else if (lowerQ.includes("motive") || lowerQ.includes("money") || lowerQ.includes("audit") || lowerQ.includes("argument")) {
    if (isKiller) {
      deltaStress = 16;
      deltaFear = 10;
      deltaDefensiveness = 15;
      tone = "Strained";
      spoken = `"Every business has minor disagreements, but to suggest that led to murder is absurd. We were resolving everything amicably."`;
      observation = `${context.character_name} clears their throat, their knuckles whitening around their coffee cup.`;
      hook = "A subtle swallow accompanied the mention of the financial dispute.";
    } else {
      spoken = `"There were rumors of tension lately over financial matters, but they kept the specifics behind closed doors."`;
      observation = `${context.character_name} lowers their voice and glances toward the hallway before answering.`;
      hook = "Mentioned hearing raised voices in the private office earlier.";
    }
  } else if (lowerQ.includes("weapon") || lowerQ.includes("paperweight") || lowerQ.includes("trophy") || lowerQ.includes("astrolabe") || lowerQ.includes("metronome")) {
    if (isKiller) {
      deltaStress = 18;
      deltaDefensiveness = 14;
      spoken = `"I've seen it around the study, of course, like everyone else. Why are you focusing so intently on everyday ornaments?"`;
      observation = `${context.character_name}'s gaze instinctively flickers away, a bead of sweat forming near their hairline.`;
    } else {
      spoken = `"It's usually kept on the display shelf in the main room. I noticed it wasn't in its customary place earlier this evening."`;
      observation = `${context.character_name} nods thoughtfully, recollecting the study's arrangement.`;
    }
  } else {
    spoken = `"I want to help you get to the truth of what happened, Detective. Just ask whatever you need to know."`;
    observation = `${context.character_name} maintains a steady, watchful expression across the table.`;
  }

  return {
    spoken_response: spoken,
    physical_observation: observation,
    emotional_shift: {
      stress: deltaStress,
      fear: deltaFear,
      anger: 0,
      defensiveness: deltaDefensiveness,
      cooperation: deltaCooperation,
    },
    revealed_fact_ids: [],
    referenced_fact_ids: [],
    tone,
    follow_up_hook: hook,
  };
}
