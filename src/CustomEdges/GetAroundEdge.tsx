import type { EdgeProps } from 'react-flow-renderer';
import { getEdgeCenter } from 'react-flow-renderer';
import { edgeStyle } from './EdgeStyle';
import type { SmoothStepData, SmoothStepParams } from './models';

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
}: SmoothStepParams) {
  const [, _centerY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const cornerSize = 0;
  const cY = _centerY;

  const { getAroundProps } = data;

  let firstCornerPath = '';
  let secondCornerPath = '';
  if (sourceX <= targetX) {
    return `M ${sourceX},${sourceY}L ${targetX},${targetY}`;
  } else if (sourceX > targetX) {
    firstCornerPath =
      sourceY < targetY
        ? bottomRightCorner(
            sourceX + getAroundProps.x,
            cY + getAroundProps.y,
            cornerSize
          )
        : topRightCorner(sourceX + getAroundProps.x, cY + 120, cornerSize);
    secondCornerPath =
      sourceY < targetY
        ? leftTopCorner(
            targetX - getAroundProps.x,
            cY + getAroundProps.y,
            cornerSize
          )
        : leftBottomCorner(
            targetX - getAroundProps.x,
            cY + getAroundProps.y,
            cornerSize
          );
  }

  if (sourceY >= targetY) {
    const cornerX = Math.min(sourceX, targetX);
    const firstStop = bottomRightCorner(
      sourceX + getAroundProps.x,
      sourceY + getAroundProps.y,
      cornerSize
    );
    const secondStop = leftBottomCorner(
      cornerX - getAroundProps.x,
      sourceY + getAroundProps.y,
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
}: EdgeProps<SmoothStepData>) {
  const edgePath = getSmoothStepPathC({
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        fill="none"
        strokeWidth="1px"
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{ ...style, ...edgeStyle.bendingText }}
          startOffset="50%"
          // @ts-expect-error
          side={sourceX > targetX ? 'right' : 'left'}
          textAnchor="middle"
        >
          {typeof label === 'string' &&
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
