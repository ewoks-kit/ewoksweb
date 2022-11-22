/* eslint-disable @typescript-eslint/restrict-plus-operands */
// TODO: UNDER DEVELOPMENT AND TESTING BY THE USERS
import { getEdgeCenter } from 'react-flow-renderer';
import { edgeStyle } from './EdgeStyle';

const leftBottomCorner = (x: number, y: number, size: number) => {
  return `L ${x + size},${y}Q ${x},${y} ${x},${y - size}`;
};
const bottomRightCorner = (x: number, y: number, size: number) =>
  `L ${x},${y - size}Q ${x},${y} ${x - size},${y}`;

const leftTopCorner = (x: number, y: number, size: number) =>
  `L ${x + size},${y}Q ${x},${y} ${x},${y + size}`;

const topRightCorner = (x: number, y: number, size: number) =>
  `L ${x},${y + size}Q ${x},${y} ${x - size},${y}`;

function getSmoothStepPathC({
  sourceX = 0,
  sourceY = 0,
  targetX = 0,
  targetY = 0,
  data,
}) {
  const [, _centerY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const cornerSize = 0;
  const cY = _centerY;

  let firstCornerPath = '';
  let secondCornerPath = '';
  if (sourceX <= targetX) {
    return `M ${sourceX},${sourceY}L ${targetX},${targetY}`;
  } else if (sourceX > targetX) {
    firstCornerPath =
      sourceY < targetY
        ? bottomRightCorner(
            sourceX + data.getAroundProps.x,
            cY + data.getAroundProps.y,
            cornerSize
          )
        : topRightCorner(sourceX + data.getAroundProps.x, cY + 120, cornerSize);
    secondCornerPath =
      sourceY < targetY
        ? leftTopCorner(
            targetX - data.getAroundProps.x,
            cY + data.getAroundProps.y,
            cornerSize
          )
        : leftBottomCorner(
            targetX - data.getAroundProps.x,
            cY + data.getAroundProps.y,
            cornerSize
          );
  }

  if (sourceY >= targetY) {
    const cornerX = Math.min(sourceX, targetX);
    const firstStop = bottomRightCorner(
      sourceX + data.getAroundProps.x,
      sourceY + data.getAroundProps.y,
      cornerSize
    );
    const secondStop = leftBottomCorner(
      cornerX - data.getAroundProps.x,
      sourceY + data.getAroundProps.y,
      cornerSize
    );

    return `M ${sourceX},${sourceY}${firstStop}${secondStop}L ${targetX},${targetY}`;
  }

  return `M ${sourceX},${sourceY}${firstCornerPath}${secondCornerPath}L ${targetX},${targetY}`;
}

export default function getAround({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  label,
  markerEnd,
  data,
}) {
  const edgePath = getSmoothStepPathC({
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
  });

  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const titleWidth = Math.max(...label.split(',').map((mp) => mp.length)) * 7;
  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        fill="none"
        strokeWidth={1}
      />
      <text>
        <textPath
          href={`#${id as string}`}
          style={{ ...style, strokeWidth: '1', fontSize: '16px' }}
          startOffset="50%"
          side={sourceX > targetX ? 'right' : 'left'}
          textAnchor="middle"
        >
          {label &&
            label.split(',').map((mp, index) => (
              <tspan
                dx={index === 0 ? 0 : -mp.length * 7}
                dy={index === 0 ? 0 : 20}
                key={mp}
              >
                {mp}
              </tspan>
            ))}
        </textPath>
      </text>
    </>
  );
}
