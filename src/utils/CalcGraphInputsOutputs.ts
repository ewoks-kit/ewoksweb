import type { GraphDetails } from '../types';
import existsOrValue from './existsOrValue';

// Calculate the ewoks input_nodes and output_nodes within the graph
// from the nodes of the graphRF model with types graphInput, graphOutput
export function calcGraphInputsOutputs(graph): GraphDetails {
  const graph_links = [...graph.links];
  const input_nodes = [];
  const output_nodes = [];

  graph.nodes.forEach((nod) => {
    if (nod.task_type === 'graphInput') {
      input_nodes.push(calcInOutNodes('graphInput', graph, nod, graph_links));
    } else if (nod.task_type === 'graphOutput') {
      output_nodes.push(calcInOutNodes('graphOutput', graph, nod, graph_links));
    }
  });
  return {
    id: graph.graph.id,
    label: graph.graph.label,
    input_nodes,
    output_nodes,
    uiProps: graph.graph.uiProps,
  };
}

function calcInOutNodes(inputOrOutput, graph, nod, graph_links) {
  let node = {};

  let nodesNamesConnectedTo: string[] = [];
  if (inputOrOutput === 'graphInput') {
    // find those nodes this INPUT node is connected to
    nodesNamesConnectedTo = graph.links
      .filter((link) => link.source === nod.id)
      .map((link) => link.target);
  } else if (inputOrOutput === 'graphOutput') {
    // find those nodes this OUTPUT node is connected to
    nodesNamesConnectedTo = graph.links
      .filter((link) => link.target === nod.id) // !!
      .map((link) => link.source); // !!
  }

  const nodeObjConnectedTo = [];
  for (const nodesNames of nodesNamesConnectedTo) {
    nodeObjConnectedTo.push(graph.nodes.find((node) => nodesNames === node.id));
  }

  // iterate the nodes to create the new input_nodes
  nodeObjConnectedTo.forEach((nodConnected) => {
    const link_index =
      inputOrOutput === 'graphOutput'
        ? graph_links.findIndex(
            (lin) => lin.target === nod.id && lin.source === nodConnected.id // !!
          )
        : graph_links.findIndex(
            (lin) => lin.source === nod.id && lin.target === nodConnected.id
          );

    if (nodConnected.task_type === 'graph') {
      // find the link and get the sub_node it is connected to in the graph
      // TODO: find the correct output if a graph has two links to the same output
      node = calcNodeProps(
        true,
        nod,
        nodConnected,
        graph_links,
        link_index,
        inputOrOutput
      );
      if (inputOrOutput === 'graphOutput') {
        graph_links.splice(link_index, 1);
      } // !!
    } else {
      node = calcNodeProps(
        false,
        nod,
        nodConnected,
        graph_links,
        link_index,
        inputOrOutput
      );
    }
  });
  return node;
}

function calcNodeProps(
  isGraph,
  nod,
  nodConnected,
  graph_links,
  link_index,
  inputOrOutput
) {
  return {
    id: nod.id,
    node: nodConnected.id,
    sub_node: isGraph
      ? (graph_links[link_index] && inputOrOutput === 'graphOutput'
          ? graph_links[link_index].data.sub_source
          : graph_links[link_index].data.sub_target) || // !!
        ''
      : '',
    link_attributes: {
      label: existsOrValue(graph_links[link_index], 'label', ''),
      conditions:
        (graph_links[link_index] &&
          graph_links[link_index].data &&
          graph_links[link_index].data.conditions) ||
        [],
    },
    uiProps: {
      position: nod.position,
      label: nod.data.label,
      linkStyle:
        (graph_links[link_index] && graph_links[link_index].type) || 'default',
      withImage: nod.data.withImage || true,
      withLabel: nod.data.withLabel || true,
      colorBorder: nod.data.colorBorder,
    },
  };
}
