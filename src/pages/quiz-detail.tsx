import { useState, useCallback, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { getQuestionSetsBySubject } from "@/content/questions";
import { saveWrongAnswer, removeWrongAnswer } from "@/utils/wrong-answers";
import type { Subject } from "@/types";
import { SUBJECTS } from "@/types";

export default function QuizDetail() {
  const { subject, chapter } = useParams<{ subject: Subject; chapter: string }>();
  const subjectKey = subject as Subject;
  const subjectName = subject ? SUBJECTS[subjectKey] : "알 수 없음";

  const questionSets = getQuestionSetsBySubject(subjectKey);
  const questionSet = questionSets.find((qs) => qs.chapter === chapter);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Map<number, boolean>>(new Map());

  const scrollByScreen = useCallback((direction: "up" | "down") => {
    const scrollAmount = window.innerHeight * 0.8;
    window.scrollBy({
      top: direction === "down" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
  }, [currentIndex]);

  if (!questionSet) {
    return <Navigate to={`/quiz/${subject}`} replace />;
  }

  const questions = questionSet.questions;
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const questionSetId = `${subject}/${chapter}`;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);

    const isCorrect = selectedAnswer === currentQuestion.answer;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      removeWrongAnswer(questionSetId, currentQuestion.id);
    } else {
      saveWrongAnswer(questionSetId, currentQuestion.id, selectedAnswer);
    }
    setAnsweredQuestions((prev) => new Map(prev).set(currentIndex, isCorrect));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const progress = (answeredQuestions.size / questions.length) * 100;

  return (
    <div className="py-8 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link to="/quiz" className="hover:text-blue-600 dark:hover:text-blue-400">
            문제 풀이
          </Link>
          <span className="mx-2">/</span>
          <Link to={`/quiz/${subject}`} className="hover:text-blue-600 dark:hover:text-blue-400">
            {subjectName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">{questionSet.chapterName}</span>
        </nav>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{questionSet.chapterName}</span>
            <span>
              {currentIndex + 1} / {questions.length} (정답: {correctCount}/{answeredQuestions.size})
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm px-3 py-1 rounded-full mb-3">
              Q{currentIndex + 1}
            </span>
            <p className="text-lg text-gray-900 dark:text-white leading-relaxed">{currentQuestion.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const optionNumber = index + 1;
              const isSelected = selectedAnswer === optionNumber;
              const isCorrectAnswer = optionNumber === currentQuestion.answer;

              let optionClass = "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500";
              if (showResult) {
                if (isCorrectAnswer) {
                  optionClass = "border-green-500 bg-green-50 dark:bg-green-900/30";
                } else if (isSelected && !isCorrectAnswer) {
                  optionClass = "border-red-500 bg-red-50 dark:bg-red-900/30";
                }
              } else if (isSelected) {
                optionClass = "border-blue-500 bg-blue-50 dark:bg-blue-900/30";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(optionNumber)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${optionClass} ${
                    showResult ? "cursor-default" : "cursor-pointer"
                  }`}
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300 mr-3">{optionNumber}.</span>
                  <span className="text-gray-800 dark:text-gray-200">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showResult && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">해설</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{currentQuestion.explanation}</p>
              {currentQuestion.keywords.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentQuestion.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm px-2 py-1 rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>

            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                정답 확인
              </button>
            ) : isLastQuestion ? (
              <Link
                to={`/quiz/${subject}`}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                완료
              </Link>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                다음
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">문제 이동</h4>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => {
              const isAnswered = answeredQuestions.has(index);
              const isCorrect = answeredQuestions.get(index);
              const isCurrent = index === currentIndex;

              let btnClass = "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600";
              if (isCurrent) {
                btnClass = "bg-blue-600 text-white";
              } else if (isAnswered && isCorrect) {
                btnClass = "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300";
              } else if (isAnswered && !isCorrect) {
                btnClass = "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300";
              }

              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition ${btnClass}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll Buttons */}
      <div className="fixed bottom-6 right-4 flex flex-col gap-2">
        <button
          onClick={() => scrollByScreen("up")}
          className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600"
          aria-label="위로 스크롤"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => scrollByScreen("down")}
          className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600"
          aria-label="아래로 스크롤"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
