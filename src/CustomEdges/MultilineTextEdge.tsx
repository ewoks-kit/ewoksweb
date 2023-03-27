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
  const height = label.split(',').length * 30;

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
