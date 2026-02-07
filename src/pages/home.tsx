import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">정보보안기사 문제 풀이</h1>
        <p className="text-gray-600 mb-8">정보보안기사 자격증 시험 대비를 위한 학습 플랫폼입니다.</p>

        <nav className="flex flex-col gap-3">
          <Link
            to="/subjects"
            className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition"
          >
            <span className="font-medium text-gray-900">과목별 학습</span>
            <p className="text-sm text-gray-500 mt-1">문제 풀이와 이론 학습</p>
          </Link>
          <Link
            to="/wrong-answers"
            className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition"
          >
            <span className="font-medium text-gray-900">오답 노트</span>
            <p className="text-sm text-gray-500 mt-1">틀린 문제를 복습하세요</p>
          </Link>
          <Link
            to="/mock-exam"
            className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition"
          >
            <span className="font-medium text-gray-900">모의고사</span>
            <p className="text-sm text-gray-500 mt-1">실전처럼 연습하세요</p>
          </Link>
        </nav>
      </div>
    </div>
  );
}
