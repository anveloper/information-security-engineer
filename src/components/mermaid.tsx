import { useEffect, useRef, useState, useId } from "react";
import mermaid from "mermaid";

let initialized = false;

function initMermaid(isDark: boolean) {
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? "dark" : "neutral",
  });
  initialized = true;
}

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, "-");
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderChart = async () => {
      try {
        // Re-initialize when theme changes
        if (!initialized || isDark !== (mermaid.mermaidAPI.getConfig().theme === "dark")) {
          initMermaid(isDark);
        }

        const { svg } = await mermaid.render(`mermaid${uniqueId}`, chart);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error("Mermaid rendering error:", error);
      }
    };

    renderChart();
  }, [chart, isDark, uniqueId]);

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto"
    />
  );
}
