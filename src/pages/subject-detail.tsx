import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { posts as systemSecurityPosts, type Post } from "../content/theory/01-system-security";
import { posts as networkSecurityPosts } from "../content/theory/02-network-security";
import { posts as applicationSecurityPosts } from "../content/theory/03-application-security";
import type { Subject } from "../types";
import { SUBJECTS } from "../types";

type Tab = "quiz" | "theory";

function getPostsBySubject(subject: Subject): Post[] {
  switch (subject) {
    case "system-security":
      return systemSecurityPosts;
    case "network-security":
      return networkSecurityPosts;
    case "application-security":
      return applicationSecurityPosts;
    default:
      return [];
  }
}

export default function SubjectDetail() {
  const { subject } = useParams<{ subject: Subject }>();
  const subjectKey = subject as Subject;
  const subjectName = subject ? SUBJECTS[subjectKey] : "알 수 없음";
  const [activeTab, setActiveTab] = useState<Tab>("quiz");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const posts = getPostsBySubject(subjectKey);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/subjects" className="hover:text-blue-600">
            과목 선택
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{subjectName}</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">{subjectName}</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab("quiz");
              setSelectedPost(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "quiz"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-500"
            }`}
          >
            문제 풀이
          </button>
          <button
            onClick={() => {
              setActiveTab("theory");
              setSelectedPost(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "theory"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-500"
            }`}
          >
            이론 학습
          </button>
        </div>

        {/* Content */}
        {activeTab === "quiz" ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">문제가 준비 중입니다.</p>
          </div>
        ) : selectedPost ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <button
              onClick={handleBackToList}
              className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              목차로 돌아가기
            </button>
            <article className="prose prose-gray max-w-none">
              <selectedPost.component />
            </article>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="w-full text-left bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-500 hover:shadow-sm transition"
              >
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">
                    {post.chapter}-{post.order}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 truncate">{post.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">이론 내용이 준비 중입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
