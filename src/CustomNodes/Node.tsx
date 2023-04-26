import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { contentStyle, style } from './nodeStyles';
import Tooltip from '@material-ui/core/Tooltip';
import isValidLink from '../utils/IsValidLink';
// import SaveIcon from '@material-ui/icons/Save';

import useStore from '../store/useStore';
import type { Connection } from 'reactflow';
import NodeIcon from './NodeIcon';
import IconBoundary from '../IconBoundary';
import type { NodeProps, EwoksRFLink, GraphRF } from '../types';
import { useReactFlow } from 'reactflow';
import { getNodesData } from '../utils';
import NodeLabel from './NodeLabel';

// TODO: examine usage when execution in main
const execution = () => {
  return true;
};

// The basic Node component
function Node({
  moreHandles,
  withImage,
  withLabel,
  isGraph,
  type,
  label,
  color,
  colorBorder: borderColor,
  content,
  image,
  comment,
  executing,
  nodeWidth,
}: NodeProps) {
  const { getNodes, getEdges } = useReactFlow();

  const inExecutionMode = useStore((state) => state.inExecutionMode);
  const graphInfo = useStore((state) => state.graphInfo);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const displayNode = {
    textAlign: 'center' as const,
    width: `${nodeWidth || 100}px`,
    minWidth: '60px', // for standard width
    maxWidth: '300px',
    display: ['graphInput', 'graphOutput'].includes(type) ? 'flex' : 'inline',
    margin: '2px',
    padding: '2px',
  };

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
        <span style={displayNode} className="icons">
          {!isGraph && type !== 'graphOutput' && (
            <Handle
              type="source"
              position={Position.Right}
              id="sr"
              style={{ ...contentStyle.handle, ...contentStyle.handleSource }}
              isValidConnection={isValidConnection}
              isConnectable
            />
          )}
          {!isGraph &&
            type !== 'graphOutput' &&
            type !== 'graphInput' &&
            moreHandles && (
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
          {(withImage || inExecutionMode) && (
            <IconBoundary>
              <NodeIcon
                image={image}
                hasSpinner={
                  inExecutionMode &&
                  type !== 'graphOutput' &&
                  type !== 'graphInput'
                }
                spinnerProps={{
                  getting: executing,
                  tooltip: 'Execution',
                  action: execution,
                }}
                onDragStart={(e) => e.preventDefault()}
              />
            </IconBoundary>
          )}
          {!isGraph && type !== 'graphInput' && (
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
          )}
          {!isGraph &&
            type !== 'graphOutput' &&
            type !== 'graphInput' &&
            moreHandles && (
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
          {isGraph && <span style={style.contentWrapper}>{content}</span>}
        </span>
      </Tooltip>
    </div>
  );
}

export default memo(Node);
