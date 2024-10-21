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
  const { id, selected, style } = otherProps;

  return (
    <>
      <BaseEdge path={path} {...otherProps} />
      <text>
        <textPath
          className={styles.bendingText}
          data-selected={selected ? '' : undefined}
          href={`#${id}`}
          startOffset="50%"
          textAnchor="middle"
          fill={style?.stroke}
        >
          {label}
        </textPath>
      </text>
    </>
  );
}

export default BendingTextEdge;
