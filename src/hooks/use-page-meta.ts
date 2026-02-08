import { useEffect } from "react";

const BASE_TITLE = "정보보안기사";

interface PageMeta {
  title?: string;
  description?: string;
}

export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;

    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", description);
      }
    }

    return () => {
      document.title = BASE_TITLE;
    };
  }, [title, description]);
}
