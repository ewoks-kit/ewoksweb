import type {
  DataMapping,
  DefaultErrorAttributes,
  EwoksDataMapping,
  InputOutputNodeAndLink,
  NodeTaskProperties,
  NodeWithData,
  SubgraphOutputsInputs,
  Task,
  Workflow,
} from '../types';
import { inNodesLinks } from './inNodesLinks';
import { outNodesLinks } from './outNodesLinks';
import { createDataMappingData, notUndefinedValue } from './utils';

export function convertEwoksWorkflowToRFNodes(
  workflowToConvert: Workflow,
  subWorkflows: Workflow[],
  tasks: Task[],
): NodeWithData[] {
  const { nodes } = workflowToConvert;

  const { nodes: inputNodes } = inNodesLinks(
    workflowToConvert.graph.input_nodes,
    nodes,
  );
  const { nodes: outputNodes } = outNodesLinks(
    workflowToConvert.graph.output_nodes,
    nodes,
  );

  const allNodes = [...nodes, ...inputNodes, ...outputNodes];

  return allNodes.map((node) => {
    const {
      id,
      task_type,
      task_identifier,
      label,
      default_inputs,
      inputs_complete,
      default_error_node,
      default_error_attributes,
      task_generator,
      uiProps,
    } = node;
    return {
      id: id.toString(),
      type: task_type,
      data: {
        ewoks_props: {
          label,
          ...(default_inputs &&
            default_inputs.length > 0 && {
              default_inputs: default_inputs.map((dIn) => {
                return {
                  name: dIn.name.toString(),
                  value: dIn.value,
                };
              }),
            }),
          ...notUndefinedValue(inputs_complete, 'inputs_complete'),
          ...notUndefinedValue(default_error_node, 'default_error_node'),
          ...(default_error_node &&
            default_error_attributes && {
              default_error_attributes: calcDefaultErrorAttributes(
                default_error_attributes,
              ),
            }),
          ...notUndefinedValue(task_generator, 'task_generator'),
        },
        task_props: calcTaskProps(task_identifier, tasks) || {
          task_identifier,
          task_type,
        },
        ui_props: {
          ...notUndefinedValue(uiProps?.nodeWidth, 'nodeWidth'),
          ...(uiProps?.icon && { icon: uiProps.icon }),
          ...notUndefinedValue(uiProps?.moreHandles, 'moreHandles'),
          ...notUndefinedValue(uiProps?.withImage, 'withImage'),
          ...notUndefinedValue(uiProps?.withLabel, 'withLabel'),
          ...notUndefinedValue(uiProps?.colorBorder, 'colorBorder'),
          ...(task_type === 'graph'
            ? calcSubgraphIO(subWorkflows, task_identifier)
            : {}),
        },
        ...notUndefinedValue(uiProps?.comment, 'comment'),
      },
      position: uiProps?.position ?? { x: 100, y: 100 },
    };
  });
}

function calcDefaultErrorAttributes(
  default_error_attributes:
    | DefaultErrorAttributes<EwoksDataMapping>
    | undefined,
): DefaultErrorAttributes<DataMapping> | undefined {
  return {
    map_all_data: default_error_attributes?.map_all_data,
    data_mapping: default_error_attributes?.data_mapping?.map(
      createDataMappingData,
    ),
  };
}

function calcInOutForSubgraph(
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

function calcTaskProps(
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

function calcSubgraphIO(
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
