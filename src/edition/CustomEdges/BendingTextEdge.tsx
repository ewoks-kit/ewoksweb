import type { EdgeProps } from '@xyflow/react';
import { getBezierPath } from '@xyflow/react';

import styles from './CustomEdges.module.css';
import InteractionHelper from './InteractionHelper';

function BendingTextEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label = '',
  markerEnd,
  style,
  interactionWidth,
}: EdgeProps) {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={path}
        markerEnd={markerEnd}
      />
      <text>
        <textPath
          className={styles.bendingText}
          href={`#${id}`}
          startOffset="50%"
          textAnchor="middle"
          fill={style?.stroke}
        >
          {label}
        </textPath>
      </text>
      <InteractionHelper path={path} interactionWidth={interactionWidth} />
    </>
  );
}

export default BendingTextEdge;
