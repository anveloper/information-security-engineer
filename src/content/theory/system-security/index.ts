import TerminalSystems from './01-terminal-systems.mdx';
import ServerSystems from './02-server-systems.mdx';

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
];

export function getPost(id: string): Post | undefined {
  return posts.find((post) => post.id === id);
}
