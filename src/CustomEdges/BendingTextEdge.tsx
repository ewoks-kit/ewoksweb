import { getBezierPath, getMarkerEnd } from 'react-flow-renderer';

function bendingText({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {
    stroke: '#cc0000',
    strokeWidth: '3',
    fill: 'rgb(223, 226, 246)',
  },
  label,
  arrowHeadType,
  markerEndId,
}) {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text style={{ color: 'red' }}>
        <textPath
          href={`#${id as string}`}
          style={{ fontSize: '16px', fill: style.stroke }}
          startOffset="50%"
          textAnchor="middle" // TODO? make exact label place editable start, end
        >
          {label}
        </textPath>
      </text>
    </>
  );
}

export default bendingText;
