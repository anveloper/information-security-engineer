import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SUBJECTS } from '../types';
import type { Subject } from '../types';

type Tab = 'quiz' | 'theory';

export default function SubjectDetail() {
  const { subject } = useParams<{ subject: Subject }>();
  const subjectName = subject ? SUBJECTS[subject as Subject] : '알 수 없음';
  const [activeTab, setActiveTab] = useState<Tab>('quiz');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{subjectName}</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'quiz'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-500'
            }`}
          >
            문제 풀이
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'theory'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-500'
            }`}
          >
            이론 학습
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          {activeTab === 'quiz' ? (
            <p className="text-gray-500">문제가 준비 중입니다.</p>
          ) : (
            <p className="text-gray-500">이론 내용이 준비 중입니다.</p>
          )}
        </div>

        <div className="mt-8">
          <Link to="/subjects" className="text-blue-600 hover:underline">
            ← 과목 선택으로
          </Link>
        </div>
      </div>
    </div>
  );
}
