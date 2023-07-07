import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { contentStyle, style } from './nodeStyles';
import Tooltip from '@material-ui/core/Tooltip';
import isValidLink from '../utils/IsValidLink';

import useStore from '../store/useStore';
import type { Connection } from 'reactflow';
import NodeIcon from './NodeIcon';
import SuspenseBoundary from '../Suspense/SuspenseBoundary';
import type { NodeProps, EwoksRFLink, GraphRF } from '../types';
import { useReactFlow } from 'reactflow';
import { getNodesData } from '../utils';
import NodeLabel from './NodeLabel';

// The basic Node component
function Node({
  moreHandles,
  withImage,
  withLabel,
  label,
  color,
  colorBorder: borderColor,
  image,
  node_icon,
  comment,
  nodeWidth,
}: NodeProps) {
  const { getNodes, getEdges } = useReactFlow();

  const graphInfo = useStore((state) => state.graphInfo);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const nodWidth = { width: `${nodeWidth || 100}px` };

  const isValidConnection = (connection: Connection) => {
    const graphRf: GraphRF = {
      graph: graphInfo,
      nodes: getNodes(),
      links: getEdges() as EwoksRFLink[],
    };
    const { isValid, reason } = isValidLink(
      connection,
      graphRf,
      getNodesData()
    );
    if (!isValid) {
      setOpenSnackbar({
        open: true,
        text: reason,
        severity: 'warning',
      });
    }
    return isValid;
  };

  return (
    <div
      className="node-content"
      style={borderColor ? { borderColor } : undefined}
      id="choice"
      role="button"
      tabIndex={0}
    >
      <Tooltip
        title={comment ? <span style={style.comment}>{comment}</span> : ''}
        enterDelay={800}
        arrow
      >
        <span style={{ ...style.displayNode, ...nodWidth }} className="icons">
          <Handle
            type="source"
            position={Position.Right}
            id="sr"
            style={{ ...contentStyle.handle, ...contentStyle.handleSource }}
            isValidConnection={isValidConnection}
            isConnectable
          />

          {moreHandles && (
            <div id="choice" role="button" tabIndex={0}>
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
                isValidConnection={isValidConnection}
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
                isValidConnection={isValidConnection}
              />
            </div>
          )}
          <NodeLabel
            label={label}
            showFull={withLabel}
            showCropped={!withLabel && !withImage}
            color={color}
          />
          {withImage && (
            <SuspenseBoundary>
              <NodeIcon
                image={node_icon ?? image}
                onDragStart={(e) => e.preventDefault()}
              />
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
            isValidConnection={isValidConnection}
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
                isValidConnection={isValidConnection}
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
                isValidConnection={isValidConnection}
              />
            </>
          )}
        </span>
      </Tooltip>
    </div>
  );
}

export default memo(Node);
