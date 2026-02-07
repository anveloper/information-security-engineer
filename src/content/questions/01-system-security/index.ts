import type { QuestionSet } from "@/types";

import terminalSystems from "./01-terminal-systems.json";
import serverSystems from "./02-server-systems.json";

export const questionSets: QuestionSet[] = [
  terminalSystems as QuestionSet,
  serverSystems as QuestionSet,
];

export function getQuestionSet(chapter: string): QuestionSet | undefined {
  return questionSets.find((qs) => qs.chapter === chapter);
}
