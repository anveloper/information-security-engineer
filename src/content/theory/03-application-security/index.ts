import WebSecurity from './01-web-security.mdx';
import DatabaseSecurity from './02-database-security.mdx';
import SecureDevelopment from './03-secure-development.mdx';

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
    id: '01-web-security',
    title: '웹 보안',
    description: 'OWASP Top 10, SQL Injection, XSS, CSRF',
    chapter: '3',
    order: 1,
    component: WebSecurity,
  },
  {
    id: '02-database-security',
    title: '데이터베이스 보안',
    description: '접근 제어, 암호화, 감사, SQL Injection',
    chapter: '3',
    order: 2,
    component: DatabaseSecurity,
  },
  {
    id: '03-secure-development',
    title: '소프트웨어 개발 보안',
    description: 'Secure SDLC, 시큐어 코딩, 보안 테스트',
    chapter: '3',
    order: 3,
    component: SecureDevelopment,
  },
];

export function getPost(id: string): Post | undefined {
  return posts.find((post) => post.id === id);
}
