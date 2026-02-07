import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SUBJECTS } from '../types';
import type { Subject } from '../types';
import { getTheoryData } from '../data/theory';
import type { TheorySection } from '../data/theory';

type Tab = 'quiz' | 'theory';

export default function SubjectDetail() {
  const { subject } = useParams<{ subject: Subject }>();
  const subjectKey = subject as Subject;
  const subjectName = subject ? SUBJECTS[subjectKey] : '알 수 없음';
  const [activeTab, setActiveTab] = useState<Tab>('quiz');
  const [selectedSection, setSelectedSection] = useState<TheorySection | null>(null);

  const theoryData = getTheoryData(subjectKey);

  const handleSectionClick = (section: TheorySection) => {
    setSelectedSection(section);
  };

  const handleBackToList = () => {
    setSelectedSection(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{subjectName}</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab('quiz');
              setSelectedSection(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'quiz'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-500'
            }`}
          >
            문제 풀이
          </button>
          <button
            onClick={() => {
              setActiveTab('theory');
              setSelectedSection(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'theory'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-500'
            }`}
          >
            이론 학습
          </button>
        </div>

        {activeTab === 'quiz' ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">문제가 준비 중입니다.</p>
          </div>
        ) : selectedSection ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <button
              onClick={handleBackToList}
              className="text-blue-600 hover:underline mb-4 inline-block"
            >
              ← 목차로 돌아가기
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{selectedSection.title}</h2>
            <div className="prose prose-gray max-w-none">
              <TheoryContent content={selectedSection.content} />
            </div>
            {selectedSection.keywords.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">키워드</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSection.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : theoryData ? (
          <div className="space-y-4">
            {theoryData.topics.map((topic) => (
              <div key={topic.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 mb-3">
                  {topic.chapter}장. {topic.title}
                </h3>
                <ul className="space-y-2">
                  {topic.sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => handleSectionClick(section)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition text-gray-700 hover:text-blue-600"
                      >
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">이론 내용이 준비 중입니다.</p>
          </div>
        )}

        <div className="mt-8">
          <Link to="/subjects" className="text-blue-600 hover:underline">
            ← 과목 선택으로
          </Link>
        </div>
      </div>
    </div>
  );
}

function TheoryContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];

  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${index}`} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm my-4">
            <code>{codeContent.join('\n')}</code>
          </pre>
        );
        codeContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-lg font-bold text-gray-900 mt-6 mb-3">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-base font-semibold text-gray-800 mt-4 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('- **')) {
      const match = line.match(/^- \*\*(.+?)\*\*:?\s*(.*)$/);
      if (match) {
        elements.push(
          <li key={index} className="ml-4 my-1">
            <strong>{match[1]}</strong>{match[2] ? `: ${match[2]}` : ''}
          </li>
        );
      }
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={index} className="ml-4 my-1">
          {line.slice(2)}
        </li>
      );
    } else if (line.match(/^\d+\. /)) {
      elements.push(
        <li key={index} className="ml-4 my-1 list-decimal">
          {line.replace(/^\d+\. /, '')}
        </li>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={index} className="h-2" />);
    } else {
      const formatted = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>');
      elements.push(
        <p key={index} className="my-2 text-gray-700" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    }
  });

  return <>{elements}</>;
}
