import Tooltip from '@mui/material/Tooltip';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';

import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import NodeIcon from './NodeIcon';
import NodeLabel from './NodeLabel';
import { contentStyle, style } from './nodeStyles';

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
  width = 100,
}: Props) {
  return (
    <div className="node-content" style={{ borderColor }}>
      <Tooltip
        title={comment ? <span style={style.comment}>{comment}</span> : ''}
        enterDelay={800}
        arrow
      >
        <span style={{ ...style.displayNode, width }} className="icons">
          <Handle
            type="source"
            position={Position.Right}
            id="sr"
            style={{ ...contentStyle.handle, ...contentStyle.handleSource }}
            isConnectable
          />

          {moreHandles && (
            <div id="choice">
              {/* TODO: break the handles */}
              <Handle
                type="source"
                position={Position.Top}
                id="st"
                style={{
                  right: 10,
                  left: 'auto',
                  ...contentStyle.handleSource,
                  ...contentStyle.handleUpDown,
                }}
                isConnectable
              />
              <Handle
                type="source"
                position={Position.Bottom}
                id="sb"
                style={{
                  right: 10,
                  left: 'auto',
                  ...contentStyle.handleSource,
                  ...contentStyle.handleUpDown,
                }}
                isConnectable
              />
            </div>
          )}
          <NodeLabel
            id={id}
            label={label}
            showFull={withLabel}
            showCropped={!withLabel && !withImage}
            color="#ced3ee"
          />
          {withImage && (
            <SuspenseBoundary>
              <NodeIcon nodeId={id} />
            </SuspenseBoundary>
          )}

          <Handle
            type="target"
            position={Position.Left}
            id="tl"
            style={{
              ...contentStyle.handle,
              ...contentStyle.handleTarget,
            }}
            isConnectable
          />

          {moreHandles && (
            <>
              <Handle
                type="target"
                position={Position.Bottom}
                id="tb"
                style={{
                  left: 20,
                  ...contentStyle.handleTarget,
                  ...contentStyle.handleUpDown,
                }}
                isConnectable
              />
              <Handle
                type="target"
                position={Position.Top}
                id="tt"
                style={{
                  left: 20,
                  ...contentStyle.handleTarget,
                  ...contentStyle.handleUpDown,
                }}
                isConnectable
              />
            </>
          )}
        </span>
      </Tooltip>
    </div>
  );
}

export default memo(Node);
