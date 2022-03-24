import React, { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import Node from './Node';
import { contentStyle as style } from './NodeStyle';
import isValidLink from '../utils/IsValidLink';
import state from '../store/state';

function FunctionNode(fnod) {
  const graphRF = state((state) => state.graphRF);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);

  const isValidConnection = (connection) => {
    const { isValid, reason } = isValidLink(connection, graphRF);
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
    <Node
      isGraph
      moreHandles={fnod.data.moreHandles}
      withImage={fnod.data.withImage}
      withLabel={fnod.data.withLabel}
      colorBorder={fnod.data.colorBorder}
      type={fnod.data.type}
      label={
        fnod.label ? fnod.label : fnod.data.label
        // ? fnod.label.slice(0, fnod.label.indexOf(':'))
        // : fnod.data.label.slice(0, fnod.data.label.indexOf(':'))
      }
      selected={fnod.selected}
      color={fnod.data.exists ? '#ced3ee' : 'red'}
      image={fnod.data.icon}
      comment={fnod.data.comment}
      executing={fnod.data.executing}
      content={
        <>
          {/* <div style={style.contentHeader}>Inputs</div> */}
          {fnod.data.inputs.map((input: { label: string }) => (
            <div
              key={input.label}
              style={
                {
                  ...style.io,
                  ...style.textLeft,
                  ...(fnod.data.moreHandles ? style.borderInput : {}),
                } as React.CSSProperties
              }
            >
              {/* remove the rest of the input {input.label} for now */}
              {input.label.slice(0, input.label.indexOf(':'))}
              <Handle
                key={input.label}
                type="target"
                position={Position.Left}
                id={input.label.slice(0, input.label.indexOf(':'))}
                style={{
                  ...style.handle,
                  ...style.left,
                  ...style.handleTarget,
                }}
                isValidConnection={isValidConnection}
              />
              {fnod.data.moreHandles && (
                <Handle
                  key="&{input.label} right"
                  type="target"
                  position={Position.Right}
                  id={`${input.label.slice(0, input.label.indexOf(':'))} right`}
                  style={{
                    ...style.handle,
                    ...style.right,
                    ...style.handleTarget,
                  }}
                  isValidConnection={isValidConnection}
                />
              )}
            </div>
          ))}
          {/* <div style={style.contentHeader}>Outputs</div> */}
          {fnod.data.outputs.map((output: { label: string }) => (
            <div
              key={output.label}
              style={
                {
                  ...style.io,
                  ...style.textRight,
                  ...(fnod.data.moreHandles ? style.borderOutput : {}),
                } as React.CSSProperties
              }
            >
              {/* remove the rest of the output {output.label} for now */}
              {output.label.slice(0, output.label.indexOf(':'))}
              <Handle
                key={output.label}
                type="source"
                position={Position.Right}
                id={output.label.slice(0, output.label.indexOf(':'))}
                style={{
                  ...style.handle,
                  ...style.right,
                  ...style.handleSource,
                }}
                isValidConnection={isValidConnection}
              />
              {fnod.data.moreHandles && (
                <Handle
                  key={`${output.label} left`}
                  type="source"
                  position={Position.Left}
                  id={`${output.label.slice(
                    0,
                    output.label.indexOf(':')
                  )} left`}
                  style={{
                    ...style.handle,
                    ...style.left,
                    ...style.handleSource,
                  }}
                  isValidConnection={isValidConnection}
                />
              )}
            </div>
          ))}
        </>
      }
    />
  );
}

export default memo(FunctionNode);
