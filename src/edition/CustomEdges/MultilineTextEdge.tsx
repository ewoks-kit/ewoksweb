import type { EdgeProps } from '@xyflow/react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

import styles from './CustomEdges.module.css';
import InteractionHelper from './InteractionHelper';

function MultilineTextEdge({
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
  const [path, labelX, labelY] = getBezierPath({
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
      <EdgeLabelRenderer>
        <div
          className={styles.multiLineLabel}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px) `,
          }}
        >
          {typeof label === 'string' &&
            // eslint-disable-next-line react/no-array-index-key
            label.split(',').map((mp, i) => <div key={i}>{mp}</div>)}
        </div>
      </EdgeLabelRenderer>
      <InteractionHelper path={path} interactionWidth={interactionWidth} />
    </>
  );
}

function MultilineTextEdge2(edgeProps: EdgeProps) {
  const [path, labelX, labelY] = getBezierPath(edgeProps);
  const { label } = edgeProps;

  return (
    <BaseEdge
      path={path}
      labelX={labelX}
      labelY={labelY}
      label={<text>LLLL</text>}
      // <>
      //   {typeof label === 'string' &&
      //     // eslint-disable-next-line react/no-array-index-key
      //     label.split(',').map((mp, i) => <text key={i}>{mp}</text>)}
      // </>
      // }
    />
  );
}

export default MultilineTextEdge2;
