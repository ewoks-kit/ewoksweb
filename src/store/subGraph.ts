import type { EwoksRFNode, GraphRF, GraphEwoks } from '../types';
import { createGraph } from '../utils';
import { toRFEwoksNodes } from '../utils/toRFEwoksNodes';
import { toRFEwoksLinks } from '../utils/toRFEwoksLinks';
import { findAllSubgraphs } from '../utils/FindAllSubgraphs';
import existsOrValue from '../utils/existsOrValue';

const subGraph = (set, get) => ({
  subGraph: {
    graph: { id: '', label: '', input_nodes: [], output_nodes: [] },
    nodes: [],
    links: [],
  } as GraphRF,

  setSubGraph: async (subGraph: GraphEwoks) => {
    // 1. input the graphEwoks from server or file-system
    // 2. search for all subgraphs in it (async)
    const prevState = get((prev) => prev);
    const newNodeSubgraphs = await findAllSubgraphs(
      subGraph,
      prevState.recentGraphs
    );
    // 3. Put the newNodeSubgraphs into recent in their graphRF form (sync)
    newNodeSubgraphs.forEach((gr) => {
      // calculate the rfNodes using the fetched subgraphs
      const rfNodes = toRFEwoksNodes(gr, newNodeSubgraphs, prevState.tasks);

      prevState.setRecentGraphs({
        graph: gr.graph,
        nodes: rfNodes,
        links: toRFEwoksLinks(gr, newNodeSubgraphs, prevState.tasks),
      });
    });
    // 4. Calculate the new graph given the subgraphs
    const grfNodes = toRFEwoksNodes(
      subGraph,
      newNodeSubgraphs,
      prevState.tasks
    );

    const graph = {
      graph: subGraph.graph,
      nodes: grfNodes,
      links: toRFEwoksLinks(subGraph, newNodeSubgraphs, prevState.tasks),
    };
    // Adding a subgraph to an existing workingGraph:
    // save the workingGraph in the recent graphs and add a new graph node to it

    let subToAdd = graph as GraphRF;

    if (prevState.recentGraphs.length === 0) {
      // if there is no initial graph to drop-in the subgraph -> create one? TODO?
      subToAdd = createGraph();
      prevState.setSubgraphsStack({
        id: subToAdd.graph.id,
        label: subToAdd.graph.label,
      });
      prevState.setRecentGraphs(subToAdd);
    } else {
      // TODO: if not in the recentGraphs?
      // subToAdd = prevState.recentGraphs.find(
      //   (gr) => gr.graph.id === prevState.graphRF.graph.id
      // );
    }

    let newNode = {} as EwoksRFNode;
    if (subToAdd) {
      const inputsSub = subToAdd.graph.input_nodes.map((input) => {
        return {
          label: calcLabel(input),
          // `${
          //   existsOrValue(input.uiProps, 'label', input.id) as string
          // }: ${input.node} ${input.sub_node ? `  -> ${input.sub_node}` : ''}`,
          type: 'data ',
        };
      });
      const outputsSub = subToAdd.graph.output_nodes.map((output) => {
        return {
          label: calcLabel(output),
          // `${
          //   existsOrValue(output.uiProps, 'label', output.id) as string
          // }: ${output.node} ${output.sub_node ? ` -> ${output.sub_node}` : ''}`,
          type: 'data ',
        };
      });
      let id = 0;
      let graphId = subToAdd.graph.label;
      while (prevState.graphRF.nodes.some((nod) => nod.id === graphId)) {
        graphId += id++;
      }
      newNode = {
        sourcePosition: 'right',
        targetPosition: 'left',
        task_generator: '',
        // TODO: ids should be unique to this graph only as a node for this subgraph
        // human readable but automatically generated?
        id: graphId,
        // TODO: can we upload a task too like a subgraph
        task_type: 'graph',
        task_identifier: subToAdd.graph.id,
        type: 'graph',
        position: { x: 100, y: 500 },
        default_inputs: [],
        inputs_complete: false,
        default_error_node: false,
        default_error_attributes: {
          map_all_data: true,
          data_mapping: [],
        },
        data: {
          exists: true,
          label: subToAdd.graph.label,
          type: 'internal',
          comment: '',
          // TODO: icon needs to be in the task and graph JSON specification
          icon: subToAdd.graph.uiProps && subToAdd.graph.uiProps.icon,
          inputs: inputsSub,
          outputs: outputsSub,
          // icon: subToAdd.data.icon ? subToAdd.data.icon : '',
        },
        // data: { label: CustomNewNode(id, name, image) },
      };

      prevState.setRecentGraphs(subToAdd);
    } else {
      // Handle
      prevState.setOpenSnackbar({
        open: true,
        text: 'Couldnt locate the workingGraph in the recent!',
        severity: 'warning',
      });
    }
    const newWorkingGraph = {
      graph: prevState.graphRF.graph,
      nodes: [...prevState.graphRF.nodes, newNode],
      links: prevState.graphRF.links,
    };
    prevState.setGraphRF(newWorkingGraph);
    prevState.setRecentGraphs(newWorkingGraph);
    return graph;
  },
});

function calcLabel(inputOutput): string {
  return `${
    existsOrValue(inputOutput.uiProps, 'label', inputOutput.id) as string
  }: ${inputOutput.node as string} ${
    inputOutput.sub_node ? ` -> ${inputOutput.sub_node as string}` : ''
  }`;
}

export default subGraph;
