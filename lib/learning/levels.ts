/* Learning Utils */
/* CEFR Levels Mapping */
export const PROFICIENCY_TO_CEFR = {
  beginner: ["A1", "A2"],
  intermediate: ["B1", "B2"],
  advanced: ["C1", "C2"],
} as const;

export type ProficiencyLevel = keyof typeof PROFICIENCY_TO_CEFR;

export function getCefrLevels(proficiencyLevel: ProficiencyLevel) {
  return PROFICIENCY_TO_CEFR[proficiencyLevel];
}
