import type {
  InputOutputNodeAndLink,
  RFNode,
  SubgraphOutputsInputs,
  Task,
  Workflow,
} from '../types';

// DOC: locate the task and add required+optional-inputs + outputs
export function calcTask(tasks: Task[], task_identifier: string): Task {
  const tempTask = tasks.find((tas) => tas.task_identifier === task_identifier);
  if (!tempTask) {
    return { task_type: 'class', task_identifier };
  }

  return tempTask;
}

export function calcInOutForSubgraph(
  subgraphNode: Workflow | undefined,
): SubgraphOutputsInputs[][] {
  let inputsSub: SubgraphOutputsInputs[] = [];
  let outputsSub: SubgraphOutputsInputs[] = [];

  if (subgraphNode?.graph.input_nodes) {
    const allInputsIds = subgraphNode.graph.input_nodes.map((nod) => nod.id);

    inputsSub = subgraphNode.graph.input_nodes.map((input) => {
      allInputsIds.shift();

      return {
        label: calcLabel(input, allInputsIds),
        positionY: input.uiProps?.position?.y || 100,
      };
    });
  }

  if (subgraphNode?.graph.output_nodes) {
    const allOutputsIds = subgraphNode.graph.output_nodes.map((nod) => nod.id);
    outputsSub = subgraphNode.graph.output_nodes.map((output) => {
      allOutputsIds.shift();

      return {
        label: calcLabel(output, allOutputsIds),
        positionY: output.uiProps?.position?.y || 100,
      };
    });
  }

  return [inputsSub, outputsSub];
}

function calcLabel(
  inOut: InputOutputNodeAndLink,
  allInOutputsIds: string[],
): string {
  return `${inOut.uiProps?.label || inOut.id}${
    allInOutputsIds.includes(inOut.id) ? '_' : ':'
  } ${inOut.node || ''} ${inOut.sub_node ? `  -> ${inOut.sub_node}` : ''}`;
}

export function addNodeProperties(
  task_type: string,
  newNodeSubgraphs: Workflow[],
  task_identifier: string,
  node: RFNode,
  tasks: Task[],
  task_category: string,
): RFNode {
  let tempNode = { ...node };
  if (task_type === 'graph') {
    const subgraphNode: Workflow | undefined = newNodeSubgraphs.find(
      (subGr) => subGr.graph.id === task_identifier,
    );

    const [inputsSub, outputsSub] = calcInOutForSubgraph(subgraphNode);

    tempNode = {
      ...tempNode,
      data: {
        ...tempNode.data,
        ui_props: {
          ...tempNode.data.ui_props,
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
