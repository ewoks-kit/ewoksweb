import ELK from 'elkjs';

import type { RFEdge, RFNode } from '../types';

export default async function layoutNewGraph(
  nodes: RFNode[],
  links: RFEdge[],
): Promise<RFNode[]> {
  const elk = new ELK();

  const layoutOptions = {
    'elk.algorithm': 'layered',
  };

  const elkGraph = {
    id: 'root',
    layoutOptions,
    children: nodes.map((node) => {
      return {
        ...node,
        width: 200,
        height: 180,
      };
    }),
    edges: links.map((link) => {
      return {
        ...link,
        sources: [link.source],
        targets: [link.target],
      };
    }),
  };

  const result = await elk.layout(elkGraph);

  return nodes.map((node) => {
    const elkNode = result.children?.find((elknode) => elknode.id === node.id);

    return {
      ...node,
      position: { x: elkNode?.x || 100, y: elkNode?.y || 100 },
    };
  });
}
