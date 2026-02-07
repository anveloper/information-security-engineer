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
  id: string;
  subject: Subject;
  category: string;
  type: 'multiple' | 'short';
  question: string;
  options?: string[];
  answer: string | number;
  explanation?: string;
}

// 사용자 학습 기록
export interface UserProgress {
  solvedQuestions: string[];
  wrongAnswers: string[];
  lastStudyDate: string;
}
