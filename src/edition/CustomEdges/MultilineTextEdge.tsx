import type { EdgeProps } from '@xyflow/react';
import { getBezierPath } from '@xyflow/react';
import type { ReactNode } from 'react';

import InteractionHelper from './InteractionHelper';

function getForeignObjectProps(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  label: ReactNode,
): React.SVGProps<SVGForeignObjectElement> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  if (typeof label !== 'string') {
    return {
      x: labelX,
      y: labelY,
    };
  }

  const width = Math.max(...label.split(',').map((mp) => mp.length)) * 8;
  const height = label.split(',').length * 40;

  return {
    x: labelX - width / 2,
    y: labelY - height / 2,
    width,
    height,
  };
}

function multilineText({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label = '',
  markerEnd,
  style = {},
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
      <foreignObject
        {...getForeignObjectProps(sourceX, sourceY, targetX, targetY, label)}
      >
        <div
          className="multiLineDiv"
          style={{
            borderColor: style.stroke,
            color: style.stroke,
          }}
        >
          {typeof label === 'string' &&
            label.split(',').map((mp) => <div key={mp}>{mp}</div>)}
        </div>
      </foreignObject>
      <InteractionHelper path={path} interactionWidth={interactionWidth} />
    </>
  );
}

export default multilineText;
