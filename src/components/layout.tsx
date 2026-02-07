import type { ReactNode } from "react";
import Header from "./header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Header />
      <main className="flex-1 pt-14" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top))' }}>{children}</main>
      <footer className="py-6 text-center text-sm text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <p>정보보안기사 문제 풀이</p>
      </footer>
    </div>
  );
}
