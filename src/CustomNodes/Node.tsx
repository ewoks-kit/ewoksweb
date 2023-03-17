import React, { memo, useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Handle, Position } from 'reactflow';
import { contentStyle, style } from './NodeStyle';
import Tooltip from '@material-ui/core/Tooltip';
import isValidLink from '../utils/IsValidLink';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import EditIcon from '@material-ui/icons/EditOutlined';
import SaveIcon from '@material-ui/icons/Save';
import { calcNewId } from '../utils/calcNewId';

import useStore from '../store/useStore';
import { IconButton, TextField } from '@material-ui/core';
import tooltipText from '../Components/General/TooltipText';
import type { Connection } from 'reactflow';
import { isNode } from '../utils/typeGuards';
import NodeIcon from './NodeIcon';
import IconBoundary from '../IconBoundary';
import { useNodesIds, useSelectedElement } from '../store/graph-hooks';
import type { NodeProps, EwoksRFLink, EwoksRFNode, GraphRF } from '../types';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../store/useNodeDataStore';

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
  selected,
  color,
  colorBorder,
  content,
  image,
  comment,
  executing,
  nodeWidth,
  details,
}: NodeProps) {
  const { getNodes, getEdges, setNodes } = useReactFlow();
  const nodesIds = useNodesIds();

  const border = colorBorder
    ? `4px solid ${colorBorder}`
    : '2px solid rgb(233, 235, 247)';

  const customTitle = {
    ...style.title,
    wordWrap: 'break-word',
    borderRadius: '0px',
    margin: '2px',
    padding: '2px',
  };

  if (color) {
    customTitle.backgroundColor = color;
    customTitle.borderRadius = '10px 10px 3px 3px';
  }

  const [nodeSize, setNodeSize] = useState(nodeWidth);
  const inExecutionMode = useStore((state) => state.inExecutionMode);
  const graphInfo = useStore((state) => state.graphInfo);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const selectedElement = useSelectedElement();
  const [edit, setEdit] = useState(false);
  const [labelLocal, setLabelLocal] = useState(label);
  const [detailsL, setDetailsL] = useState(false);

  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  useEffect(() => {
    setNodeSize(nodeWidth);
    setLabelLocal(label);
    setDetailsL(details || false);
  }, [nodeWidth, label, details, detailsL]);

  const displayNode = {
    textAlign: 'center' as const,
    width: `${nodeSize || 100}px`,
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
    const { isValid, reason } = isValidLink(connection, graphRf);
    if (!isValid) {
      setOpenSnackbar({
        open: true,
        text: reason,
        severity: 'warning',
      });
    }
    return isValid;
  };

  const labelChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setLabelLocal(event.target.value);
  };

  // TODO: exists in sidebar abstract in a hook?
  // Could extract the cloning and graph generation part in a function
  // that would return the newGraph (and newClone if needed).
  // Then, it is up to the caller to deal with the result by using the setters.
  const cloneNode = () => {
    if (!isNode(selectedElement)) {
      return;
    }
    const newClone: EwoksRFNode = {
      ...selectedElement,
      id: calcNewId(selectedElement.id, nodesIds),
      selected: false,
      position: {
        x: (selectedElement.position?.x || 0) + 100,
        y: (selectedElement.position?.y || 0) + 100,
      },
    };
    // Both stay
    setNodes([...getNodes(), newClone]);
    setNodeData(newClone.id, newClone.data);
  };

  function setNodeLabel() {
    if (!isNode(selectedElement)) {
      return;
    }
    const newNode = {
      ...selectedElement,
      data: {
        ...selectedElement.data,
        ewoks_props: { ...selectedElement.data.ewoks_props, label: labelLocal },
      },
    };
    setNodeData(selectedElement.id, newNode.data);
    // TBD
    setNodes([...getNodes().filter((nod) => nod.id !== newNode.id), newNode]);
  }

  return (
    <div
      style={
        {
          ...style.body,
          ...(selected ? style.selected : []),
          border,
        } as React.CSSProperties
      }
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
          {withLabel &&
            (edit ? (
              <TextField
                label="edit node Label"
                multiline
                maxRows={4}
                value={labelLocal}
                onChange={labelChanged}
                variant="standard"
              />
            ) : (
              <div style={customTitle as React.CSSProperties}>{labelLocal}</div>
            ))}
          {!withLabel && !withImage && (
            <div style={customTitle as React.CSSProperties}>
              {label.slice(0, 1)}
            </div>
          )}
          {/* If comment also needed sometimes */}
          {/* <div style={{ wordWrap: 'break-word' }}>{comment}</div> */}
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
          {detailsL && type !== 'graphOutput' && type !== 'graphInput' && (
            <>
              <Tooltip
                title={tooltipText('Clone Node')}
                enterDelay={800}
                arrow
                placement="top"
              >
                <IconButton
                  style={{ ...contentStyle.iconButtons }}
                  aria-label="clone node"
                  onClick={() => {
                    cloneNode();
                  }}
                >
                  <FileCopyIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
              {withLabel && !edit && (
                <Tooltip
                  title={tooltipText('Edit label')}
                  enterDelay={800}
                  arrow
                  placement="top"
                >
                  <IconButton
                    style={{ ...contentStyle.iconButtons }}
                    aria-label="edit node"
                    onClick={() => {
                      setEdit(true);
                    }}
                  >
                    <EditIcon color="primary" />
                  </IconButton>
                </Tooltip>
              )}
              {withLabel && edit && (
                <Tooltip
                  title={tooltipText('Save new label')}
                  enterDelay={800}
                  arrow
                  placement="top"
                >
                  <IconButton
                    aria-label="exit edit mode"
                    onClick={() => {
                      setEdit(false);
                      setNodeLabel();
                    }}
                  >
                    <SaveIcon color="primary" />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
        </span>
      </Tooltip>
    </div>
  );
}

export default memo(Node);
