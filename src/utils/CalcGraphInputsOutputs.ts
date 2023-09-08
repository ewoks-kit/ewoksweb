import { isString } from './typeGuards';
import type {
  EwoksRFLink,
  EwoksRFNode,
  GraphDetails,
  GraphNodes,
  GraphRF,
  GraphUiProps,
} from '../types';
import {
  calcConditionName,
  calcConditionValue,
  calcDataMapping,
} from './utils';
import { DEFAULT_LINK_VALUES } from './defaultValues';

// DOC: Calculate the ewoks input_nodes and output_nodes within the graph
// from the nodes of the graphRF model with types graphInput, graphOutput
export function calcGraphInputsOutputs(graph: GraphRF): GraphDetails {
  let input_nodes: GraphNodes[] = [];
  let output_nodes: GraphNodes[] = [];

  graph.nodes.forEach((nod) => {
    if (nod.data.task_props.task_type === 'graphInput') {
      input_nodes = [
        ...input_nodes,
        ...calcInOutNodes(
          'graphInput',
          nod,
          [...graph.nodes],
          [...graph.links]
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
          [...graph.links]
        ),
      ];
    }
  });

  return {
    id: graph.graph.id,
    label: graph.graph.label || graph.graph.id,
    ...(graph.graph.category && {
      category: graph.graph.category,
    }),
    ...(input_nodes.length > 0 && {
      input_nodes,
    }),
    ...(output_nodes.length > 0 && {
      output_nodes,
    }),
    ...(graph.graph.uiProps &&
      !propIsEmpty(graph.graph.uiProps) && {
        uiProps: { ...graph.graph.uiProps },
      }),
  };
}

export function propIsEmpty(uiprops: GraphUiProps) {
  let isEmpty = true;
  for (const [, value] of Object.entries(uiprops)) {
    if ((Array.isArray(value) && value.length > 0) || value) {
      isEmpty = false;
      break;
    }
  }
  return isEmpty;
}

function calcInOutNodes(
  inputOrOutput: string,
  nod: EwoksRFNode,
  graph_nodes: EwoksRFNode[],
  graph_links: EwoksRFLink[]
): GraphNodes[] {
  const nodes: GraphNodes[] = [];

  let nodesNamesConnectedTo: string[] = [];

  if (inputOrOutput === 'graphInput') {
    // DOC: Find those nodes this INPUT node is connected to
    // In the current ewoks spec only one node can be connected to input-output node
    nodesNamesConnectedTo = graph_links
      .filter((link) => link.source === nod.id)
      .map((link) => link.target);
  }

  if (inputOrOutput === 'graphOutput') {
    // DOC: Find those nodes this OUTPUT node is connected to
    nodesNamesConnectedTo = graph_links
      .filter((link) => link.target === nod.id)
      .map((link) => link.source);
  }

  // DOC: use an array for all nodes although ewoks allows only one for now
  const nodeObjConnectedTo: EwoksRFNode[] = [];
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
            (link) => link.target === nod.id && link.source === nodConnected.id
          )
        : graph_links.findIndex(
            (link) => link.source === nod.id && link.target === nodConnected.id
          );

    nodes.push(
      calcNodeProps(
        nodConnected.data.task_props.task_type === 'graph',
        nod,
        nodConnected,
        graph_links,
        link_index,
        inputOrOutput
      )
    );
  });
  return nodes;
}

function calcNodeProps(
  isGraph: boolean,
  nod: EwoksRFNode,
  nodConnected: EwoksRFNode,
  graph_links: EwoksRFLink[],
  link_index: number,
  inputOrOutput: string
): GraphNodes {
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
    ...(lData.map_all_data && { map_all_data: lData.map_all_data }),
    ...(lData.on_error && { on_error: lData.on_error }),
    ...(lData.required && { required: lData.required }),
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
      ...(nData.ewoks_props.label && { label: nData.ewoks_props.label }),
      ...(link.type && { linkStyle: link.type }),
      ...(link.style?.stroke &&
        link.style.stroke !== DEFAULT_LINK_VALUES.uiProps.stroke && {
          style: {
            stroke: link.style.stroke,
            strokeWidth: '3px',
          },
        }),
      ...(link.markerEnd &&
        typeof link.markerEnd !== 'string' &&
        link.markerEnd.type !== DEFAULT_LINK_VALUES.uiProps.markerEnd.type && {
          markerEnd: link.markerEnd,
        }),
      ...(link.animated && { animated: link.animated }),
      ...(nUiprops.withImage && {
        withImage: nUiprops.withImage,
      }),
      ...(nUiprops.withLabel && {
        withLabel: nUiprops.withLabel,
      }),
      ...(nUiprops.colorBorder && {
        colorBorder: nUiprops.colorBorder,
      }),
      ...(nUiprops.nodeWidth && {
        nodeWidth: nUiprops.nodeWidth,
      }),
    },
  };
}
