import type { QuestionSet } from "@/types";

import terminalSystems from "./01-terminal-systems.json";
import serverSystems from "./02-server-systems.json";
import operatingSystems from "./03-operating-systems.json";
import systemInformation from "./04-system-information.json";
import securityThreats from "./05-security-threats.json";
import securityCountermeasures from "./06-security-countermeasures.json";

export const questionSets: QuestionSet[] = [
  terminalSystems as QuestionSet,
  serverSystems as QuestionSet,
  operatingSystems as QuestionSet,
  systemInformation as QuestionSet,
  securityThreats as QuestionSet,
  securityCountermeasures as QuestionSet,
];

export function getQuestionSet(chapter: string): QuestionSet | undefined {
  return questionSets.find((qs) => qs.chapter === chapter);
}
