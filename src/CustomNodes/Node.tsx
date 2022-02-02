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
import { Tooltip } from '@material-ui/core';

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
// const randomProperty = function (obj) {
//   const keys = Object.keys(obj);
//   return obj[keys[Math.trunc(keys.length * Math.random())]];
// };

const onDragStart = (e) => {
  e.preventDefault();
};
const isValidOutput = (connection) => {
  return true;
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
}: NodeProps) => {
  console.log(type);
  // TODO: calculate the border
  const border = colorBorder
    ? `4px solid ${colorBorder}`
    : '2px solid rgb(233, 235, 247)';
  // if (type === 'input') {
  //   border = '4px solid rgb(62, 80, 180)';
  // } else if (type === 'output') {
  //   border = '4px solid rgb(50, 130, 219)';
  // } else if (type === 'input_output') {
  //   border = '4px solid rgb(200, 130, 219)';
  // } else if (isGraph) {
  //   // type === 'graph'
  //   border = '4px solid rgb(150, 165, 249)';
  // }
  const customTitle = {
    ...style.title,
    wordWrap: 'break-word',
    borderRadius: '0px',
    margin: '4px',
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
      onMouseOver={() => console.log(label)}
      onFocus={() => console.log(label)}
      role="button"
      tabIndex={0}
    >
      <Tooltip title={comment} arrow>
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
                  // isValidConnection={(connection) => isValidOutput(connection)}
                  isConnectable
                  onConnect={(params) =>
                    console.log('handle st onConnect', params)
                  }
                >
                  {/* <img
                role="presentation"
                draggable="false"
                onDragStart={(event) => onDragStart(event)}
                src={iconsObj['up']}
                alt=""
              /> */}
                </Handle>
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
                  // isValidConnection={(connection) => isValidOutput(connection)}
                  isConnectable
                  onConnect={(params) =>
                    console.log('handle sb onConnect', params)
                  }
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

          {/* <div style={{ wordWrap: 'break-word' }}>{comment}</div> */}
          {withImage && (
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
              onConnect={(params) => console.log('handle tl onConnect', params)}
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
                  // isValidConnection={(connection) => isValidOutput(connection)}
                  isConnectable
                  onConnect={(params) =>
                    console.log('handle tb onConnect', params)
                  }
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
                  isValidConnection={(connection) => isValidOutput(connection)}
                  isConnectable
                  onConnect={(params) =>
                    console.log('handle tt onConnect', params)
                  }
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
