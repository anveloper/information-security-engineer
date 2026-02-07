import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">정보보안기사</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">자격증 시험 대비를 위한 학습 플랫폼</p>

        <div className="grid gap-4">
          <Link
            to="/theory"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-sm transition"
          >
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 flex items-center justify-center bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </span>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">이론 학습</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">핵심 개념과 이론을 학습합니다</p>
              </div>
            </div>
          </Link>

          <Link
            to="/quiz"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:shadow-sm transition"
          >
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 flex items-center justify-center bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </span>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">문제 풀이</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">문제를 풀고 실력을 확인합니다</p>
              </div>
            </div>
          </Link>

          <Link
            to="/wrong-answers"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 hover:shadow-sm transition"
          >
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 flex items-center justify-center bg-orange-50 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </span>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">오답 노트</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">틀린 문제를 복습합니다</p>
              </div>
            </div>
          </Link>

          <Link
            to="/mock-exam"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 hover:shadow-sm transition"
          >
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 flex items-center justify-center bg-purple-50 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">모의고사</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">실전처럼 연습합니다</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
