import { Link } from "react-router-dom";
import { SUBJECTS } from "@/types";
import type { Subject } from "@/types";

export default function Theory() {
  const subjectList = Object.entries(SUBJECTS) as [Subject, string][];

  return (
    <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">이론 학습</h1>

        <ul className="flex flex-col gap-3">
          {subjectList.map(([key, name], index) => (
            <li key={key}>
              <Link
                to={`/theory/${key}`}
                className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition"
              >
                <span className="text-sm text-gray-400">과목 {index + 1}</span>
                <p className="font-medium text-gray-900">{name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
