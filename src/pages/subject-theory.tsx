import { Link, useParams } from "react-router-dom";
import { posts as systemSecurityPosts, type Post } from "../content/theory/01-system-security";
import { posts as networkSecurityPosts } from "../content/theory/02-network-security";
import { posts as applicationSecurityPosts } from "../content/theory/03-application-security";
import { posts as securityGeneralPosts } from "../content/theory/04-security-general";
import { posts as securityManagementPosts } from "../content/theory/05-security-management";
import type { Subject } from "@/types";
import { SUBJECTS } from "@/types";
import { usePageMeta } from "@/hooks";

function getPostsBySubject(subject: Subject): Post[] {
  switch (subject) {
    case "system-security":
      return systemSecurityPosts;
    case "network-security":
      return networkSecurityPosts;
    case "application-security":
      return applicationSecurityPosts;
    case "security-general":
      return securityGeneralPosts;
    case "security-management":
      return securityManagementPosts;
    default:
      return [];
  }
}

export default function SubjectTheory() {
  const { subject } = useParams<{ subject: Subject }>();
  const subjectKey = subject as Subject;
  const subjectName = subject ? SUBJECTS[subjectKey] : "알 수 없음";

  const posts = getPostsBySubject(subjectKey);

  usePageMeta({
    title: `${subjectName} - 이론 학습`,
    description: `정보보안기사 ${subjectName} 이론 학습 자료`,
  });

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link to="/theory" className="hover:text-blue-600 dark:hover:text-blue-400">
            이론 학습
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">{subjectName}</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{subjectName}</h1>

        {posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/theory/${subject}/${post.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-sm transition"
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-10 h-10 flex items-center justify-center bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium">
                    {post.chapter}-{post.order}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white">{post.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{post.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">이론 내용이 준비 중입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
