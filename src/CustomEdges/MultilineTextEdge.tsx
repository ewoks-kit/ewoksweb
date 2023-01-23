import type { ReactNode } from 'react';
import type { EdgeProps } from 'reactflow';
import { getBezierPath } from 'reactflow';
import { edgeStyle } from './EdgeStyle';

function getForeignObjectProps(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  label: ReactNode
): React.SVGProps<SVGForeignObjectElement> {
  const [x, y] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  if (typeof label !== 'string') {
    return {
      x,
      y,
    };
  }

  const width = Math.max(...label.split(',').map((mp) => mp.length)) * 8;
  const height = label.split(',').length * 30;

  return {
    x: Number.parseInt(x) - width / 2,
    y: y - height / 2,
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
}: EdgeProps) {
  const edgePath = getBezierPath({
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
        // @ts-expect-error
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        style={style}
        {...getForeignObjectProps(sourceX, sourceY, targetX, targetY, label)}
      >
        <div
          style={{
            ...style,
            ...edgeStyle.multiline,
          }}
        >
          {typeof label === 'string' &&
            label.split(',').map((mp) => <div key={mp}>{mp}</div>)}
        </div>
      </foreignObject>
    </>
  );
}

export default multilineText;
