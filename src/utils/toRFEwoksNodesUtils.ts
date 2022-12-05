import type { EwoksRFNode, GraphEwoks, GraphNodes, Task } from '../types';

export function inputsAll(tempGraph: GraphEwoks): string[] {
  return tempGraph.graph?.input_nodes?.map((nod) => nod.node);
}

export function outputsAll(tempGraph: GraphEwoks): string[] {
  return tempGraph.graph?.output_nodes?.map((nod) => nod.node);
}

// DOC: calculate if node in a graph is input and/or output or internal
export function calcNodeType(
  inputs: string[],
  outputs: string[],
  task_type: string,
  id: string
): string {
  const isInput = inputs?.includes(id);
  const isOutput = outputs?.includes(id);
  if (isInput && isOutput) {
    return 'input_output';
  } else if (isInput) {
    return 'input';
  } else if (isOutput) {
    return 'output';
  } else if (task_type === 'graphInput') {
    return 'graphInput';
  } else if (task_type === 'graphOutput') {
    return 'graphOutput';
  }

  return 'internal';
}

// DOC: locate the task and add required+optional-inputs + outputs
export function calcTask(
  tasks: Task[],
  task_identifier: string,
  task_type: string
): Task {
  const tempTask = tasks.find((tas) => tas.task_identifier === task_identifier);

  if (tempTask || task_type === 'graph') {
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
  subgraphNode: GraphEwoks
): calcInOutForSubgraphOutput[][] {
  let inputsSub: calcInOutForSubgraphOutput[] = [];
  let outputsSub: calcInOutForSubgraphOutput[] = [];

  if (subgraphNode?.graph?.id) {
    const allOutputsIds = subgraphNode.graph.output_nodes.map((nod) => nod.id);
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

    outputsSub = subgraphNode.graph.output_nodes.map((output) => {
      allOutputsIds.shift();

      return {
        id: output.id,
        label: calcLabel(output, allOutputsIds),
        type: 'data ',
        positionY: output.uiProps?.position?.y || 100,
      };
    });
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
  return `${('uiProps' in inOut && inOut.uiProps.label) || inOut.id}${
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
    const subgraphNode: GraphEwoks = newNodeSubgraphs.find(
      (subGr) => subGr.graph.id === task_identifier
    );

    const [inputsSub, outputsSub] = calcInOutForSubgraph(subgraphNode);

    tempNode = {
      ...tempNode,
      data: {
        ...tempNode.data,
        exists: subgraphNode && !!subgraphNode.graph.id,
        inputs: inputsSub,
        outputs: outputsSub,
      },
    };
  } else {
    const tempTask = calcTask(tasks, task_identifier, task_type);

    tempNode = {
      ...tempNode,
      task_category: task_category || '',
      optional_input_names: tempTask.optional_input_names,
      output_names: tempTask.output_names,
      required_input_names: tempTask.required_input_names,
    };
  }

  return tempNode;
}
