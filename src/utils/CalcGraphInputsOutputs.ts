import type {
  Graph,
  GraphDetails,
  InputOutputNodeAndLink,
  LinkWithData,
  NodeWithData,
} from '../types';
import { DEFAULT_LINK_VALUES } from './defaultValues';
import { isString } from './typeGuards';
import {
  calcConditionName,
  calcConditionValue,
  calcDataMapping,
  notUndefinedValue,
  propIsEmpty,
} from './utils';

// DOC: Calculate the ewoks input_nodes and output_nodes within the graph
// from the nodes of the graphRF model with types graphInput, graphOutput
export function calcEwoksGraphProp(graph: Graph): GraphDetails {
  let input_nodes: InputOutputNodeAndLink[] = [];
  let output_nodes: InputOutputNodeAndLink[] = [];

  graph.nodes.forEach((nod) => {
    if (nod.data.task_props.task_type === 'graphInput') {
      input_nodes = [
        ...input_nodes,
        ...calcInOutNodes(
          'graphInput',
          nod,
          [...graph.nodes],
          [...graph.links],
        ),
      ];
    }

    if (nod.data.task_props.task_type === 'graphOutput') {
      output_nodes = [
        ...output_nodes,
        ...calcInOutNodes(
          'graphOutput',
          nod,
          [...graph.nodes],
          [...graph.links],
        ),
      ];
    }
  });

  return {
    id: graph.graph.id,
    label: graph.graph.label,
    ...(!propIsEmpty(graph.graph.keywords) && {
      keywords: graph.graph.keywords,
    }),
    ...(!propIsEmpty(graph.graph.input_schema) && {
      input_schema: graph.graph.input_schema,
    }),
    ...(!propIsEmpty(graph.graph.ui_schema) && {
      ui_schema: graph.graph.ui_schema,
    }),
    ...(!propIsEmpty(graph.graph.execute_arguments) && {
      execute_arguments: graph.graph.execute_arguments,
    }),
    ...(!propIsEmpty(graph.graph.worker_options) && {
      worker_options: graph.graph.worker_options,
    }),
    ...(graph.graph.category && {
      category: graph.graph.category,
    }),
    ...(input_nodes.length > 0 && {
      input_nodes,
    }),
    ...(output_nodes.length > 0 && {
      output_nodes,
    }),
    ...(!propIsEmpty(graph.graph.uiProps) && {
      uiProps: { ...graph.graph.uiProps },
    }),
  };
}

function calcInOutNodes(
  inputOrOutput: string,
  nod: NodeWithData,
  graph_nodes: NodeWithData[],
  graph_links: LinkWithData[],
): InputOutputNodeAndLink[] {
  const nodes: InputOutputNodeAndLink[] = [];

  let nodesNamesConnectedTo: string[] = [];

  if (inputOrOutput === 'graphInput') {
    // DOC: Find the nodes, this INPUT node is connected to
    // In the current ewoks spec only one node can be connected to input-output node
    nodesNamesConnectedTo = graph_links
      .filter((link) => link.source === nod.id)
      .map((link) => link.target);
  }

  if (inputOrOutput === 'graphOutput') {
    // DOC: Find the nodes this OUTPUT node is connected to
    nodesNamesConnectedTo = graph_links
      .filter((link) => link.target === nod.id)
      .map((link) => link.source);
  }

  // DOC: use an array for all nodes although ewoks allows only one for now
  const nodeObjConnectedTo: NodeWithData[] = [];
  for (const nodesNames of nodesNamesConnectedTo) {
    const nodeInGraph = graph_nodes.find((node) => nodesNames === node.id);
    if (nodeInGraph) {
      nodeObjConnectedTo.push(nodeInGraph);
    }
  }

  // DOC: Iterate the nodes to create the new input_nodes
  nodeObjConnectedTo.forEach((nodConnected) => {
    const link_index =
      inputOrOutput === 'graphOutput'
        ? graph_links.findIndex(
            (link) => link.target === nod.id && link.source === nodConnected.id,
          )
        : graph_links.findIndex(
            (link) => link.source === nod.id && link.target === nodConnected.id,
          );

    nodes.push(
      calcNodeProps(
        nodConnected.data.task_props.task_type === 'graph',
        nod,
        nodConnected,
        graph_links,
        link_index,
        inputOrOutput,
      ),
    );
  });
  return nodes;
}

function calcNodeProps(
  isGraph: boolean,
  nod: NodeWithData,
  nodConnected: NodeWithData,
  graph_links: LinkWithData[],
  link_index: number,
  inputOrOutput: string,
): InputOutputNodeAndLink {
  const link = graph_links[link_index];

  const lData = link.data;
  const nData = nod.data;
  const nUiprops = nData.ui_props;

  const linkAttributes = {
    ...(isString(link.label) && { label: link.label }),
    ...(lData.comment && { comment: lData.comment }),
    ...(lData.conditions &&
      lData.conditions.length > 0 && {
        conditions: lData.conditions.map((con) => {
          return {
            source_output: calcConditionName(con),
            value: calcConditionValue(con),
          };
        }),
      }),
    ...(lData.data_mapping &&
      lData.data_mapping.length > 0 && {
        data_mapping: calcDataMapping(lData.data_mapping),
      }),
    ...notUndefinedValue(lData.map_all_data, 'map_all_data'),
    ...notUndefinedValue(lData.on_error, 'on_error'),
    ...notUndefinedValue(lData.required, 'required'),
  };

  return {
    id: nod.id,
    node: nodConnected.id,
    sub_node: isGraph
      ? (inputOrOutput === 'graphOutput'
          ? lData.sub_source
          : lData.sub_target) || undefined
      : undefined,
    ...(nodConnected.id &&
      !propIsEmpty(linkAttributes) && { link_attributes: linkAttributes }),
    uiProps: {
      position: nod.position,
      ...notUndefinedValue(nData.ewoks_props.label, 'label'),
      ...notUndefinedValue(link.type, 'type'),
      ...(link.style?.stroke &&
        link.style.stroke !== DEFAULT_LINK_VALUES.uiProps.stroke && {
          style: {
            stroke: link.style.stroke,
          },
        }),
      ...(link.markerEnd &&
        typeof link.markerEnd !== 'string' &&
        link.markerEnd.type !== DEFAULT_LINK_VALUES.uiProps.markerEnd.type && {
          markerEnd: link.markerEnd,
        }),
      ...notUndefinedValue(link.animated, 'animated'),
      ...notUndefinedValue(nUiprops.withImage, 'withImage'),
      ...notUndefinedValue(nUiprops.withLabel, 'withLabel'),
      ...(nUiprops.colorBorder && {
        colorBorder: nUiprops.colorBorder,
      }),
      ...(nUiprops.nodeWidth && {
        nodeWidth: nUiprops.nodeWidth,
      }),
    },
  };
}
