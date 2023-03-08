import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { Connection, NodeProps } from 'reactflow';
import Node from './Node';
import { contentStyle as style } from './NodeStyle';
import isValidLink from '../utils/IsValidLink';
import useStore from '../store/useStore';
import type { EwoksRFLink, EwoksRFNodeData, GraphRF } from '../types';
import { useReactFlow } from 'reactflow';

function FunctionNode(props: NodeProps<EwoksRFNodeData>) {
  const { getNodes, getEdges } = useReactFlow();

  const { data: node, selected } = props;
  const graphRF = useStore((state) => state.graphRF);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const isValidConnection = (connection: Connection) => {
    const graphRf: GraphRF = {
      graph: graphRF.graph,
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

  return (
    <Node
      isGraph
      moreHandles={node.ui_props.moreHandles || false}
      withImage={node.ui_props.withImage}
      nodeWidth={node.ui_props.nodeWidth || 120}
      withLabel={node.ui_props.withLabel}
      colorBorder={node.ui_props.colorBorder}
      // the following is calculated in calcNodeType for subgraphs-inNodes-outNodes
      type={node.ui_props.type || ''}
      label={node.ewoks_props.label || ''}
      selected={selected}
      color={node.ui_props.exists ? '#ced3ee' : 'red'}
      image={node.ui_props.icon}
      comment={node.comment}
      executing={node.ui_props.executing}
      content={
        <>
          {node.ui_props.inputs
            ?.sort((a, b) => (a.positionY || 0) - (b.positionY || 0))
            .map((input: { label: string }) => (
              <div
                key={input.label}
                style={{
                  ...style.io,
                  ...style.textLeft,
                  ...(node.ui_props.moreHandles ? style.borderInput : {}),
                }}
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
                {node.ui_props.moreHandles && (
                  <Handle
                    key="&{input.label} right"
                    type="target"
                    position={Position.Right}
                    id={`${input.label.slice(
                      0,
                      input.label.indexOf(':')
                    )} right`}
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
          {node.ui_props.outputs
            ?.sort((a, b) => (a.positionY || 0) - (b.positionY || 0))
            .map((output: { label: string }) => (
              <div
                key={output.label}
                style={{
                  ...style.io,
                  ...style.textRight,
                  ...(node.ui_props.moreHandles ? style.borderOutput : {}),
                }}
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
                {node.ui_props.moreHandles && (
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
