export type ProficiencyLevel = "beginner" | "intermediate" | "advanced";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export const PROFICIENCY_TO_CURRENT_LEVELS: Record<ProficiencyLevel, readonly CefrLevel[]> = {
  beginner: ["A1", "A2"],
  intermediate: ["B1", "B2"],
  advanced: ["C1", "C2"],
};

export const PROFICIENCY_TO_LEARNING_PATH_LEVELS: Record<ProficiencyLevel, readonly CefrLevel[]> = {
  beginner: ["A1", "A2"],
  intermediate: ["A1", "A2", "B1", "B2"],
  advanced: ["A1", "A2", "B1", "B2", "C1", "C2"],
};

export function getCurrentLevels(proficiencyLevel: ProficiencyLevel) {
  return PROFICIENCY_TO_CURRENT_LEVELS[proficiencyLevel];
}

export function getLearningPathLevels(proficiencyLevel: ProficiencyLevel) {
  return PROFICIENCY_TO_LEARNING_PATH_LEVELS[proficiencyLevel];
}

export function isProficiencyLevel(value: unknown): value is ProficiencyLevel {
  return value === "beginner" || value === "intermediate" || value === "advanced";
}
