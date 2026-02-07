import NetworkFundamentals from './01-network-fundamentals.mdx';
import NetworkAttacks from './02-network-attacks.mdx';
import NetworkSecurityTech from './03-network-security-tech.mdx';

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
    id: '01-network-fundamentals',
    title: '네트워크 일반',
    description: 'OSI 7계층, TCP/IP, IP 주소 체계',
    chapter: '2',
    order: 1,
    component: NetworkFundamentals,
  },
  {
    id: '02-network-attacks',
    title: '네트워크 기반 공격',
    description: '스니핑, 스푸핑, DoS/DDoS, MITM',
    chapter: '2',
    order: 2,
    component: NetworkAttacks,
  },
  {
    id: '03-network-security-tech',
    title: '네트워크 보안 기술',
    description: '방화벽, VPN, IDS/IPS, NAC',
    chapter: '2',
    order: 3,
    component: NetworkSecurityTech,
  },
];

export function getPost(id: string): Post | undefined {
  return posts.find((post) => post.id === id);
}
