import type { QuestionSet } from "@/types";

import networkFundamentals from "./01-network-fundamentals.json";
import networkAttacks from "./02-network-attacks.json";
import networkSecurityTech from "./03-network-security-tech.json";

export const questionSets: QuestionSet[] = [
  networkFundamentals as QuestionSet,
  networkAttacks as QuestionSet,
  networkSecurityTech as QuestionSet,
];

export function getQuestionSet(chapter: string): QuestionSet | undefined {
  return questionSets.find((qs) => qs.chapter === chapter);
}
