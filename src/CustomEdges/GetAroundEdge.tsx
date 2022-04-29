import React from 'react';
import { getMarkerEnd, getEdgeCenter } from 'react-flow-renderer';

const bottomLeftCorner = (x: number, y: number, size: number) => {
  console.log(x, y, size);
  return `L ${x},${y - size}Q ${x},${y} ${x + size},${y}`;
};
const leftBottomCorner = (x: number, y: number, size: number) => {
  console.log(x, y, size);
  return `L ${x + size},${y}Q ${x},${y} ${x},${y - size}`;
};
const bottomRightCorner = (x: number, y: number, size: number) =>
  `L ${x},${y - size}Q ${x},${y} ${x - size},${y}`;
const rightBottomCorner = (x: number, y: number, size: number) => {
  console.log(x, y, size);
  return `L ${x - size},${y}Q ${x},${y} ${x},${y - size}`;
};
const leftTopCorner = (x: number, y: number, size: number) =>
  `L ${x + size},${y}Q ${x},${y} ${x},${y + size}`;
const topLeftCorner = (x: number, y: number, size: number) =>
  `L ${x},${y + size}Q ${x},${y} ${x + size},${y}`;
const topRightCorner = (x: number, y: number, size: number) =>
  `L ${x},${y + size}Q ${x},${y} ${x - size},${y}`;
const rightTopCorner = (x: number, y: number, size: number) =>
  `L ${x - size},${y}Q ${x},${y} ${x},${y + size}`;

function getSmoothStepPath({
  sourceX = 0,
  sourceY = 0,
  targetX = 0,
  targetY = 0,
  borderRadius = 4,
  centerY = 100,
}) {
  const [, _centerY, offsetX, offsetY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const cornerWidth = Math.min(borderRadius, Math.abs(targetX - sourceX));
  const cornerHeight = Math.min(borderRadius, Math.abs(targetY - sourceY));
  const cornerSize = Math.min(cornerWidth, cornerHeight, offsetX, offsetY);
  const cY = typeof centerY !== 'undefined' ? centerY : _centerY;

  console.log(
    'source',
    sourceX,
    sourceY,
    'target',
    targetX,
    targetY,
    'center',
    _centerY,
    offsetX,
    offsetY,
    'cornerWidth',
    Math.min(borderRadius, Math.abs(targetX - sourceX)),
    'cornerHeight',
    Math.min(borderRadius, Math.abs(targetY - sourceY)),
    'cornerSize',
    Math.min(cornerWidth, cornerHeight, offsetX, offsetY)
  );

  let firstCornerPath = '';
  let secondCornerPath = '';

  if (sourceX <= targetX) {
    console.log('sourceX <= targetX', targetX);
    firstCornerPath =
      sourceY <= targetY
        ? bottomLeftCorner(sourceX, cY, cornerSize)
        : topLeftCorner(sourceX, cY, cornerSize);
    secondCornerPath =
      sourceY <= targetY
        ? rightTopCorner(targetX + 10, cY + 120, cornerSize)
        : rightBottomCorner(targetX + 120, cY, cornerSize);
  } else {
    console.log('sourceX > targetX');
    firstCornerPath =
      sourceY < targetY
        ? bottomRightCorner(sourceX + 10, cY + 120, cornerSize)
        : topRightCorner(sourceX, cY + 120, cornerSize);
    secondCornerPath =
      sourceY < targetY
        ? leftTopCorner(targetX - 10, cY + 120, cornerSize)
        : leftBottomCorner(targetX, cY + 50, cornerSize);
  }

  if (sourceY > targetY) {
    console.log('sourceY > targetY');
    const cornerX = Math.min(sourceX - 10, targetX - 10);
    const firstStop = bottomRightCorner(sourceX + 10, sourceY + 90, cornerSize);
    const secondStop = leftBottomCorner(cornerX - 10, sourceY + 90, cornerSize);
    // const thirdStop = topLeftCorner(cornerX, targetY - 5, cornerSize);
    // const fourthStop = rightTopCorner(targetX, targetY - 5, cornerSize);

    return `M ${sourceX},${sourceY}${firstStop}${secondStop}L ${targetX},${targetY}`;
    // return `M ${sourceX},${sourceY}${firstStop}${secondStop}${thirdStop}${fourthStop}L ${targetX},${targetY}`;
  }

  return `M ${sourceX},${sourceY}${firstCornerPath}${secondCornerPath}L ${targetX},${targetY}`;
}

export default function getAround({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  arrowHeadType,
  markerEndId,
}) {
  console.log(
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style,
    arrowHeadType,
    markerEndId
  );
  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    // sourcePosition,
    targetX,
    targetY,
    // targetPosition,
  });

  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  console.log(markerEnd);
  return (
    <path
      id={id}
      style={style}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd="arrow" // {markerEnd}
      fill="none"
      strokeWidth={1}
    />
  );
}
