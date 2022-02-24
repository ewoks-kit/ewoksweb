/* eslint-disable react/function-component-definition */
/* jshint sub:true*/
import React, { memo } from 'react';
import orange1 from '../images/orange1.png';
import orange2 from '../images/orange2.png';
import orange3 from '../images/orange3.png';
import AggregateColumns from '../images/AggregateColumns.svg';
import Continuize from '../images/Continuize.svg';
import graphInput from '../images/graphInput.svg';
import right from '../images/right.svg';
import left from '../images/left.svg';
import up from '../images/up.svg';
import down from '../images/down.svg';
import graphOutput from '../images/graphOutput.svg';
import Correlations from '../images/Correlations.svg';
import CreateClass from '../images/CreateClass.svg';
import { Handle, Position } from 'react-flow-renderer';
import type { NodeProps } from '../types';
import { contentStyle, style } from './NodeStyle';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import { styled } from '@material-ui/core/styles';
import IntegratedSpinner from '../Components/IntegratedSpinner';
import ExecuteSpinner from '../Components/ExecuteSpinner';
import SendIcon from '@material-ui/icons/Send';

import state from '../store/state';

const iconsObj = {
  left,
  right,
  up,
  down,
  graphInput,
  graphOutput,
  orange1,
  Continuize,
  orange2,
  orange3,
  AggregateColumns,
  Correlations,
  CreateClass,
};

const onDragStart = (e) => {
  e.preventDefault();
};
// const isValidOutput = (connection) => {
//   return true;
// };

// const executing = true;
const getFromServer = async () => {
  // console.log('executing');
};

// The basic Node component
const Node: React.FC<NodeProps> = ({
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
}: NodeProps) => {
  const theCom = (
    <span>
      <b>{label}</b>:<div>{comment}</div>
    </span>
  );
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

  const displayNode = {
    textAlign: 'center' as const,
    maxWidth: '120px',
    // minWidth: '120px', // for standard width
    // maxHeight: '200px',
    display: ['graphInput', 'graphOutput'].includes(type) ? 'flex' : 'inline',
  };

  if (color) {
    customTitle.backgroundColor = color;
    customTitle.borderRadius = '10px 10px 3px 3px';
  }
  const isExecuted = state((state) => state.isExecuted);
  // const [executing, setExecuting] = React.useState(false);

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
      // onMouseOver={() => console.log(label)}
      onFocus={() => console.log(label)}
      role="button"
      tabIndex={0}
    >
      <Tooltip title={theCom} arrow>
        <span style={displayNode} className="icons">
          {!isGraph && type !== 'graphOutput' && (
            <Handle
              type="source"
              position={Position.Right}
              id="sr"
              style={{ ...contentStyle.handle, ...contentStyle.handleSource }}
              // isValidConnection={(connection) => isValidOutput(connection)}
              isConnectable
              onConnect={(params) => console.log('handle sr onConnect', params)}
            >
              {/* <img
              role="presentation"
              draggable="false"
              onDragStart={(event) => onDragStart(event)}
              src={iconsObj['right']}
              alt=""
            /> */}
            </Handle>
          )}
          {!isGraph &&
            type !== 'graphOutput' &&
            type !== 'graphInput' &&
            moreHandles && (
              <div
                id="choice"
                onMouseOver={() => console.log(label)}
                onFocus={() => console.log(label)}
                role="button"
                tabIndex={0}
              >
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
                ></Handle>
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
                >
                  {/* <img src={iconsObj['down']} alt="" /> */}
                </Handle>
              </div>
            )}
          {withLabel && (
            <div style={customTitle as React.CSSProperties}>{label}</div>
          )}
          {!withLabel && !withImage && (
            <div style={customTitle as React.CSSProperties}>
              {label.slice(0, 1)}
            </div>
          )}
          {isExecuted &&
            !withImage &&
            type !== 'graphOutput' &&
            type !== 'graphInput' && (
              <IntegratedSpinner
                getting={executing}
                tooltip="Open and edit Workflow"
                action={getFromServer}
              >
                <SendIcon />
              </IntegratedSpinner>
            )}
          {/* <div style={{ wordWrap: 'break-word' }}>{comment}</div> */}
          {withImage &&
            type !== 'graphOutput' &&
            type !== 'graphInput' &&
            (isExecuted ? (
              <ExecuteSpinner
                getting={executing}
                tooltip="Open and edit Workflow"
                action={getFromServer}
              >
                <img
                  style={{ padding: '2px' }}
                  role="presentation"
                  draggable="false"
                  onDragStart={(event) => onDragStart(event)}
                  src={iconsObj[image] || orange1}
                  alt="Image"
                />
              </ExecuteSpinner>
            ) : (
              <img
                style={{ padding: '2px' }}
                role="presentation"
                draggable="false"
                onDragStart={(event) => onDragStart(event)}
                src={iconsObj[image] || orange1}
                alt="Image"
              />
            ))}
          {withImage && (type === 'graphOutput' || type === 'graphInput') && (
            <img
              style={{ padding: '2px' }}
              role="presentation"
              draggable="false"
              onDragStart={(event) => onDragStart(event)}
              src={iconsObj[image] || orange1}
              alt="Image"
            />
          )}
          {/* {type !== 'graphOutput' && type !== 'graphInput' && <span style={style.contentWrapper}>{type}</span>} */}
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
            >
              {/* <img src={iconsObj['right']} alt="" /> */}
            </Handle>
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
                >
                  {/* <Tooltip title="Delete">
                  <IconButton>in</IconButton>
                </Tooltip> */}
                  {/* <img src={iconsObj['up']} alt="" /> */}
                </Handle>
                <Handle
                  type="target"
                  position={Position.Top}
                  id="tt"
                  style={{
                    left: 20,
                    ...contentStyle.handleTarget,
                    ...contentStyle.handleUpDown,
                  }}
                  // isValidConnection={(connection) => isValidOutput(connection)}
                  isConnectable
                  // onConnect={(params) =>
                  //   // console.log('handle tt onConnect', params)
                  // }
                >
                  {/* <img src={iconsObj['down']} alt="" /> */}
                </Handle>
              </>
            )}
          {isGraph && <span style={style.contentWrapper}>{content}</span>}
        </span>
      </Tooltip>
    </div>
  );
};

export default memo(Node);
