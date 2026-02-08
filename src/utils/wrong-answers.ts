import type { WrongAnswer } from "@/types";

const WRONG_ANSWERS_KEY = "wrong-answers";

export function getWrongAnswers(): WrongAnswer[] {
  try {
    const stored = localStorage.getItem(WRONG_ANSWERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveWrongAnswer(questionSetId: string, questionId: number, selectedAnswer: number) {
  const wrongAnswers = getWrongAnswers();
  const existing = wrongAnswers.find(
    (wa) => wa.questionSetId === questionSetId && wa.questionId === questionId
  );
  if (!existing) {
    wrongAnswers.push({
      questionSetId,
      questionId,
      selectedAnswer,
      timestamp: Date.now(),
    });
    localStorage.setItem(WRONG_ANSWERS_KEY, JSON.stringify(wrongAnswers));
  }
}

export function removeWrongAnswer(questionSetId: string, questionId: number) {
  const wrongAnswers = getWrongAnswers().filter(
    (wa) => !(wa.questionSetId === questionSetId && wa.questionId === questionId)
  );
  localStorage.setItem(WRONG_ANSWERS_KEY, JSON.stringify(wrongAnswers));
}

export function clearAllWrongAnswers() {
  localStorage.removeItem(WRONG_ANSWERS_KEY);
}
