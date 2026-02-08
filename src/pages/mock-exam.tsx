import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { getQuestionSetsBySubject } from "@/content/questions";
import { saveWrongAnswer } from "@/utils/wrong-answers";
import type { Subject, Question } from "@/types";
import { SUBJECTS } from "@/types";

const QUESTIONS_PER_SUBJECT = 20;
const PASS_SUBJECT_SCORE = 40; // 과목당 40점 이상
const PASS_AVERAGE_SCORE = 60; // 평균 60점 이상

interface ExamQuestion {
  subject: Subject;
  subjectName: string;
  question: Question;
  questionSetId: string;
}

interface SubjectScore {
  subject: Subject;
  subjectName: string;
  total: number;
  correct: number;
  score: number;
  pass: boolean;
}

type Phase = "ready" | "exam" | "result";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function buildExamQuestions(): ExamQuestion[] {
  const subjectKeys = Object.keys(SUBJECTS) as Subject[];
  const examQuestions: ExamQuestion[] = [];

  for (const subject of subjectKeys) {
    const questionSets = getQuestionSetsBySubject(subject);
    const allQuestions: { question: Question; questionSetId: string }[] = [];

    for (const qs of questionSets) {
      for (const q of qs.questions) {
        allQuestions.push({
          question: q,
          questionSetId: `${subject}/${qs.chapter}`,
        });
      }
    }

    if (allQuestions.length === 0) continue;

    const selected = shuffleArray(allQuestions).slice(0, QUESTIONS_PER_SUBJECT);
    for (const item of selected) {
      examQuestions.push({
        subject,
        subjectName: SUBJECTS[subject],
        question: item.question,
        questionSetId: item.questionSetId,
      });
    }
  }

  return examQuestions;
}

function getSubjectQuestionCounts(): { subject: Subject; name: string; count: number }[] {
  const subjectKeys = Object.keys(SUBJECTS) as Subject[];
  return subjectKeys
    .map((subject) => {
      const sets = getQuestionSetsBySubject(subject);
      const count = sets.reduce((sum, qs) => sum + qs.questions.length, 0);
      return { subject, name: SUBJECTS[subject], count };
    })
    .filter((s) => s.count > 0);
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// --- Ready Phase ---

function ReadyPhase({ onStart }: { onStart: () => void }) {
  const subjects = getSubjectQuestionCounts();
  const totalQuestions = subjects.reduce(
    (sum, s) => sum + Math.min(s.count, QUESTIONS_PER_SUBJECT),
    0
  );

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">모의고사</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          실제 시험과 동일한 형식으로 진행됩니다. 과목당 최대 {QUESTIONS_PER_SUBJECT}문제가 출제됩니다.
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">출제 과목</h2>
          <div className="space-y-3">
            {subjects.map((s) => (
              <div key={s.subject} className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">{s.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.min(s.count, QUESTIONS_PER_SUBJECT)}문제
                  {s.count < QUESTIONS_PER_SUBJECT && (
                    <span className="text-xs ml-1">(전체 {s.count}문제)</span>
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <span className="font-medium text-gray-900 dark:text-white">총 출제</span>
            <span className="font-medium text-gray-900 dark:text-white">{totalQuestions}문제</span>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 text-sm text-blue-800 dark:text-blue-300">
          <p className="font-medium mb-1">합격 기준</p>
          <ul className="list-disc list-inside space-y-1">
            <li>과목당 {PASS_SUBJECT_SCORE}점 이상 (과락 방지)</li>
            <li>전체 평균 {PASS_AVERAGE_SCORE}점 이상</li>
          </ul>
        </div>

        <button
          onClick={onStart}
          disabled={subjects.length === 0}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          시험 시작
        </button>
      </div>
    </div>
  );
}

// --- Exam Phase ---

function ExamPhase({
  questions,
  onSubmit,
}: {
  questions: ExamQuestion[];
  onSubmit: (answers: Map<number, number>, elapsed: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [startTime] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    questionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentIndex]);

  const handleSelect = (answerIndex: number) => {
    setAnswers((prev) => new Map(prev).set(currentIndex, answerIndex));
  };

  const handleSubmitClick = () => {
    const unansweredCount = questions.length - answers.size;
    if (unansweredCount > 0) {
      setShowSubmitConfirm(true);
    } else {
      onSubmit(answers, Date.now() - startTime);
    }
  };

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = answers.get(currentIndex);

  // Subject boundaries for navigator
  const subjectBoundaries: { subject: string; subjectName: string; startIndex: number }[] = [];
  let prevSubject = "";
  questions.forEach((q, i) => {
    if (q.subject !== prevSubject) {
      subjectBoundaries.push({ subject: q.subject, subjectName: q.subjectName, startIndex: i });
      prevSubject = q.subject;
    }
  });

  return (
    <div className="py-8 px-4 pb-24" ref={questionRef}>
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentQuestion.subjectName}
            </span>
            <span className="text-sm text-gray-400 dark:text-gray-500 mx-2">|</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="text-sm font-mono text-gray-700 dark:text-gray-300">
            {formatTime(elapsed)}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="mb-6">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm px-3 py-1 rounded-full mb-3">
              Q{currentIndex + 1}
            </span>
            <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
              {currentQuestion.question.question}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {currentQuestion.question.options.map((option, index) => {
              const optionNumber = index + 1;
              const isSelected = selectedAnswer === optionNumber;

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(optionNumber)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition cursor-pointer ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                  }`}
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300 mr-3">
                    {optionNumber}.
                  </span>
                  <span className="text-gray-800 dark:text-gray-200">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitClick}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                제출
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                다음
              </button>
            )}
          </div>
        </div>

        {/* Submit confirm modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
              <p className="text-gray-900 dark:text-white mb-4">
                아직 {questions.length - answers.size}문제를 풀지 않았습니다. 제출하시겠습니까?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  계속 풀기
                </button>
                <button
                  onClick={() => onSubmit(answers, Date.now() - startTime)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  제출
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Question Navigator */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">문제 이동</h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {answers.size}/{questions.length} 풀이 완료
            </span>
          </div>
          {subjectBoundaries.map((boundary, bIdx) => {
            const nextBoundary = subjectBoundaries[bIdx + 1];
            const endIndex = nextBoundary ? nextBoundary.startIndex : questions.length;

            return (
              <div key={boundary.subject} className="mb-3 last:mb-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {boundary.subjectName}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {questions.slice(boundary.startIndex, endIndex).map((_, localIdx) => {
                    const globalIdx = boundary.startIndex + localIdx;
                    const isAnswered = answers.has(globalIdx);
                    const isCurrent = globalIdx === currentIndex;

                    let btnClass =
                      "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600";
                    if (isCurrent) {
                      btnClass = "bg-blue-600 text-white";
                    } else if (isAnswered) {
                      btnClass =
                        "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300";
                    }

                    return (
                      <button
                        key={globalIdx}
                        onClick={() => setCurrentIndex(globalIdx)}
                        className={`w-9 h-9 rounded text-xs font-medium transition ${btnClass}`}
                      >
                        {globalIdx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- Result Phase ---

function ResultPhase({
  questions,
  answers,
  elapsed,
  onRetry,
}: {
  questions: ExamQuestion[];
  answers: Map<number, number>;
  elapsed: number;
  onRetry: () => void;
}) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  const toggleQuestion = useCallback((idx: number) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }, []);

  // Calculate scores
  const subjectScores: SubjectScore[] = [];
  const subjectMap = new Map<Subject, { correct: number; total: number; subjectName: string }>();

  questions.forEach((eq, idx) => {
    if (!subjectMap.has(eq.subject)) {
      subjectMap.set(eq.subject, { correct: 0, total: 0, subjectName: eq.subjectName });
    }
    const entry = subjectMap.get(eq.subject)!;
    entry.total++;
    const selected = answers.get(idx);
    if (selected === eq.question.answer) {
      entry.correct++;
    }
  });

  for (const [subject, data] of subjectMap) {
    const score = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    subjectScores.push({
      subject,
      subjectName: data.subjectName,
      total: data.total,
      correct: data.correct,
      score,
      pass: score >= PASS_SUBJECT_SCORE,
    });
  }

  const totalCorrect = subjectScores.reduce((sum, s) => sum + s.correct, 0);
  const totalQuestions = questions.length;
  const averageScore =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const allSubjectsPass = subjectScores.every((s) => s.pass);
  const overallPass = allSubjectsPass && averageScore >= PASS_AVERAGE_SCORE;

  // Collect wrong questions
  const wrongQuestions: { index: number; eq: ExamQuestion; selected: number | undefined }[] = [];
  questions.forEach((eq, idx) => {
    const selected = answers.get(idx);
    if (selected !== eq.question.answer) {
      wrongQuestions.push({ index: idx, eq, selected });
    }
  });

  // Save wrong answers
  useEffect(() => {
    for (const wq of wrongQuestions) {
      if (wq.selected !== undefined) {
        saveWrongAnswer(wq.eq.questionSetId, wq.eq.question.id, wq.selected);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Result header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">모의고사 결과</h1>
          <p className="text-gray-500 dark:text-gray-400">소요 시간: {formatTime(elapsed)}</p>
        </div>

        {/* Overall score */}
        <div
          className={`rounded-lg p-6 mb-6 text-center ${
            overallPass
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          }`}
        >
          <p className="text-5xl font-bold mb-2">
            <span className={overallPass ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
              {averageScore}
            </span>
            <span className="text-2xl text-gray-400">점</span>
          </p>
          <p
            className={`text-lg font-semibold ${
              overallPass ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
            }`}
          >
            {overallPass ? "합격" : "불합격"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {totalCorrect}/{totalQuestions} 정답
          </p>
        </div>

        {/* Subject scores */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">과목별 성적</h2>
          <div className="space-y-3">
            {subjectScores.map((s) => (
              <div key={s.subject} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{s.subjectName}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {s.correct}/{s.total}
                  </span>
                  <span
                    className={`font-medium min-w-[3rem] text-right ${
                      s.pass
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {s.score}점
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      s.pass
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {s.pass ? "합격" : "과락"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wrong questions */}
        {wrongQuestions.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              틀린 문제 ({wrongQuestions.length}문제)
            </h2>
            <div className="space-y-3">
              {wrongQuestions.map(({ index, eq, selected }) => {
                const isExpanded = expandedQuestions.has(index);
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Q{index + 1} - {eq.subjectName}
                          </span>
                          <p className="text-gray-900 dark:text-white mt-1 leading-relaxed">
                            {eq.question.question}
                          </p>
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-400 ml-2 flex-shrink-0 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="mt-4">
                        <div className="space-y-2 mb-3">
                          {eq.question.options.map((option, idx) => {
                            const optionNumber = idx + 1;
                            const isSelected = optionNumber === selected;
                            const isCorrect = optionNumber === eq.question.answer;

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
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {eq.question.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            다시 풀기
          </button>
          <Link
            to="/"
            className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium text-center"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

export default function MockExam() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [finalAnswers, setFinalAnswers] = useState<Map<number, number>>(new Map());
  const [finalElapsed, setFinalElapsed] = useState(0);

  const handleStart = () => {
    const questions = buildExamQuestions();
    setExamQuestions(questions);
    setPhase("exam");
  };

  const handleSubmit = (answers: Map<number, number>, elapsed: number) => {
    setFinalAnswers(answers);
    setFinalElapsed(elapsed);
    setPhase("result");
    window.scrollTo({ top: 0 });
  };

  const handleRetry = () => {
    setPhase("ready");
    setExamQuestions([]);
    setFinalAnswers(new Map());
    setFinalElapsed(0);
    window.scrollTo({ top: 0 });
  };

  if (phase === "ready") {
    return <ReadyPhase onStart={handleStart} />;
  }

  if (phase === "exam") {
    return <ExamPhase questions={examQuestions} onSubmit={handleSubmit} />;
  }

  return (
    <ResultPhase
      questions={examQuestions}
      answers={finalAnswers}
      elapsed={finalElapsed}
      onRetry={handleRetry}
    />
  );
}
