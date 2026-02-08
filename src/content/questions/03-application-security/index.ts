import type { QuestionSet } from "@/types";

import webSecurity from "./01-web-security.json";
import databaseSecurity from "./02-database-security.json";
import secureDevelopment from "./03-secure-development.json";

export const questionSets: QuestionSet[] = [
  webSecurity as QuestionSet,
  databaseSecurity as QuestionSet,
  secureDevelopment as QuestionSet,
];

export function getQuestionSet(chapter: string): QuestionSet | undefined {
  return questionSets.find((qs) => qs.chapter === chapter);
}
