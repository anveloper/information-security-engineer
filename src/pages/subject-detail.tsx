import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { posts as systemSecurityPosts, type Post } from "../content/theory/01-system-security";
import { posts as networkSecurityPosts } from "../content/theory/02-network-security";
import type { Subject } from "../types";
import { SUBJECTS } from "../types";

type Tab = "quiz" | "theory";

function getPostsBySubject(subject: Subject): Post[] {
  switch (subject) {
    case "system-security":
      return systemSecurityPosts;
    case "network-security":
      return networkSecurityPosts;
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{subjectName}</h1>

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

        {activeTab === "quiz" ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">문제가 준비 중입니다.</p>
          </div>
        ) : selectedPost ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <button onClick={handleBackToList} className="text-blue-600 hover:underline mb-4 inline-block">
              ← 목차로 돌아가기
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
                className="w-full text-left bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-500 transition"
              >
                <div className="flex items-start gap-3">
                  <span className="text-sm text-gray-400 font-mono">
                    {post.chapter}-{post.order}
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-900">{post.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{post.description}</p>
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

        <div className="mt-8">
          <Link to="/subjects" className="text-blue-600 hover:underline">
            ← 과목 선택으로
          </Link>
        </div>
      </div>
    </div>
  );
}
