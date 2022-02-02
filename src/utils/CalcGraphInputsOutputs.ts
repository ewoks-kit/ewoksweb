import type { GraphDetails } from '../types';

// Calculate the ewoks input_nodes and output_nodes within the graph
// from the nodes of the graphRF model with types graphInput, graphOutput
export function calcGraphInputsOutputs(graph): GraphDetails {
  const graph_links = [...graph.links];
  const input_nodes = [];
  const output_nodes = [];
  const notes = [];

  graph.nodes.forEach((nod) => {
    if (nod.task_type === 'graphInput') {
      // find those nodes this INPUT node is connected to
      const nodesNamesConnectedTo = graph.links
        .filter((link) => link.source === nod.id)
        .map((link) => link.target);

      const nodeObjConnectedTo = [];
      // for (let i = 0; i < nodesNamesConnectedTo.length; i++) {
      for (const nodesName of nodesNamesConnectedTo) {
        nodeObjConnectedTo.push(
          graph.nodes.find((node) => nodesName === node.id)
        );
      }
      // iterate the nodes to create the new input_nodes
      nodeObjConnectedTo.forEach((nodConnected) => {
        const link_index = graph_links.findIndex(
          (lin) => lin.source === nod.id && lin.target === nodConnected.id
        );
        if (nodConnected.task_type === 'graph') {
          // find the link and get the sub_node it is connected to in the graph
          // TODO: find the correct input if a graph has two links to the same input
          input_nodes.push({
            id: nod.id,
            node: nodConnected.id,
            sub_node:
              (graph_links[link_index] &&
                graph_links[link_index].data.sub_target) ||
              '',
            link_attributes: {
              label:
                (graph_links[link_index] && graph_links[link_index].label) ||
                '',
              conditions:
                (graph_links[link_index] &&
                  graph_links[link_index].data.conditions) ||
                [],
            },
            uiProps: {
              position: nod.position,
              label: nod.data.label,
              linkStyle:
                (graph_links[link_index] && graph_links[link_index].type) ||
                'default',
              withImage: nod.data.withImage,
              withLabel: nod.data.withLabel,
              colorBorder: nod.data.colorBorder,
            },
          });
        } else {
          input_nodes.push({
            id: nod.id,
            node: nodConnected.id,
            sub_node: '',
            link_attributes: {
              label:
                (graph_links[link_index] && graph_links[link_index].label) ||
                '',
              conditions:
                (graph_links[link_index] &&
                  graph_links[link_index].data.conditions) ||
                [],
            },
            uiProps: {
              position: nod.position,
              label: nod.data.label,
              linkStyle:
                (graph_links[link_index] && graph_links[link_index].type) ||
                'default',
              withImage: nod.data.withImage,
              withLabel: nod.data.withLabel,
              colorBorder: nod.data.colorBorder,
            },
          });
        }
      });
    } else if (nod.task_type === 'graphOutput') {
      // find those nodes this OUTPUT node is connected to
      const nodesNamesConnectedToEnd = graph.links
        .filter((link) => link.target === nod.id)
        .map((link) => link.source);

      const nodeObjConnectedToEnd = [];
      for (const nodesNamesEnd of nodesNamesConnectedToEnd) {
        // for (let i = 0; i < nodesNamesConnectedToEnd.length; i++) {
        nodeObjConnectedToEnd.push(
          graph.nodes.find((node) => nodesNamesEnd === node.id)
        );
      }
      // iterate the nodes to create the new input_nodes
      nodeObjConnectedToEnd.forEach((nodConnected) => {
        const link_index = graph_links.findIndex(
          (lin) => lin.target === nod.id && lin.source === nodConnected.id
        );
        if (nodConnected.task_type === 'graph') {
          // find the link and get the sub_node it is connected to in the graph
          // TODO: find the correct output if a graph has two links to the same output
          output_nodes.push({
            id: nod.id,
            node: nodConnected.id,
            sub_node:
              (graph_links[link_index] &&
                graph_links[link_index].data.sub_source) ||
              '',
            link_attributes: {
              label:
                (graph_links[link_index] && graph_links[link_index].label) ||
                '',
              conditions:
                (graph_links[link_index] &&
                  graph_links[link_index].data.conditions) ||
                [],
            },
            uiProps: {
              position: nod.position,
              label: nod.data.label,
              linkStyle:
                (graph_links[link_index] && graph_links[link_index].type) ||
                'default',
              withImage: nod.data.withImage,
              withLabel: nod.data.withLabel,
              colorBorder: nod.data.colorBorder,
            },
          });
          graph_links.splice(link_index, 1);
        } else {
          output_nodes.push({
            id: nod.id,
            node: nodConnected.id,
            sub_node: '',
            link_attributes: {
              label:
                (graph_links[link_index] && graph_links[link_index].label) ||
                '',
              conditions:
                (graph_links[link_index] &&
                  graph_links[link_index].data.conditions) ||
                [],
            },
            uiProps: {
              position: nod.position,
              label: nod.data.label,
              linkStyle:
                (graph_links[link_index] && graph_links[link_index].type) ||
                'default',
              withImage: nod.data.withImage,
              withLabel: nod.data.withLabel,
              colorBorder: nod.data.colorBorder,
            },
          });
        }
      });
    } else if (nod.task_type === 'note') {
      // add to uiprops this note
      // console.log(nod, notes);
      // notes.push({ ...nod });
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
