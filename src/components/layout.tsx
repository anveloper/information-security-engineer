import type { ReactNode } from "react";
import Header from "./header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-200 bg-white">
        <p>정보보안기사 문제 풀이</p>
      </footer>
    </div>
  );
}
