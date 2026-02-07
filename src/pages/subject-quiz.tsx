import { Link, useParams } from "react-router-dom";
import type { Subject } from "../types";
import { SUBJECTS } from "../types";

export default function SubjectQuiz() {
  const { subject } = useParams<{ subject: Subject }>();
  const subjectKey = subject as Subject;
  const subjectName = subject ? SUBJECTS[subjectKey] : "알 수 없음";

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

        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">문제가 준비 중입니다.</p>
        </div>
      </div>
    </div>
  );
}
