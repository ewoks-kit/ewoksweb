import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { Connection, NodeProps } from 'reactflow';
import Node from './Node';
import { contentStyle as style } from './nodeStyles';
import isValidLink from '../utils/IsValidLink';
import useStore from '../store/useStore';
import type { EwoksRFLink, EwoksRFNodeData, GraphRF } from '../types';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../store/useNodeDataStore';
import { assertNodeDataDefined } from '../utils/typeGuards';
import { getNodesData } from '../utils';

function DiscreteInputOutputNode(props: NodeProps<EwoksRFNodeData>) {
  const { getNodes, getEdges } = useReactFlow();

  const { selected, id } = props;
  const graphInfo = useStore((state) => state.graphInfo);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const nodeData = useNodeDataStore((state) => state.nodesData.get(id));

  assertNodeDataDefined(nodeData, id);

  const { ui_props: uiProps } = nodeData;

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

  const inputs: string[] = [
    ...(nodeData.task_props.required_input_names || []),
    ...(nodeData.task_props.optional_input_names || []),
  ];

  const outputs: string[] = [...(nodeData.task_props.output_names || [])];

  return (
    <Node
      isGraph // ={false}
      moreHandles={uiProps.moreHandles || false}
      withImage={uiProps.withImage}
      nodeWidth={uiProps.nodeWidth || 120}
      withLabel={uiProps.withLabel}
      colorBorder={uiProps.colorBorder}
      // type is calculated in calcNodeType for subgraphs-inNodes-outNodes
      type={uiProps.type || 'internal'}
      label={nodeData.ewoks_props.label || ''}
      selected={selected}
      color="#ced3ee"
      image={uiProps.icon}
      comment={nodeData.comment}
      executing={uiProps.executing}
      content={
        <>
          {inputs.map((input) => (
            <div
              key={input}
              style={{
                ...style.io,
                ...style.textLeft,
                ...(uiProps.moreHandles ? style.borderInput : {}),
              }}
            >
              {input}
              <Handle
                key={input}
                type="target"
                position={Position.Left}
                id={input}
                style={{
                  ...style.handle,
                  ...style.left,
                  ...style.handleTarget,
                }}
                // isValidConnection={isValidConnection}
              />
              {uiProps.moreHandles && (
                <Handle
                  key="&{input.label} right"
                  type="target"
                  position={Position.Right}
                  id={`${input.slice(0, input.indexOf(':'))} right`}
                  style={{
                    ...style.handle,
                    ...style.right,
                    ...style.handleTarget,
                  }}
                  // isValidConnection={isValidConnection}
                />
              )}
            </div>
          ))}
          {outputs.map((output) => (
            <div
              key={output}
              style={{
                ...style.io,
                ...style.textRight,
                ...(uiProps.moreHandles ? style.borderOutput : {}),
              }}
            >
              {/* remove the rest of the output {output.label} for now */}
              {output}
              <Handle
                key={output}
                type="source"
                position={Position.Right}
                id={output}
                style={{
                  ...style.handle,
                  ...style.right,
                  ...style.handleSource,
                }}
                // isValidConnection={isValidConnection}
              />
              {uiProps.moreHandles && (
                <Handle
                  key={`${output} left`}
                  type="source"
                  position={Position.Left}
                  id={`${output.slice(0, output.indexOf(':'))} left`}
                  style={{
                    ...style.handle,
                    ...style.left,
                    ...style.handleSource,
                  }}
                  // isValidConnection={isValidConnection}
                />
              )}
            </div>
          ))}
        </>
      }
    />
  );
}

export default memo(DiscreteInputOutputNode);
