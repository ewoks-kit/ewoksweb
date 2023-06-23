import type {
  EwoksRFNode,
  GraphEwoks,
  GraphNodes,
  NodeInGraphType,
  Task,
} from '../types';

export function inputsAll(tempGraph: GraphEwoks): string[] {
  return tempGraph.graph.input_nodes?.map((nod) => nod.node) || [];
}

export function outputsAll(tempGraph: GraphEwoks): string[] {
  return tempGraph.graph.output_nodes?.map((nod) => nod.node) || [];
}

// DOC: calculate if node in a graph is input and/or output or internal
export function calcNodeType(
  inputs: string[],
  outputs: string[],
  task_type: string,
  id: string
): NodeInGraphType {
  const isInput = inputs.includes(id);
  const isOutput = outputs.includes(id);
  if (isInput && isOutput) {
    return 'input_output';
  }
  if (isInput) {
    return 'input';
  }
  if (isOutput) {
    return 'output';
  }
  if (task_type === 'graphInput') {
    return 'graphInput';
  }
  if (task_type === 'graphOutput') {
    return 'graphOutput';
  }

  return 'internal';
}

// DOC: locate the task and add required+optional-inputs + outputs
export function calcTask(tasks: Task[], task_identifier: string): Task {
  const tempTask = tasks.find((tas) => tas.task_identifier === task_identifier);

  if (tempTask) {
    return tempTask;
  }

  return {
    optional_input_names: [],
    output_names: [],
    required_input_names: [],
  };
}

interface calcInOutForSubgraphOutput {
  id: string;
  label: string;
  type: string;
  positionY?: number;
}

export function calcInOutForSubgraph(
  subgraphNode: GraphEwoks | undefined
): calcInOutForSubgraphOutput[][] {
  let inputsSub: calcInOutForSubgraphOutput[] = [];
  let outputsSub: calcInOutForSubgraphOutput[] = [];

  if (subgraphNode?.graph.id) {
    if (subgraphNode.graph.output_nodes) {
      const allOutputsIds = subgraphNode.graph.output_nodes.map(
        (nod) => nod.id
      );
      outputsSub = subgraphNode.graph.output_nodes.map((output) => {
        allOutputsIds.shift();

        return {
          id: output.id,
          label: calcLabel(output, allOutputsIds),
          type: 'data ',
          positionY: output.uiProps?.position?.y || 100,
        };
      });
    }

    if (subgraphNode.graph.input_nodes) {
      const allInputsIds = subgraphNode.graph.input_nodes.map((nod) => nod.id);

      inputsSub = subgraphNode.graph.input_nodes.map((input) => {
        allInputsIds.shift();

        return {
          id: input.id,
          label: calcLabel(input, allInputsIds),
          type: 'data ',
          positionY: input.uiProps?.position?.y || 100,
        };
      });
    }
  } else {
    inputsSub = [{ id: '', label: 'unknown_input', type: 'data' }];
    outputsSub = [{ id: '', label: 'unknown_output', type: 'data' }];
  }
  return [inputsSub, outputsSub];
}

export function calcLabel(
  inOut: GraphNodes,
  allInOutputsIds: string[]
): string {
  return `${inOut.uiProps?.label || inOut.id}${
    allInOutputsIds.includes(inOut.id) ? '_' : ':'
  } ${inOut.node} ${inOut.sub_node ? `  -> ${inOut.sub_node}` : ''}`;
}

export function addNodeProperties(
  task_type: string,
  newNodeSubgraphs: GraphEwoks[],
  task_identifier: string,
  node: EwoksRFNode,
  tasks: Task[],
  task_category: string
): EwoksRFNode {
  let tempNode = { ...node };
  if (task_type === 'graph') {
    const subgraphNode: GraphEwoks | undefined = newNodeSubgraphs.find(
      (subGr) => subGr.graph.id === task_identifier
    );

    const [inputsSub, outputsSub] = calcInOutForSubgraph(subgraphNode);

    tempNode = {
      ...tempNode,
      data: {
        ...tempNode.data,
        ui_props: {
          ...tempNode.data.ui_props,
          exists: subgraphNode && !!subgraphNode.graph.id,
          inputs: inputsSub,
          outputs: outputsSub,
        },
      },
    };
  } else {
    const tempTask = calcTask(tasks, task_identifier);

    tempNode = {
      ...tempNode,
      data: {
        ...tempNode.data,
        task_props: {
          ...tempNode.data.task_props,
          task_category: task_category || '',
          optional_input_names: tempTask.optional_input_names,
          output_names: tempTask.output_names,
          required_input_names: tempTask.required_input_names,
        },
      },
    };
  }
  return tempNode;
}
