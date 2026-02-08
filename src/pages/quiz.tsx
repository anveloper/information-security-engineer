import { Link } from "react-router-dom";
import { SUBJECTS } from "@/types";
import type { Subject } from "@/types";
import { getQuestionSetsBySubject } from "@/content/questions";
import { usePageMeta } from "@/hooks";

export default function Quiz() {
  usePageMeta({
    title: "문제 풀이",
    description: "정보보안기사 과목별 문제 풀이 - 시스템 보안, 네트워크 보안, 어플리케이션 보안, 정보보안 일반, 정보보안 관리 및 법규",
  });
  const subjectList = Object.entries(SUBJECTS) as [Subject, string][];

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">문제 풀이</h1>

        <ul className="flex flex-col gap-3">
          {subjectList.map(([key, name], index) => {
            const questionSets = getQuestionSetsBySubject(key);
            const totalQuestions = questionSets.reduce((sum, qs) => sum + qs.questions.length, 0);

            return (
              <li key={key}>
                <Link
                  to={`/quiz/${key}`}
                  className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:shadow-sm transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-400 dark:text-gray-500">과목 {index + 1}</span>
                      <p className="font-medium text-gray-900 dark:text-white">{name}</p>
                    </div>
                    {totalQuestions > 0 && (
                      <span className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/50 px-2 py-1 rounded">
                        {totalQuestions}문제
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
