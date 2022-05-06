import type { GraphDetails } from '../types';
import existsOrValue from './existsOrValue';

// Calculate the ewoks input_nodes and output_nodes within the graph
// from the nodes of the graphRF model with types graphInput, graphOutput
export function calcGraphInputsOutputs(graph): GraphDetails {
  const graph_links = [...graph.links];
  let input_nodes = [];
  let output_nodes = [];

  graph.nodes.forEach((nod) => {
    if (nod.task_type === 'graphInput') {
      // console.log(
      //   input_nodes,
      //   calcInOutNodes('graphInput', graph, nod, graph_links)
      // );
      input_nodes = [
        ...input_nodes,
        ...calcInOutNodes('graphInput', graph, nod, graph_links),
      ];
    } else if (nod.task_type === 'graphOutput') {
      output_nodes = [
        ...output_nodes,
        ...calcInOutNodes('graphOutput', graph, nod, graph_links),
      ];
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
  const nodes = [];

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

  // console.log(nodesNamesConnectedTo);

  const nodeObjConnectedTo = [];
  for (const nodesNames of nodesNamesConnectedTo) {
    nodeObjConnectedTo.push(graph.nodes.find((node) => nodesNames === node.id));
  }

  // console.log(nodeObjConnectedTo);

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
    // console.log(link_index);
    if (nodConnected.task_type === 'graph') {
      // find the link and get the sub_node it is connected to in the graph
      // TODO: find the correct output if a graph has two links to the same output
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
      // if (inputOrOutput === 'graphOutput') {
      //   graph_links.splice(link_index, 1);
      // } // !!
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
  return nodes;
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
      comment: existsOrValue(graph_links[link_index]?.data, 'comment', ''),
      conditions: graph_links[link_index]?.data?.conditions || [],
      data_mapping: graph_links[link_index]?.data?.data_mapping || [],
      map_all_data: graph_links[link_index]?.data?.map_all_data || false,
      on_error: graph_links[link_index]?.data?.on_error || false,
    },
    uiProps: {
      position: nod.position,
      label: nod.data.label,
      linkStyle: graph_links[link_index]?.type || 'default',
      style: {
        stroke: graph_links[link_index]?.style?.stroke || '',
        strokeWidth: '3',
      },
      markerEnd: { type: graph_links[link_index]?.markerEnd?.type || '' },
      animated: graph_links[link_index]?.animated || false,
      withImage: 'withImage' in nod.data ? nod.data.withImage : true,
      withLabel: 'withLabel' in nod.data ? nod.data.withLabel : true,
      colorBorder: nod.data.colorBorder,
    },
  };
}
