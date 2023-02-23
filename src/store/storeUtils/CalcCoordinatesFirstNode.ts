import type { EwoksRFNode } from 'types';
import type { XYPosition } from 'reactflow';

export function calcCoordinatesFirstNode(nodes: EwoksRFNode[]) {
  const boundaries = nodes.reduce<XYPosition>(
    (result, { position }) => {
      const x = position?.x && position.x < result.x ? position.x : result.x;
      const y = position?.y && position.y < result.y ? position.y : result.y;

      return { x, y };
    },
    { x: 500, y: 500 }
  );

  return { x: boundaries.x + 20, y: boundaries.y - 50 };
}
