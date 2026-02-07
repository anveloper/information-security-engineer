import { Link, useParams } from "react-router-dom";
import { getQuestionSetsBySubject } from "@/content/questions";
import type { Subject } from "@/types";
import { SUBJECTS } from "@/types";

export default function SubjectQuiz() {
  const { subject } = useParams<{ subject: Subject }>();
  const subjectKey = subject as Subject;
  const subjectName = subject ? SUBJECTS[subjectKey] : "알 수 없음";

  const questionSets = getQuestionSetsBySubject(subjectKey);

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/quiz" className="hover:text-blue-600">
            문제 풀이
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{subjectName}</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">{subjectName}</h1>

        {questionSets.length > 0 ? (
          <div className="space-y-3">
            {questionSets.map((qs) => (
              <Link
                key={qs.chapter}
                to={`/quiz/${subject}/${qs.chapter}`}
                className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-500 hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 w-10 h-10 flex items-center justify-center bg-green-50 text-green-600 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900">{qs.chapterName}</h3>
                      <p className="text-sm text-gray-500">{qs.questions.length}문제</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">문제가 준비 중입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
