// 과목 타입
export type Subject =
  | 'system-security'      // 시스템 보안
  | 'network-security'     // 네트워크 보안
  | 'application-security' // 어플리케이션 보안
  | 'security-general'     // 정보보안 일반
  | 'security-management'; // 정보보안 관리 및 법규

// 과목 정보
export const SUBJECTS: Record<Subject, string> = {
  'system-security': '시스템 보안',
  'network-security': '네트워크 보안',
  'application-security': '어플리케이션 보안',
  'security-general': '정보보안 일반',
  'security-management': '정보보안 관리 및 법규',
};

// 문제 타입
export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number; // 1-based index
  explanation: string;
  keywords: string[];
}

// 챕터별 문제 세트
export interface QuestionSet {
  subject: string;
  subjectName: string;
  chapter: string;
  chapterName: string;
  questions: Question[];
}

// 오답 기록
export interface WrongAnswer {
  questionSetId: string; // subject/chapter 형태
  questionId: number;
  selectedAnswer: number;
  timestamp: number;
}

// 사용자 학습 기록
export interface UserProgress {
  solvedQuestions: string[];
  wrongAnswers: WrongAnswer[];
  lastStudyDate: string;
}
