import { getBezierPath } from 'react-flow-renderer';
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
}) {
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
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text>
        <textPath
          href={`#${id as string}`}
          startOffset="50%"
          textAnchor="middle"
          style={{ ...style, ...edgeStyle.bendingText }}
        >
          {label}
        </textPath>
      </text>
    </>
  );
}

export default bendingText;
