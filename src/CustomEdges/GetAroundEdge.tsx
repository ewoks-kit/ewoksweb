import { red } from '@material-ui/core/colors';
import React from 'react';
import { getMarkerEnd, getEdgeCenter } from 'react-flow-renderer';

const bottomLeftCorner = (x, y, size) =>
  `L ${x},${y - size}Q ${x},${y} ${x + size},${y}`;
const leftBottomCorner = (x, y, size) =>
  `L ${x + size},${y}Q ${x},${y} ${x},${y - size}`;
const bottomRightCorner = (x, y, size) =>
  `L ${x},${y - size}Q ${x},${y} ${x - size},${y}`;
const rightBottomCorner = (x, y, size) =>
  `L ${x - size},${y}Q ${x},${y} ${x},${y - size}`;
const leftTopCorner = (x, y, size) =>
  `L ${x + size},${y}Q ${x},${y} ${x},${y + size}`;
const topLeftCorner = (x, y, size) =>
  `L ${x},${y + size}Q ${x},${y} ${x + size},${y}`;
const topRightCorner = (x, y, size) =>
  `L ${x},${y + size}Q ${x},${y} ${x - size},${y}`;
const rightTopCorner = (x, y, size) =>
  `L ${x - size},${y}Q ${x},${y} ${x},${y + size}`;

function getSmoothStepPath({
  sourceX,
  sourceY,
  targetX,
  targetY,
  borderRadius = 30,
  centerY = 50,
}) {
  const [, _centerY, offsetX, offsetY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  console.log(_centerY, offsetX, offsetY);
  const cornerWidth = Math.min(borderRadius, Math.abs(targetX - sourceX));
  const cornerHeight = Math.min(borderRadius, Math.abs(targetY - sourceY));
  const cornerSize = Math.min(cornerWidth, cornerHeight, offsetX, offsetY);
  const cY = typeof centerY !== 'undefined' ? centerY : _centerY;

  let firstCornerPath = null;
  let secondCornerPath = null;

  if (sourceX <= targetX) {
    firstCornerPath =
      sourceY <= targetY
        ? bottomLeftCorner(sourceX, cY, cornerSize)
        : topLeftCorner(sourceX, cY, cornerSize);
    secondCornerPath =
      sourceY <= targetY
        ? rightTopCorner(targetX, cY, cornerSize)
        : rightBottomCorner(targetX, cY, cornerSize);
  } else {
    firstCornerPath =
      sourceY < targetY
        ? bottomRightCorner(sourceX, cY, cornerSize)
        : topRightCorner(sourceX, cY, cornerSize);
    secondCornerPath =
      sourceY < targetY
        ? leftTopCorner(targetX, cY, cornerSize)
        : leftBottomCorner(targetX, cY, cornerSize);
  }

  if (sourceY > targetY) {
    const cornerX = Math.min(sourceX - 100, targetX - 100);
    const firstStop = bottomRightCorner(sourceX, sourceY + 15, cornerSize);
    const secondStop = leftBottomCorner(cornerX, sourceY + 15, cornerSize);
    const thirdStop = topLeftCorner(cornerX, targetY - 15, cornerSize);
    const fourthStop = rightTopCorner(targetX, targetY - 15, cornerSize);

    return `M ${sourceX},${sourceY}${firstStop}${secondStop}${thirdStop}${fourthStop}L ${targetX},${targetY}`;
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
  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    // sourcePosition,
    targetX,
    targetY,
    // targetPosition,
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
        fill="none"
        strokeWidth={1}
      />
    </>
  );
}
