import { getBezierPath } from 'react-flow-renderer';

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
          // style={{ fontSize: '16px' }}
          startOffset="50%"
          textAnchor="middle"
          style={{ ...style, strokeWidth: '1', fontSize: '16px' }}
          // TODO? make exact label place editable start, end, middle
          // add side to text not supported yet
          // side:"right"
        >
          {label}
        </textPath>
      </text>
    </>
  );
}

export default bendingText;
