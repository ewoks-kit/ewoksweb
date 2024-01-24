import type {
  InputOutputNodeAndLink,
  NodeTaskProperties,
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

  const inputNodes = subgraphNode?.graph.input_nodes;
  if (inputNodes) {
    const allInputsIds = inputNodes.map((nod) => nod.id);

    inputsSub = inputNodes.map((input) => {
      allInputsIds.shift();

      return {
        label: calcLabel(input, allInputsIds),
        positionY: input.uiProps?.position?.y || 100,
      };
    });
  }

  const outputNodes = subgraphNode?.graph.output_nodes;
  if (outputNodes) {
    const allOutputsIds = outputNodes.map((nod) => nod.id);
    outputsSub = outputNodes.map((output) => {
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

export function calcTaskProps(
  task_identifier: string,
  tasks: Task[],
): NodeTaskProperties | undefined {
  const task = tasks.find((tas) => tas.task_identifier === task_identifier);

  if (!task) {
    return undefined;
  }

  const { icon, ...taskProps } = task;
  return taskProps;
}

export function calcSubgraphIO(
  newNodeSubgraphs: Workflow[],
  task_identifier: string,
): { inputs: SubgraphOutputsInputs[]; outputs: SubgraphOutputsInputs[] } {
  const subgraphNode: Workflow | undefined = newNodeSubgraphs.find(
    (subGr) => subGr.graph.id === task_identifier,
  );

  const [inputs, outputs] = calcInOutForSubgraph(subgraphNode);

  return {
    inputs,
    outputs,
  };
}
