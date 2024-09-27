import { memo } from 'react';
import { Position } from 'reactflow';

import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import InputHandle from './InputHandle';
import NodeContent from './NodeContent';
import NodeIcon from './NodeIcon';
import NodeLabel from './NodeLabel';
import OutputHandle from './OutputHandle';

interface Props {
  id: string;
  label?: string;
  width?: number;
  withImage?: boolean;
  withLabel?: boolean;
  borderColor?: string;
  comment?: string;
  moreHandles?: boolean;
}

// The basic Node component
function Node({
  id,
  moreHandles,
  withImage = true,
  withLabel = true,
  label,
  borderColor,
  comment,
  width,
}: Props) {
  return (
    <NodeContent width={width} tooltip={comment} borderColor={borderColor}>
      <InputHandle />
      <OutputHandle />

      {moreHandles && (
        <>
          <InputHandle position={Position.Top} id="tt" />
          <OutputHandle position={Position.Top} id="st" />
          <InputHandle position={Position.Bottom} id="tb" />
          <OutputHandle position={Position.Bottom} id="sb" />
        </>
      )}

      <NodeLabel
        id={id}
        label={label}
        showFull={withLabel}
        showCropped={!withLabel && !withImage}
      />
      {withImage && (
        <SuspenseBoundary>
          <NodeIcon nodeId={id} />
        </SuspenseBoundary>
      )}
    </NodeContent>
  );
}

export default memo(Node);
