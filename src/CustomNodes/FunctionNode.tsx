import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { Connection, NodeProps } from 'reactflow';
import Node from './Node';
import { contentStyle as style } from './NodeStyle';
import isValidLink from '../utils/IsValidLink';
import useStore from '../store/useStore';
import type { EwoksRFLink, EwoksRFNodeData, GraphRF } from '../types';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../store/useNodeDataStore';
import { assertNodeDataDefined } from '../utils/typeGuards';
import { getNodeData } from '../utils';

function FunctionNode(props: NodeProps<EwoksRFNodeData>) {
  const { getNodes, getEdges } = useReactFlow();

  const { selected, id } = props;
  const graphInfo = useStore((state) => state.graphInfo);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const nodesData = useNodeDataStore((state) => state.nodesData);
  const nodeData = getNodeData(id);
  assertNodeDataDefined(nodeData, id);

  const { ui_props: uiProps } = nodeData;

  const isValidConnection = (connection: Connection) => {
    const graphRf: GraphRF = {
      graph: graphInfo,
      nodes: getNodes(),
      links: getEdges() as EwoksRFLink[],
    };
    const { isValid, reason } = isValidLink(connection, graphRf, nodesData);
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
      moreHandles={uiProps.moreHandles || false}
      withImage={uiProps.withImage}
      nodeWidth={uiProps.nodeWidth || 120}
      withLabel={uiProps.withLabel}
      colorBorder={uiProps.colorBorder}
      // type is calculated in calcNodeType for subgraphs-inNodes-outNodes
      type={uiProps.type || ''}
      label={nodeData.ewoks_props.label || ''}
      selected={selected}
      color={uiProps.exists ? '#ced3ee' : 'red'}
      image={uiProps.icon}
      comment={nodeData.comment}
      executing={uiProps.executing}
      content={
        <>
          {uiProps.inputs
            ?.sort((a, b) => (a.positionY || 0) - (b.positionY || 0))
            .map((input: { label: string }) => (
              <div
                key={input.label}
                style={{
                  ...style.io,
                  ...style.textLeft,
                  ...(uiProps.moreHandles ? style.borderInput : {}),
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
                {uiProps.moreHandles && (
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
          {uiProps.outputs
            ?.sort((a, b) => (a.positionY || 0) - (b.positionY || 0))
            .map((output: { label: string }) => (
              <div
                key={output.label}
                style={{
                  ...style.io,
                  ...style.textRight,
                  ...(uiProps.moreHandles ? style.borderOutput : {}),
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
                {uiProps.moreHandles && (
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
