import TerminalSystems from './01-terminal-systems.mdx';
import ServerSystems from './02-server-systems.mdx';
import OperatingSystems from './03-operating-systems.mdx';
import SystemInformation from './04-system-information.mdx';
import SecurityThreats from './05-security-threats.mdx';
import SecurityCountermeasures from './06-security-countermeasures.mdx';

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
    id: '01-terminal-systems',
    title: '단말 시스템',
    description: 'PC, 모바일, 프린터, IoT/IIoT 보안',
    chapter: '1',
    order: 1,
    component: TerminalSystems,
  },
  {
    id: '02-server-systems',
    title: '서버 시스템',
    description: 'DB, DNS, E-mail, WEB/WAS, 클라우드 보안',
    chapter: '1',
    order: 2,
    component: ServerSystems,
  },
  {
    id: '03-operating-systems',
    title: '운영체제',
    description: 'Windows, Linux, Unix, 모바일 OS 보안',
    chapter: '1',
    order: 3,
    component: OperatingSystems,
  },
  {
    id: '04-system-information',
    title: '시스템 정보',
    description: '환경정보, 인증정보, 감사 로그',
    chapter: '1',
    order: 4,
    component: SystemInformation,
  },
  {
    id: '05-security-threats',
    title: '시스템 보안위협 및 공격기법',
    description: 'APT, 악성코드, 버퍼 오버플로우, SQL Injection',
    chapter: '1',
    order: 5,
    component: SecurityThreats,
  },
  {
    id: '06-security-countermeasures',
    title: '시스템 보안 대응',
    description: '보안 대책, 분석 도구, 보안 솔루션',
    chapter: '1',
    order: 6,
    component: SecurityCountermeasures,
  },
];

export function getPost(id: string): Post | undefined {
  return posts.find((post) => post.id === id);
}
