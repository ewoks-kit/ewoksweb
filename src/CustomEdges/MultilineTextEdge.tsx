import { getBezierPath, getEdgeCenter } from 'react-flow-renderer';
import { edgeStyle } from './EdgeStyle';

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
}) {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const titleWidth = Math.max(...label.split(',').map((mp) => mp.length)) * 7;

  const titleHeight = label.split(',').length * 30;

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={titleWidth}
        height={titleHeight}
        x={edgeCenterX - titleWidth / 2}
        y={edgeCenterY - titleWidth / 8}
        style={{ ...style, backgroundColor: 'blue' }}
      >
        <div
          style={{
            ...style,
            ...(edgeStyle.multiline as React.CSSProperties),
          }}
        >
          {label && label.split(',').map((mp) => <div key={mp}>{mp}</div>)}
        </div>
      </foreignObject>
    </>
  );
}

export default multilineText;
