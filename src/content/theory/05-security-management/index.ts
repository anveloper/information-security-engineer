import SecurityManagement from './01-security-management.mdx';
import SecurityLaws from './02-security-laws.mdx';
import IncidentResponse from './03-incident-response.mdx';

export interface Post {
  id: string;
  title: string;
  description: string;
  chapter: string;
  order: number;
  component: React.ComponentType;
}

export const posts: Post[] = [
  {
    id: '01-security-management',
    title: '정보보호 관리',
    description: '정보보호 거버넌스, 정책, 자산관리, BCM',
    chapter: '5',
    order: 1,
    component: SecurityManagement,
  },
  {
    id: '02-security-laws',
    title: '정보보안 법규',
    description: '개인정보 보호법, 정보통신망법, GDPR',
    chapter: '5',
    order: 2,
    component: SecurityLaws,
  },
  {
    id: '03-incident-response',
    title: '침해사고 대응',
    description: '사고 대응 절차, 포렌식, 악성코드 분석',
    chapter: '5',
    order: 3,
    component: IncidentResponse,
  },
];

export function getPost(id: string): Post | undefined {
  return posts.find((post) => post.id === id);
}
