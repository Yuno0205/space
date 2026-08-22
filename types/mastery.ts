import { SkillCode } from "@/types/revise";

export type QualifiableSkillCode = Extract<SkillCode, "recognition" | "speaking" | "listening">;

export type QualificationColumn =
  | "recognition_qualified"
  | "pronunciation_qualified"
  | "listening_qualified";

export const QUALIFICATION_COLUMN: Record<QualifiableSkillCode, QualificationColumn> = {
  recognition: "recognition_qualified",
  speaking: "pronunciation_qualified",
  listening: "listening_qualified",
};
