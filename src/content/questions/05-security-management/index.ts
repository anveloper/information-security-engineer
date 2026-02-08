import type { QuestionSet } from "@/types";

import securityManagement from "./01-security-management.json";
import securityLaws from "./02-security-laws.json";
import incidentResponse from "./03-incident-response.json";

export const questionSets: QuestionSet[] = [
  securityManagement as QuestionSet,
  securityLaws as QuestionSet,
  incidentResponse as QuestionSet,
];

export function getQuestionSet(chapter: string): QuestionSet | undefined {
  return questionSets.find((qs) => qs.chapter === chapter);
}
