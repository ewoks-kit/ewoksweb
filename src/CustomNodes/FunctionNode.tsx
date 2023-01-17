import { memo } from 'react';
import type { Connection, NodeProps } from 'reactflow';
import Node from './Node';
import isValidLink from '../utils/IsValidLink';
import useStore from '../store/useStore';
import type { EwoksRFNodeData } from '../types';
import InputHandle from './InputHandle';
import OutputHandle from './OutputHandle';

function FunctionNode(props: NodeProps<EwoksRFNodeData>) {
  const { data: node, selected } = props;
  const graphRF = useStore((state) => state.graphRF);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const isValidConnection = (connection: Connection) => {
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
      moreHandles={node.moreHandles || false}
      withImage={node.withImage}
      nodeWidth={node.nodeWidth || 120}
      withLabel={node.withLabel}
      colorBorder={node.colorBorder}
      // the following is calculated in calcNodeType for subgraphs-inNodes-outNodes
      type={node.type || ''}
      label={node.label || ''}
      selected={selected}
      color={node.exists ? '#ced3ee' : 'red'}
      image={node.icon}
      comment={node.comment}
      executing={node.executing}
      content={
        <>
          {node.inputs
            ?.sort((a, b) => (a.positionY || 0) - (b.positionY || 0))
            .map((input) => (
              <InputHandle
                key={input.label}
                label={input.label}
                isValidConnection={isValidConnection}
                moreHandles={node.moreHandles}
              />
            ))}
          {node.outputs
            ?.sort((a, b) => (a.positionY || 0) - (b.positionY || 0))
            .map((output) => (
              <OutputHandle
                key={output.label}
                label={output.label}
                isValidConnection={isValidConnection}
                moreHandles={node.moreHandles}
              />
            ))}
        </>
      }
    />
  );
}

export default memo(FunctionNode);
