import React, { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import Node from './Node';
import { contentStyle as style } from './NodeStyle';

const isValidInput = () => {
  return true;
};
const isValidOutput = () => {
  return true; // R.last(R.split('__', connection.target)) === type;
};

function FunctionNode(fnod) {
  console.log(fnod);
  return (
    <Node
      isGraph
      moreHandles={false}
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
      content={
        <>
          {/* <div style={style.contentHeader}>Inputs</div> */}
          {fnod.data.inputs.map((input: { label: string }) => (
            <div
              key={input.label}
              style={{ ...style.io, ...style.textLeft } as React.CSSProperties}
            >
              {/* remove the rest of the input {input.label} for now */}
              {input.label.slice(0, input.label.indexOf(':'))}
              <Handle
                key={input.label}
                type="target"
                position={Position.Left}
                id={input.label}
                style={{
                  ...style.handle,
                  ...style.left,
                  ...style.handleTarget,
                }}
                isValidConnection={
                  () => isValidInput() // connection, input.type
                }
              />
              <Handle
                key={input.label + 'right'}
                type="target"
                position={Position.Right}
                id={input.label + 'right'}
                style={{
                  ...style.handle,
                  ...style.right,
                  ...style.handleTarget,
                }}
                isValidConnection={() => isValidOutput()}
              />
            </div>
          ))}
          {/* <div style={style.contentHeader}>Outputs</div> */}
          {fnod.data.outputs.map((output: { label: string }) => (
            <div
              key={output.label}
              style={{ ...style.io, ...style.textRight } as React.CSSProperties}
            >
              {/* remove the rest of the output {output.label} for now */}
              {output.label.slice(0, output.label.indexOf(':'))}
              <Handle
                key={output.label}
                type="source"
                position={Position.Right}
                id={output.label}
                style={{
                  ...style.handle,
                  ...style.right,
                  ...style.handleSource,
                }}
                isValidConnection={() => isValidOutput()}
              />
              <Handle
                key={output.label + 'left'}
                type="source"
                position={Position.Left}
                id={output.label + 'left'}
                style={{
                  ...style.handle,
                  ...style.left,
                  ...style.handleSource,
                }}
                isValidConnection={() => isValidOutput()}
              />
            </div>
          ))}
        </>
      }
    />
  );
}

export default memo(FunctionNode);
