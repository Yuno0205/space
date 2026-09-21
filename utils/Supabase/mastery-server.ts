import { createClient } from "@/lib/supabase/server";

import { QUALIFICATION_COLUMN, QualifiableSkillCode } from "@/types/mastery";

export async function filterUnqualifiedVocabularies<T extends { id: string }>(
  vocabularies: T[],
  skillCode: QualifiableSkillCode
): Promise<T[]> {
  if (vocabularies.length === 0) {
    return [];
  }

  const supabase = await createClient();

  const column = QUALIFICATION_COLUMN[skillCode];

  const vocabularyIds = vocabularies.map((vocabulary) => vocabulary.id);

  const { data: qualifiedRows, error } = await supabase
    .from("user_vocab_mastery")
    .select("vocabulary_id")
    .eq(column, true)
    .in("vocabulary_id", vocabularyIds);

  if (error) {
    throw error;
  }

  const qualifiedIds = new Set(qualifiedRows.map((row) => row.vocabulary_id));

  return vocabularies.filter((vocabulary) => !qualifiedIds.has(vocabulary.id));
}
