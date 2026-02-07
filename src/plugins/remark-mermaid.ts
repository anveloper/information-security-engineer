import { visit } from 'unist-util-visit';
import type { Root, Code, Parent } from 'mdast';

export default function remarkMermaid() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code, index: number | undefined, parent: Parent | undefined) => {
      if (node.lang === 'mermaid' && parent && typeof index === 'number') {
        // Replace with MDX JSX element
        const mermaidNode = {
          type: 'mdxJsxFlowElement' as const,
          name: 'Mermaid',
          attributes: [
            {
              type: 'mdxJsxAttribute' as const,
              name: 'chart',
              value: node.value,
            },
          ],
          children: [],
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (parent.children as any[])[index] = mermaidNode;
      }
    });
  };
}
