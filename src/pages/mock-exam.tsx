import { Link } from 'react-router-dom';

export default function MockExam() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">모의고사</h1>

        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">모의고사 기능이 준비 중입니다.</p>
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
