import type {
  DataMapping,
  DefaultErrorAttributes,
  EwoksDataMapping,
  RFNode,
  Task,
  Workflow,
} from '../types';
import { inNodesLinks } from './inNodesLinks';
import { outNodesLinks } from './outNodesLinks';
import { addNodeProperties } from './toRFEwoksNodesUtils';
import { createDataMappingData, notUndefinedValue } from './utils';

// Accepts a GraphEwoks and returns an EwoksRFNode[]
export function toRFEwoksNodes(
  tempGraph: Workflow,
  newNodeSubgraphs: Workflow[],
  tasks: Task[],
): RFNode[] {
  const inNodeLinks = inNodesLinks(
    tempGraph.graph.input_nodes,
    tempGraph.nodes,
  );
  const outNodeLinks = outNodesLinks(
    tempGraph.graph.output_nodes,
    tempGraph.nodes,
  );

  const inOutTempGraph = { ...tempGraph };

  if (inNodeLinks.nodes.length > 0) {
    inOutTempGraph.nodes = [...inOutTempGraph.nodes, ...inNodeLinks.nodes];
  }

  if (outNodeLinks.nodes.length > 0) {
    inOutTempGraph.nodes = [...inOutTempGraph.nodes, ...outNodeLinks.nodes];
  }

  return inOutTempGraph.nodes.map(
    ({
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
    }) => {
      const node: RFNode = {
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
          task_props: {
            task_type,
            task_identifier,
          },
          ui_props: {
            ...notUndefinedValue(uiProps?.nodeWidth, 'nodeWidth'),
            ...(uiProps?.icon && { icon: uiProps.icon }),
            ...notUndefinedValue(uiProps?.moreHandles, 'moreHandles'),
            ...notUndefinedValue(uiProps?.withImage, 'withImage'),
            ...notUndefinedValue(uiProps?.withLabel, 'withLabel'),
            ...notUndefinedValue(uiProps?.colorBorder, 'colorBorder'),
          },
          ...notUndefinedValue(uiProps?.comment, 'comment'),
        },
        position: uiProps?.position ?? { x: 100, y: 100 },
      };

      return addNodeProperties(
        task_type,
        newNodeSubgraphs,
        task_identifier,
        node,
        tasks,
        uiProps?.task_category || '',
      );
    },
  );
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
