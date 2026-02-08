import { useState } from "react";
import { Link } from "react-router-dom";
import { getQuestionSet } from "@/content/questions";
import { getWrongAnswers, removeWrongAnswer, clearAllWrongAnswers } from "@/utils/wrong-answers";
import type { Subject, Question, WrongAnswer } from "@/types";
import { SUBJECTS } from "@/types";

interface WrongAnswerWithQuestion {
  wrongAnswer: WrongAnswer;
  question: Question;
  subjectKey: Subject;
  subjectName: string;
  chapterName: string;
}

function resolveWrongAnswers(): WrongAnswerWithQuestion[] {
  const wrongAnswers = getWrongAnswers();
  const resolved: WrongAnswerWithQuestion[] = [];

  for (const wa of wrongAnswers) {
    const [subject, chapter] = wa.questionSetId.split("/");
    const subjectKey = subject as Subject;
    const questionSet = getQuestionSet(subjectKey, chapter);
    if (!questionSet) continue;

    const question = questionSet.questions.find((q) => q.id === wa.questionId);
    if (!question) continue;

    resolved.push({
      wrongAnswer: wa,
      question,
      subjectKey,
      subjectName: SUBJECTS[subjectKey] || subject,
      chapterName: questionSet.chapterName,
    });
  }

  return resolved;
}

function groupBySubject(items: WrongAnswerWithQuestion[]) {
  const groups: Record<string, { subjectName: string; items: WrongAnswerWithQuestion[] }> = {};
  for (const item of items) {
    if (!groups[item.subjectKey]) {
      groups[item.subjectKey] = { subjectName: item.subjectName, items: [] };
    }
    groups[item.subjectKey].items.push(item);
  }
  return groups;
}

export default function WrongAnswers() {
  const [items, setItems] = useState(() => resolveWrongAnswers());
  const [expandedExplanations, setExpandedExplanations] = useState<Set<string>>(new Set());
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleRemove = (questionSetId: string, questionId: number) => {
    removeWrongAnswer(questionSetId, questionId);
    setItems(resolveWrongAnswers());
  };

  const handleClearAll = () => {
    clearAllWrongAnswers();
    setItems([]);
    setShowConfirmClear(false);
  };

  const toggleExplanation = (key: string) => {
    setExpandedExplanations((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (items.length === 0) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">오답 노트</h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">틀린 문제가 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  const grouped = groupBySubject(items);

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">오답 노트</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">총 {items.length}문제</p>
          </div>
          {showConfirmClear ? (
            <div className="flex gap-2">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
              >
                확인
              </button>
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
            >
              전체 삭제
            </button>
          )}
        </div>

        {/* Grouped by subject */}
        {Object.entries(grouped).map(([subjectKey, group]) => (
          <div key={subjectKey} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              {group.subjectName}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({group.items.length}문제)
              </span>
            </h2>

            <div className="space-y-4">
              {group.items.map((item) => {
                const key = `${item.wrongAnswer.questionSetId}-${item.wrongAnswer.questionId}`;
                const isExpanded = expandedExplanations.has(key);
                const [, chapter] = item.wrongAnswer.questionSetId.split("/");

                return (
                  <div
                    key={key}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5"
                  >
                    {/* Chapter + Delete */}
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.chapterName}
                      </span>
                      <button
                        onClick={() =>
                          handleRemove(item.wrongAnswer.questionSetId, item.wrongAnswer.questionId)
                        }
                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition"
                        aria-label="삭제"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Question */}
                    <p className="text-gray-900 dark:text-white mb-4 leading-relaxed">
                      {item.question.question}
                    </p>

                    {/* Answers comparison */}
                    <div className="space-y-2 mb-4">
                      {item.question.options.map((option, idx) => {
                        const optionNumber = idx + 1;
                        const isSelected = optionNumber === item.wrongAnswer.selectedAnswer;
                        const isCorrect = optionNumber === item.question.answer;

                        let className = "text-gray-600 dark:text-gray-400";
                        let prefix = "";
                        if (isCorrect) {
                          className = "text-green-700 dark:text-green-400 font-medium";
                          prefix = " (정답)";
                        } else if (isSelected) {
                          className = "text-red-600 dark:text-red-400";
                          prefix = " (내 선택)";
                        }

                        return (
                          <div key={idx} className={`text-sm ${className}`}>
                            {optionNumber}. {option}{prefix}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Toggle + Link */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleExplanation(key)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {isExpanded ? "해설 접기" : "해설 보기"}
                      </button>
                      <Link
                        to={`/quiz/${subjectKey}/${chapter}`}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        다시 풀기
                      </Link>
                    </div>

                    {/* Explanation Content */}
                    {isExpanded && (
                      <div className="mt-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {item.question.explanation}
                        </p>
                        {item.question.keywords.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.question.keywords.map((kw, i) => (
                              <span
                                key={i}
                                className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
