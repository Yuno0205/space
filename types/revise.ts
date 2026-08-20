export type SkillCode = "recognition" | "listening" | "reading" | "speaking" | "writing";

type ActivityCode =
  | "mcq_meaning"
  | "mcq_word"
  | "match_word_meaning"
  | "listen_choose"
  | "listen_type"
  | "listen_repeat"
  | "fill_blank"
  | "context_mcq";

export type ActivityType = {
  id: string;
  code: ActivityCode;
  name: string;
  skill_code: SkillCode;
};
