import { CaseBible } from "./schema";

export interface ValidationIssue {
  severity: "error" | "warning";
  field: string;
  message: string;
}

export interface CaseValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export function validateCaseBible(caseBible: CaseBible): CaseValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // 1. Basic Metadata
  if (!caseBible.case_id) {
    errors.push({ severity: "error", field: "case_id", message: "Missing case_id" });
  }
  if (!caseBible.title) {
    errors.push({ severity: "error", field: "title", message: "Missing case title" });
  }

  // 2. Canonical Truth & Murderer
  const killer = caseBible.characters?.find(
    (c) => c.character_id === caseBible.truth?.killer_id
  );
  if (!killer) {
    errors.push({
      severity: "error",
      field: "truth.killer_id",
      message: `Canonical killer '${caseBible.truth?.killer_id}' does not exist in character roster`,
    });
  } else if (!killer.murder_involvement?.is_killer) {
    errors.push({
      severity: "error",
      field: "characters",
      message: `Character '${killer.name}' is canonical killer but murder_involvement.is_killer is false`,
    });
  }

  // Ensure exactly one killer
  const killers = (caseBible.characters || []).filter((c) => Boolean(c.murder_involvement?.is_killer));
  if (killers.length !== 1) {
    errors.push({
      severity: "error",
      field: "characters",
      message: `Expected exactly 1 killer, found ${killers.length}`,
    });
  }

  // 3. Murder Weapon
  const weapon = caseBible.evidence.find(
    (e) => e.evidence_id === caseBible.truth.weapon_id
  );
  if (!weapon) {
    errors.push({
      severity: "error",
      field: "truth.weapon_id",
      message: `Canonical weapon '${caseBible.truth.weapon_id}' not found in evidence list`,
    });
  }

  // 4. Timeline Integrity
  let previousTime = -1;
  const murderEvents = caseBible.timeline.filter((e) => e.is_murder_event);
  if (murderEvents.length === 0) {
    errors.push({
      severity: "error",
      field: "timeline",
      message: "No murder event specified in timeline",
    });
  }

  for (const event of caseBible.timeline) {
    if (event.time_numeric < previousTime) {
      errors.push({
        severity: "error",
        field: `timeline[${event.event_id}]`,
        message: `Timeline event '${event.timestamp}' is out of chronological sequence (${event.time_numeric} < ${previousTime})`,
      });
    }
    previousTime = event.time_numeric;

    // Verify involved characters exist
    for (const charId of event.involved_character_ids) {
      if (
        charId !== caseBible.victim.victim_id &&
        !caseBible.characters.some((c) => c.character_id === charId)
      ) {
        errors.push({
          severity: "error",
          field: `timeline[${event.event_id}]`,
          message: `Involved character '${charId}' does not exist in characters or victim`,
        });
      }
    }
  }

  // 5. Evidence Cross-Referencing
  for (const item of caseBible.evidence) {
    for (const charId of item.related_characters) {
      if (!caseBible.characters.some((c) => c.character_id === charId)) {
        warnings.push({
          severity: "warning",
          field: `evidence[${item.evidence_id}]`,
          message: `Related character '${charId}' not found in characters list`,
        });
      }
    }
  }

  // 6. Character Knowledge Integrity
  const allFactIds = new Set(caseBible.facts.map((f) => f.fact_id));
  for (const char of caseBible.characters) {
    for (const factId of char.known_facts) {
      if (!allFactIds.has(factId)) {
        errors.push({
          severity: "error",
          field: `characters[${char.character_id}].known_facts`,
          message: `Character '${char.name}' references non-existent fact '${factId}'`,
        });
      }
    }

    // Non-killers should not know the internal details of the murder unless they were witnesses or investigators
    if (
      !char.murder_involvement?.is_killer &&
      !char.murder_involvement?.knows_killer_identity &&
      (char.known_facts || []).includes("fact_attack_poolside")
    ) {
      errors.push({
        severity: "error",
        field: `characters[${char.character_id}]`,
        message: `Innocent character '${char.name}' has impossible knowledge of murder attack`,
      });
    }
  }

  // 7. Solvability Check
  if (!caseBible.solution_criteria || (caseBible.solution_criteria.critical_evidence_ids || []).length === 0) {
    warnings.push({
      severity: "warning",
      field: "solution_criteria",
      message: "No critical evidence IDs configured in solution criteria",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
