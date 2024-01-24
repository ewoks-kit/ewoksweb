import type {
  DataMapping,
  DefaultErrorAttributes,
  EwoksDataMapping,
  NodeWithData,
  Task,
  Workflow,
} from '../types';
import { inNodesLinks } from './inNodesLinks';
import { outNodesLinks } from './outNodesLinks';
import { calcSubgraphIO, calcTaskProps } from './toRFEwoksNodesUtils';
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
