import { Link } from "react-router-dom";
import { SUBJECTS } from "@/types";
import type { Subject } from "@/types";
import { usePageMeta } from "@/hooks";

export default function Theory() {
  usePageMeta({
    title: "이론 학습",
    description: "정보보안기사 이론 학습 - 시스템 보안, 네트워크 보안, 어플리케이션 보안, 정보보안 일반, 정보보안 관리 및 법규",
  });
  const subjectList = Object.entries(SUBJECTS) as [Subject, string][];

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">이론 학습</h1>

        <ul className="flex flex-col gap-3">
          {subjectList.map(([key, name], index) => (
            <li key={key}>
              <Link
                to={`/theory/${key}`}
                className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-sm transition"
              >
                <span className="text-sm text-gray-400 dark:text-gray-500">과목 {index + 1}</span>
                <p className="font-medium text-gray-900 dark:text-white">{name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
