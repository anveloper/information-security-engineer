import { usePwaInstall } from "@/hooks";

export default function PwaInstallBanner() {
  const { platform, showBanner, install, dismiss } = usePwaInstall();

  if (!showBanner) return null;

  return (
    <div className="sticky bottom-0 z-40 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 64 64" fill="none">
              <path d="M32 4L8 14v18c0 14 10 24 24 28 14-4 24-14 24-28V14L32 4z" fill="currentColor"/>
            </svg>
          </div>

          {platform === "ios" ? (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              홈 화면에 추가하려면{" "}
              <span className="inline-flex items-center align-middle">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-3 3m3-3l3 3" />
                </svg>
              </span>{" "}
              공유 버튼을 눌러 <strong>홈 화면에 추가</strong>를 선택하세요.
            </p>
          ) : (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              앱을 설치하면 더 빠르게 이용할 수 있어요.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {platform === "android" && (
            <button
              onClick={install}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              설치
            </button>
          )}

          <button
            onClick={dismiss}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="닫기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
