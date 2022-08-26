import { getBezierPath, getEdgeCenter } from 'react-flow-renderer';

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
  labelBgStyle,
}) {
  console.log(
    style,
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    label,
    markerEnd,
    labelBgStyle
  );
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

  const foreignObjectSize = 120;

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
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        style={{ ...style, backgroundColor: 'blue' }}
      >
        <div
          style={{
            ...style,
            backgroundColor: 'rgb(223, 226, 247)',
            color: 'rgb(150, 165, 249)',
            borderRadius: '10px',
            borderStyle: 'solid',
            borderColor: 'rgb(150, 165, 249)',
          }}
        >
          {label}
        </div>
      </foreignObject>
    </>
  );
}

export default multilineText;
