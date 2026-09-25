export type ReviewProgressUpdate = {
  correctCount: number;
  wrongCount: number;
  nextReviewAt: string;
};

export function computeReviewProgress(
  correctCountBeforeUpdate: number,
  wrongCountBeforeUpdate: number,
  isCorrect: boolean,
  reviewedAt: Date
): ReviewProgressUpdate {
  const nextReviewAt = new Date(reviewedAt);

  // FAIL
  if (!isCorrect) {
    nextReviewAt.setHours(nextReviewAt.getHours() + 12);

    return {
      correctCount: 0,
      wrongCount: wrongCountBeforeUpdate + 1,
      nextReviewAt: nextReviewAt.toISOString(),
    };
  }

  // PASS
  const correctCount = correctCountBeforeUpdate + 1;

  if (correctCount === 1) {
    nextReviewAt.setDate(nextReviewAt.getDate() + 1);
  } else if (correctCount === 2) {
    nextReviewAt.setDate(nextReviewAt.getDate() + 3);
  } else if (correctCount === 3) {
    nextReviewAt.setDate(nextReviewAt.getDate() + 7);
  } else {
    nextReviewAt.setDate(nextReviewAt.getDate() + 14);
  }

  return {
    correctCount,
    wrongCount: wrongCountBeforeUpdate,
    nextReviewAt: nextReviewAt.toISOString(),
  };
}
