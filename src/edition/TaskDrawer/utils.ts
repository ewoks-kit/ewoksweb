import type { Edge, Node, XYPosition } from 'reactflow';
import { Position } from 'reactflow';

import type {
  InputOutputNodeAndLink,
  NodeData,
  RFNode,
  Workflow,
} from '../../types';
import { generateUniqueNodeId } from '../../utils/utils';

export async function loadSubworkflow(
  subGraph: Workflow,
  nodes: Node[],
  links: Edge[],
  position: XYPosition,
): Promise<{ nodeWithoutData: Node; data: NodeData }> {
  const inputsSub = subGraph.graph.input_nodes?.map((input) => {
    return {
      label: calcLabel(input),
      positionY: input.uiProps?.position?.y || 100,
    };
  });
  const outputsSub = subGraph.graph.output_nodes?.map((output) => {
    return {
      label: calcLabel(output),
      positionY: output.uiProps?.position?.y || 100,
    };
  });

  const graphId = generateUniqueNodeId(
    nodes.map((node) => node.id),
    subGraph.graph.label,
  );

  const newNode: RFNode = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    id: graphId,
    // TODO: Is this type the same with task_props.task_type? Is it used?
    type: 'graph',
    position,
    data: {
      task_props: {
        task_type: 'graph',
        task_identifier: subGraph.graph.id,
      },
      ui_props: {
        ...(inputsSub && inputsSub.length > 0 && { inputs: inputsSub }),
        ...(outputsSub && outputsSub.length > 0 && { outputs: outputsSub }),
      },

      ewoks_props: {
        label: subGraph.graph.label,
      },
    },
  };

  const { data, ...nodeWithoutData } = newNode;
  return { nodeWithoutData: nodeWithoutData as Node, data };
}

function calcLabel(inputOutput: InputOutputNodeAndLink): string {
  return `${inputOutput.uiProps?.label ?? inputOutput.id}: ${
    inputOutput.node
  } ${inputOutput.sub_node ? ` -> ${inputOutput.sub_node}` : ''}`;
}
