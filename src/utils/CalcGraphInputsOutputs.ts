import { isString } from './typeGuards';
import type {
  EwoksRFLink,
  EwoksRFNode,
  GraphDetails,
  GraphNodes,
  GraphRF,
} from '../types';
import { MarkerType } from 'reactflow';

// Calculate the ewoks input_nodes and output_nodes within the graph
// from the nodes of the graphRF model with types graphInput, graphOutput
export function calcGraphInputsOutputs(graph: GraphRF): GraphDetails {
  const graph_links = [...graph.links];
  let input_nodes: GraphNodes[] = [];
  let output_nodes: GraphNodes[] = [];

  graph.nodes.forEach((nod) => {
    if (nod.data.task_props.task_type === 'graphInput') {
      input_nodes = [
        ...input_nodes,
        ...calcInOutNodes('graphInput', graph, nod, graph_links),
      ];
    }

    if (nod.data.task_props.task_type === 'graphOutput') {
      output_nodes = [
        ...output_nodes,
        ...calcInOutNodes('graphOutput', graph, nod, graph_links),
      ];
    }
  });

  return {
    id: graph.graph.id,
    label: graph.graph.label || graph.graph.id,
    category: graph.graph.category || '',
    input_nodes,
    output_nodes,
    uiProps: { ...graph.graph.uiProps },
  };
}

function calcInOutNodes(
  inputOrOutput: string,
  graph: GraphRF,
  nod: EwoksRFNode,
  graph_links: EwoksRFLink[]
): GraphNodes[] {
  const nodes: GraphNodes[] = [];

  let nodesNamesConnectedTo: string[] = [];

  if (inputOrOutput === 'graphInput') {
    // find those nodes this INPUT node is connected to
    nodesNamesConnectedTo = graph.links
      .filter((link) => link.source === nod.id)
      .map((link) => link.target);
  }

  if (inputOrOutput === 'graphOutput') {
    // find those nodes this OUTPUT node is connected to
    nodesNamesConnectedTo = graph.links
      .filter((link) => link.target === nod.id) // !!
      .map((link) => link.source); // !!
  }

  const nodeObjConnectedTo: EwoksRFNode[] = [];
  for (const nodesNames of nodesNamesConnectedTo) {
    const nodeInGraph = graph.nodes.find((node) => nodesNames === node.id);
    if (nodeInGraph) {
      nodeObjConnectedTo.push(nodeInGraph);
    }
  }

  // iterate the nodes to create the new input_nodes
  nodeObjConnectedTo.forEach((nodConnected) => {
    const link_index =
      inputOrOutput === 'graphOutput'
        ? graph_links.findIndex(
            (link) => link.target === nod.id && link.source === nodConnected.id
          )
        : graph_links.findIndex(
            (link) => link.source === nod.id && link.target === nodConnected.id
          );

    if (nodConnected.data.task_props.task_type === 'graph') {
      // find the link and get the sub_node it is connected to in the graph
      nodes.push(
        calcNodeProps(
          true,
          nod,
          nodConnected,
          graph_links,
          link_index,
          inputOrOutput
        )
      );
    } else {
      nodes.push(
        calcNodeProps(
          false,
          nod,
          nodConnected,
          graph_links,
          link_index,
          inputOrOutput
        )
      );
    }
  });

  if (nodeObjConnectedTo.length === 0) {
    nodes.push(
      calcNodeProps(false, nod, { id: '' } as EwoksRFNode, [], 0, inputOrOutput)
    );
  }

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
  const label = graph_links[link_index]?.label;

  return {
    id: nod.id,
    node: nodConnected.id,

    sub_node: isGraph
      ? (graph_links[link_index] && inputOrOutput === 'graphOutput'
          ? graph_links[link_index].data.sub_source
          : graph_links[link_index].data.sub_target) || undefined
      : undefined,
    link_attributes: {
      label: isString(label) ? label : '',
      comment: graph_links[link_index]?.data.comment ?? '',
      conditions: graph_links[link_index]?.data.conditions || [],
      data_mapping: graph_links[link_index]?.data.data_mapping || [],
      map_all_data: graph_links[link_index]?.data.map_all_data || false,
      on_error: graph_links[link_index]?.data.on_error || false,
    },
    uiProps: {
      position: nod.position,
      label: nod.data.ewoks_props.label,
      linkStyle: graph_links[link_index]?.type || 'default',
      style: {
        stroke: graph_links[link_index]?.style?.stroke || '',
        strokeWidth: '3px',
      },
      markerEnd: graph_links[link_index]?.markerEnd || '',
      animated: graph_links[link_index]?.animated || false,
      withImage:
        'withImage' in nod.data.ui_props ? nod.data.ui_props.withImage : true,
      withLabel:
        'withLabel' in nod.data.ui_props ? nod.data.ui_props.withLabel : true,
      colorBorder: nod.data.ui_props.colorBorder,
      nodeWidth: nod.data.ui_props.nodeWidth,
    },
  };
}
