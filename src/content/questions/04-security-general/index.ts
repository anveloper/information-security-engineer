import type { QuestionSet } from "@/types";

import cryptography from "./01-cryptography.json";
import accessControl from "./02-access-control.json";
import securityEvaluation from "./03-security-evaluation.json";

export const questionSets: QuestionSet[] = [
  cryptography as QuestionSet,
  accessControl as QuestionSet,
  securityEvaluation as QuestionSet,
];

export function getQuestionSet(chapter: string): QuestionSet | undefined {
  return questionSets.find((qs) => qs.chapter === chapter);
}
