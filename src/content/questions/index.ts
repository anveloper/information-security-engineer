import type { QuestionSet, Subject } from "@/types";

import { questionSets as systemSecuritySets } from "./01-system-security";
import { questionSets as networkSecuritySets } from "./02-network-security";
import { questionSets as applicationSecuritySets } from "./03-application-security";
import { questionSets as securityGeneralSets } from "./04-security-general";
import { questionSets as securityManagementSets } from "./05-security-management";

// 과목별 문제 세트 매핑
const questionSetsBySubject: Record<string, QuestionSet[]> = {
  "system-security": systemSecuritySets,
  "network-security": networkSecuritySets,
  "application-security": applicationSecuritySets,
  "security-general": securityGeneralSets,
  "security-management": securityManagementSets,
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
