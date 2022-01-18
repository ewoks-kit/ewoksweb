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

function FunctionNode(all) {
  console.log(all);
  return (
    <Node
      isGraph
      moreHandles={false}
      type={all.data.type}
      label={
        all.label ? all.label : all.data.label
        // ? all.label.slice(0, all.label.indexOf(':'))
        // : all.data.label.slice(0, all.data.label.indexOf(':'))
      }
      selected={all.selected}
      color={all.data.exists ? '#ced3ee' : 'red'}
      image={all.data.icon}
      comment={all.data.comment}
      content={
        <>
          {/* <div style={style.contentHeader}>Inputs</div> */}
          {all.data.inputs.map((input: { label: string }) => (
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
          {all.data.outputs.map((output: { label: string }) => (
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
