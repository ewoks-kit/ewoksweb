import type { EdgeProps } from '@xyflow/react';
import { BaseEdge, getBezierPath } from '@xyflow/react';

import styles from './CustomEdges.module.css';

function BendingTextEdge(props: EdgeProps) {
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
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const { id, selected, labelStyle } = otherProps;

  return (
    <>
      <BaseEdge path={path} {...otherProps} />
      <text dy="-0.25em">
        <textPath
          className={styles.bendingText}
          style={{ fill: labelStyle?.fill }}
          data-selected={selected ? '' : undefined}
          href={`#${id}`}
          startOffset="50%"
          textAnchor="middle"
        >
          {label}
        </textPath>
      </text>
    </>
  );
}

export default BendingTextEdge;
