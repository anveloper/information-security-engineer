import { isValidElement, type ComponentPropsWithoutRef, type ReactElement } from "react";
import Mermaid from "./mermaid";

interface CodeProps {
  className?: string;
  children?: string;
}

function Pre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  // Check if this is a mermaid code block
  if (isValidElement(children)) {
    const element = children as ReactElement<CodeProps>;
    const className = element.props?.className || "";

    if (className.includes("language-mermaid")) {
      const code = element.props?.children;
      if (typeof code === "string") {
        return <Mermaid chart={code.trim()} />;
      }
    }
  }

  return <pre {...props}>{children}</pre>;
}

export const mdxComponents = {
  pre: Pre,
};
