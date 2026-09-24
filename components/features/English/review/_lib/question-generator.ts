import { ActivityType } from "@/types/revise";
import { VocabularyCard } from "@/types/vocabulary";
import { pickRandom, shuffleArray } from "@/utils";
import { TProgress, TQuestion } from "../types";

export function buildFillBlankSentence(example: string, word: string) {
  if (!example || !word) return null;

  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escapedWord}\\b`, "i");

  if (!regex.test(example)) return null;

  return example.replace(regex, "_____");
}

export function generateQuestion(
  progress: TProgress,
  activities: ActivityType[],
  vocabularies: VocabularyCard[]
): TQuestion | null {
  const vocab = progress.vocabulary;

  if (!vocab) return null;

  const skillActivities = activities.filter((a) => a.skill_code === progress.skill_code);
  if (!skillActivities.length) return null;

  const supportedActivities = skillActivities.filter((a) =>
    [
      "mcq_meaning",
      "mcq_word",
      "listen_choose",
      "listen_type",
      "fill_blank",
      "context_mcq",
      "listen_repeat",
    ].includes(a.code)
  );

  if (!supportedActivities.length) return null;

  const activity = pickRandom<ActivityType>(supportedActivities);
  if (!activity) return null;

  const sameLevelVocabs = vocabularies.filter(
    (v) => v.id !== vocab.id && (!!v.level ? v.level === vocab.level : true)
  );

  switch (activity.code) {
    case "mcq_meaning": {
      if (!vocab.translation) return null;

      const distractors = shuffleArray(
        sameLevelVocabs
          .map((v) => v.translation)
          .filter((t): t is string => !!t && t !== vocab.translation)
      ).slice(0, 3);

      const options = shuffleArray([vocab.translation, ...distractors]);
      if (options.length < 2) return null;

      return {
        type: "mcq",
        progress,
        activity,
        prompt: `What does "${vocab.word}" mean?`,
        options,
        correctAnswer: vocab.translation,
      };
    }

    case "mcq_word": {
      if (!vocab.translation) return null;

      const distractors = shuffleArray(
        sameLevelVocabs.map((v) => v.word).filter((w) => !!w && w !== vocab.word)
      ).slice(0, 3);

      const options = shuffleArray([vocab.word, ...distractors]);
      if (options.length < 2) return null;

      return {
        type: "mcq",
        progress,
        activity,
        prompt: `Which English word means "${vocab.translation}"?`,
        options,
        correctAnswer: vocab.word,
      };
    }

    case "listen_choose": {
      if (!vocab.audio_url) return null;

      const distractors = shuffleArray(
        sameLevelVocabs.map((v) => v.word).filter((w) => !!w && w !== vocab.word)
      ).slice(0, 3);

      const options = shuffleArray([vocab.word, ...distractors]);
      if (options.length < 2) return null;

      return {
        type: "mcq",
        progress,
        activity,
        prompt: "Listen to the audio and choose the correct word:",
        options,
        correctAnswer: vocab.word,
        meta: {
          audioUrl: vocab.audio_url,
        },
      };
    }

    case "listen_type": {
      if (!vocab.audio_url) return null;

      return {
        type: "typing",
        progress,
        activity,
        prompt: "Listen to the audio and type the word you hear:",
        correctAnswer: vocab.word,
        meta: {
          audioUrl: vocab.audio_url,
        },
      };
    }

    case "listen_repeat": {
      if (!vocab.example) return null;

      return {
        type: "speaking",
        progress,
        activity,
        prompt: "Listen to the word and repeat it clearly:",
        meta: {
          sentence: vocab.example,
        },
      };
    }

    case "fill_blank": {
      if (!vocab.example) return null;

      const blanked = buildFillBlankSentence(vocab.example, vocab.word);
      if (!blanked) return null;

      return {
        type: "typing",
        progress,
        activity,
        prompt: "Fill in the blank with the missing word:",
        correctAnswer: vocab.word,
        meta: {
          sentence: blanked,
        },
      };
    }

    case "context_mcq": {
      if (!vocab.example || !vocab.translation) return null;

      const distractors = shuffleArray(
        sameLevelVocabs
          .map((v) => v.translation)
          .filter((t): t is string => !!t && t !== vocab.translation)
      ).slice(0, 3);

      const options = shuffleArray([vocab.translation, ...distractors]);
      if (options.length < 2) return null;

      return {
        type: "mcq",
        progress,
        activity,
        prompt: `In the following sentence, what is the closest meaning of "${vocab.word}"?\n\n${vocab.example}`,
        options,
        correctAnswer: vocab.translation,
      };
    }

    default:
      return null;
  }
}
