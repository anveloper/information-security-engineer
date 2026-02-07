import { Link } from "react-router-dom";
import { SUBJECTS } from "@/types";
import type { Subject } from "@/types";
import { getQuestionSetsBySubject } from "@/content/questions";

export default function Quiz() {
  const subjectList = Object.entries(SUBJECTS) as [Subject, string][];

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">문제 풀이</h1>

        <ul className="flex flex-col gap-3">
          {subjectList.map(([key, name], index) => {
            const questionSets = getQuestionSetsBySubject(key);
            const totalQuestions = questionSets.reduce((sum, qs) => sum + qs.questions.length, 0);

            return (
              <li key={key}>
                <Link
                  to={`/quiz/${key}`}
                  className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-sm transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-400">과목 {index + 1}</span>
                      <p className="font-medium text-gray-900">{name}</p>
                    </div>
                    {totalQuestions > 0 && (
                      <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
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
