import type { QuestionSet, Subject } from "@/types";

import { questionSets as systemSecuritySets } from "./01-system-security";

// 과목별 문제 세트 매핑
const questionSetsBySubject: Record<string, QuestionSet[]> = {
  "system-security": systemSecuritySets,
  "network-security": [],
  "application-security": [],
  "security-general": [],
  "security-management": [],
};

export function getQuestionSetsBySubject(subject: Subject): QuestionSet[] {
  return questionSetsBySubject[subject] || [];
}

export function getQuestionSet(subject: Subject, chapter: string): QuestionSet | undefined {
  const sets = questionSetsBySubject[subject];
  return sets?.find((qs) => qs.chapter === chapter);
}

export function getAllQuestionSets(): QuestionSet[] {
  return Object.values(questionSetsBySubject).flat();
}
