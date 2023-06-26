import type {
  DataMapping,
  DataMappingEwoks,
  DefaultErrorAttributes,
  EwoksRFNode,
  GraphEwoks,
  Task,
} from '../types';
import { inNodesLinks } from './inNodesLinks';
import { outNodesLinks } from './outNodesLinks';
import {
  inputsAll,
  outputsAll,
  calcNodeType,
  addNodeProperties,
} from './toRFEwoksNodesUtils';
import { createDataMappingData } from './utils';

// Accepts a GraphEwoks and returns an EwoksRFNode[]
export function toRFEwoksNodes(
  tempGraph: GraphEwoks,
  newNodeSubgraphs: GraphEwoks[],
  tasks: Task[]
): EwoksRFNode[] {
  // Find input and output nodes of the graph
  const inputsAl = inputsAll(tempGraph);

  const outputsAl = outputsAll(tempGraph);

  const inNodeLinks = inNodesLinks(tempGraph);
  const outNodeLinks = outNodesLinks(tempGraph);

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
      const nodeType = calcNodeType(inputsAl, outputsAl, task_type, id);

      const node: EwoksRFNode = {
        id: id.toString(),
        type: task_type,
        data: {
          ewoks_props: {
            label: label ?? task_identifier,
            default_inputs: default_inputs?.map((dIn) => {
              return {
                name: dIn.name.toString(),
                value: dIn.value,
              };
            }),
            inputs_complete: inputs_complete || false,
            default_error_node: default_error_node || false,
            default_error_attributes: calcDefaultErrorAttributes(
              default_error_attributes
            ),
            task_generator: task_generator || '',
          },
          task_props: {
            task_type,
            task_identifier,
            task_icon: uiProps?.task_icon || '',
          },
          ui_props: {
            nodeWidth: uiProps?.nodeWidth ?? 120,
            executing: false,
            type: nodeType,
            icon: uiProps?.node_icon ?? uiProps?.icon ?? '',
            moreHandles: uiProps?.moreHandles ?? false,
            discreteInputsOutputs: uiProps?.discreteInputsOutputs ?? false,
            details: uiProps?.details ?? false,
            withImage: uiProps?.withImage ?? true,
            withLabel: uiProps?.withLabel ?? true,
            colorBorder: uiProps?.colorBorder ?? '',
          },
          comment: uiProps?.comment ?? '',
        },
        position: uiProps?.position ?? { x: 100, y: 100 },
      };

      return addNodeProperties(
        task_type,
        newNodeSubgraphs,
        task_identifier,
        node,
        tasks,
        uiProps?.task_category || ''
      );
    }
  );
}

function calcDefaultErrorAttributes(
  default_error_attributes: DefaultErrorAttributes<DataMappingEwoks> | undefined
): DefaultErrorAttributes<DataMapping> | undefined {
  return {
    map_all_data: default_error_attributes?.map_all_data,
    data_mapping: default_error_attributes?.data_mapping?.map(
      createDataMappingData
    ),
  };
}
