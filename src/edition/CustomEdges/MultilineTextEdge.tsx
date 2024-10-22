import type { EdgeProps } from '@xyflow/react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

import styles from './CustomEdges.module.css';

function MultilineTextEdge(props: EdgeProps) {
  const {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    label,
    ...otherProps
  } = props;
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { selected, style } = otherProps;

  return (
    <>
      <BaseEdge path={path} {...otherProps} />
      <EdgeLabelRenderer>
        <div
          className={styles.multiLineLabel}
          data-selected={selected ? '' : undefined}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px) `,
            color: style?.stroke,
            borderColor: style?.stroke,
          }}
        >
          {typeof label === 'string' &&
            // eslint-disable-next-line react/no-array-index-key
            label.split(',').map((mp, i) => <div key={i}>{mp}</div>)}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default MultilineTextEdge;
