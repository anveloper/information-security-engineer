import { useCallback, useEffect, useRef } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { MDXProvider } from "@mdx-js/react";
import { posts as systemSecurityPosts, type Post } from "../content/theory/01-system-security";
import { posts as networkSecurityPosts } from "../content/theory/02-network-security";
import { posts as applicationSecurityPosts } from "../content/theory/03-application-security";
import { posts as securityGeneralPosts } from "../content/theory/04-security-general";
import { posts as securityManagementPosts } from "../content/theory/05-security-management";
import { mdxComponents } from "@/components";
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

function isAtBottom() {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  return scrollTop + windowHeight >= documentHeight - 50;
}

export default function TheoryDetail() {
  const { subject, postId } = useParams<{ subject: Subject; postId: string }>();
  const navigate = useNavigate();
  const subjectKey = subject as Subject;
  const subjectName = subject ? SUBJECTS[subjectKey] : "알 수 없음";
  const bottomScrollAttemptRef = useRef(0);
  const lastScrollTimeRef = useRef(0);

  const posts = getPostsBySubject(subjectKey);
  const post = posts.find((p) => p.id === postId);
  const currentIndex = posts.findIndex((p) => p.id === postId);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  usePageMeta({
    title: post ? `${post.title} - ${subjectName}` : subjectName,
    description: post?.description || `정보보안기사 ${subjectName} 이론 학습`,
  });

  const goToNextPost = useCallback(() => {
    if (nextPost) {
      navigate(`/theory/${subject}/${nextPost.id}`);
    }
  }, [navigate, subject, nextPost]);

  const scrollByScreen = useCallback((direction: "up" | "down") => {
    if (direction === "down" && isAtBottom()) {
      const now = Date.now();
      if (now - lastScrollTimeRef.current < 1000) {
        bottomScrollAttemptRef.current += 1;
      } else {
        bottomScrollAttemptRef.current = 1;
      }
      lastScrollTimeRef.current = now;

      if (bottomScrollAttemptRef.current >= 2) {
        goToNextPost();
        return;
      }
    }

    const scrollAmount = window.innerHeight * 0.8;
    window.scrollBy({
      top: direction === "down" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }, [goToNextPost]);

  // Handle wheel scroll at bottom
  useEffect(() => {
    let wheelAttempts = 0;
    let lastWheelTime = 0;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0 && isAtBottom()) {
        const now = Date.now();
        if (now - lastWheelTime < 500) {
          wheelAttempts += 1;
        } else {
          wheelAttempts = 1;
        }
        lastWheelTime = now;

        if (wheelAttempts >= 3) {
          goToNextPost();
          wheelAttempts = 0;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [goToNextPost]);

  if (!post) {
    return <Navigate to={`/theory/${subject}`} replace />;
  }

  return (
    <div className="py-8 px-4 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link to="/theory" className="hover:text-blue-600 dark:hover:text-blue-400">
            이론 학습
          </Link>
          <span className="mx-2">/</span>
          <Link to={`/theory/${subject}`} className="hover:text-blue-600 dark:hover:text-blue-400">
            {subjectName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">{post.title}</span>
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <article className="prose prose-gray dark:prose-invert max-w-none">
            <MDXProvider components={mdxComponents}>
              <post.component />
            </MDXProvider>
          </article>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {prevPost ? (
            <Link
              to={`/theory/${subject}/${prevPost.id}`}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {prevPost.title}
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link
              to={`/theory/${subject}/${nextPost.id}`}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              {nextPost.title}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Scroll Buttons */}
      <div className="fixed bottom-6 right-4 flex flex-col gap-2">
        <button
          onClick={() => scrollByScreen("up")}
          className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600"
          aria-label="위로 스크롤"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => scrollByScreen("down")}
          className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600"
          aria-label="아래로 스크롤"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
