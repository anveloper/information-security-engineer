import systemSecurity from './system-security.json';
import type { Subject } from '../../types';

export interface TheorySection {
  id: string;
  title: string;
  content: string;
  keywords: string[];
}

export interface TheoryTopic {
  id: string;
  chapter: string;
  title: string;
  sections: TheorySection[];
}

export interface TheoryData {
  subject: Subject;
  title: string;
  topics: TheoryTopic[];
}

const theoryData: Partial<Record<Subject, TheoryData>> = {
  'system-security': systemSecurity as TheoryData,
};

export function getTheoryData(subject: Subject): TheoryData | null {
  return theoryData[subject] || null;
}

export function getTheoryTopic(subject: Subject, topicId: string): TheoryTopic | null {
  const data = theoryData[subject];
  if (!data) return null;
  return data.topics.find((t) => t.id === topicId) || null;
}

export function getTheorySection(
  subject: Subject,
  topicId: string,
  sectionId: string
): TheorySection | null {
  const topic = getTheoryTopic(subject, topicId);
  if (!topic) return null;
  return topic.sections.find((s) => s.id === sectionId) || null;
}
