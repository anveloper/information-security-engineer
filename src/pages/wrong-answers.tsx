import { Link } from 'react-router-dom';

export default function WrongAnswers() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">오답 노트</h1>

        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">틀린 문제가 없습니다.</p>
        </div>

        <div className="mt-8">
          <Link to="/" className="text-blue-600 hover:underline">
            ← 홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
