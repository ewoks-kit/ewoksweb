import type {
  DataMapping,
  DataMappingEwoks,
  DefaultErrorAttributes,
  EwoksRFNode,
  GraphEwoks,
  Task,
} from '../types';
import { inOutNodesLinks } from './inOutNodesLinks';
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

  const inNodeLinks = inOutNodesLinks(
    tempGraph.graph.input_nodes,
    tempGraph.nodes,
    'inNodesLinks'
  );
  const outNodeLinks = inOutNodesLinks(
    tempGraph.graph.input_nodes,
    tempGraph.nodes,
    'outNodesLinks'
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
      const nodeType = calcNodeType(inputsAl, outputsAl, task_type, id);

      const node: EwoksRFNode = {
        id: id.toString(),
        type: task_type,
        data: {
          ewoks_props: {
            label: label ?? task_identifier,
            ...(default_inputs &&
              default_inputs.length > 0 && {
                default_inputs: default_inputs.map((dIn) => {
                  return {
                    name: dIn.name.toString(),
                    value: dIn.value,
                  };
                }),
              }),
            ...(inputs_complete !== undefined && {
              inputs_complete,
            }),
            ...(default_error_node !== undefined && {
              default_error_node,
            }),
            ...(default_error_node &&
              default_error_attributes && {
                default_error_attributes: calcDefaultErrorAttributes(
                  default_error_attributes
                ),
              }),
            ...(task_generator !== undefined && {
              task_generator,
            }),
          },
          task_props: {
            task_type,
            task_identifier,
            // TODO: to be examined task_icon vs icon in uiProps
            task_icon: uiProps?.task_icon,
          },
          ui_props: {
            ...(uiProps?.nodeWidth !== undefined && {
              nodeWidth: uiProps.nodeWidth,
            }),
            type: nodeType,
            ...(uiProps?.icon && { icon: uiProps.icon }),
            ...(uiProps?.moreHandles !== undefined && {
              moreHandles: uiProps.moreHandles,
            }),
            ...(uiProps?.withImage !== undefined && {
              withImage: uiProps.withImage,
            }),
            ...(uiProps?.withLabel !== undefined && {
              withLabel: uiProps.withLabel,
            }),
            ...(uiProps?.colorBorder !== undefined && {
              colorBorder: uiProps.colorBorder,
            }),
          },
          ...(uiProps?.comment !== undefined && {
            comment: uiProps.comment,
          }),
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
