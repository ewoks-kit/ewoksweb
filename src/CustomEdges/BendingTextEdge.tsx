import type { EdgeProps } from 'reactflow';
import { getBezierPath } from 'reactflow';
import { edgeStyle } from './EdgeStyle';

function bendingText({
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
      <text>
        <textPath
          href={`#${id}`}
          startOffset="50%"
          textAnchor="middle"
          style={edgeStyle.bendingText}
          fill={style.stroke}
        >
          {label}
        </textPath>
      </text>
    </>
  );
}

export default bendingText;
