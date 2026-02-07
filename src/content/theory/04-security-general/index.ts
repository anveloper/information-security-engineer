import Cryptography from './01-cryptography.mdx';
import AccessControl from './02-access-control.mdx';
import SecurityEvaluation from './03-security-evaluation.mdx';

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
    id: '01-cryptography',
    title: '암호학',
    description: '대칭키/비대칭키 암호, 해시, 전자서명, PKI',
    chapter: '4',
    order: 1,
    component: Cryptography,
  },
  {
    id: '02-access-control',
    title: '접근통제',
    description: '인증, 인가, 접근통제 모델, 보안 모델',
    chapter: '4',
    order: 2,
    component: AccessControl,
  },
  {
    id: '03-security-evaluation',
    title: '보안 평가 및 인증',
    description: 'CC, ISMS, 위험 관리, 보안 감사',
    chapter: '4',
    order: 3,
    component: SecurityEvaluation,
  },
];

export function getPost(id: string): Post | undefined {
  return posts.find((post) => post.id === id);
}
