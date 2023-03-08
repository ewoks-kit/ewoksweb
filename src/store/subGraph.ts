import type { EwoksRFNode, GraphRF, GraphEwoks, GraphNodes } from '../types';
import { toRFEwoksNodes } from '../utils/toRFEwoksNodes';
import { toRFEwoksLinks } from '../utils/toRFEwoksLinks';
import { findAllSubgraphs } from './storeUtils/FindAllSubgraphs';
import { calcCoordinatesFirstNode } from './storeUtils/CalcCoordinatesFirstNode';
import orange2 from 'images/orange2.png';
import type { GetState, SetState } from 'zustand';
import type { State } from '../types';
import { Position } from 'reactflow';

export interface SubGraphSlice {
  subGraph: GraphRF;
  setSubGraph: (graph: GraphEwoks) => Promise<GraphRF>;
}

const subGraph = (
  set: SetState<State>,
  get: GetState<State>
): SubGraphSlice => ({
  subGraph: {
    graph: { id: '', label: '', input_nodes: [], output_nodes: [] },
    nodes: [],
    links: [],
  },

  // DOC: takes a GraphEwoks and transform it to graphRF
  // UWG: replace this with the workingGraph by also passing
  // the new node-graph to add. Does the same and adds a graph?
  setSubGraph: async (subGraphL: GraphEwoks) => {
    // 1. input the graphEwoks from server or file-system
    // 2. search for all subgraphs in it (async)
    const newNodeSubgraphs: GraphEwoks[] = await findAllSubgraphs(
      subGraphL,
      get().recentGraphs
    );

    // 3. Put the newNodeSubgraphs into recent in their graphRF form (sync)
    newNodeSubgraphs.forEach((gr) => {
      // calculate the rfNodes using the fetched subgraphs
      const rfNodes: EwoksRFNode[] = toRFEwoksNodes(
        gr,
        newNodeSubgraphs,
        get().tasks
      );

      get().setRecentGraphs({
        graph: gr.graph,
        nodes: rfNodes,
        links: toRFEwoksLinks(gr, newNodeSubgraphs, get().tasks),
      });
    });
    // 4. Calculate the new graph given the subgraphs
    const grfNodes = toRFEwoksNodes(subGraphL, newNodeSubgraphs, get().tasks);

    const graph = {
      graph: subGraphL.graph,
      nodes: grfNodes,
      links: toRFEwoksLinks(subGraphL, newNodeSubgraphs, get().tasks),
    };
    // Adding a subgraph to an existing workingGraph:
    // save the workingGraph in the recent graphs and add a new graph node to it

    const subToAdd = graph as GraphRF;

    let newNode = {} as EwoksRFNode;
    if (subToAdd) {
      const inputsSub = subToAdd.graph?.input_nodes?.map((input) => {
        return {
          label: calcLabel(input),
          type: 'data ',
        };
      });
      const outputsSub = subToAdd.graph?.output_nodes?.map((output) => {
        return {
          label: calcLabel(output),
          type: 'data ',
        };
      });
      let id = 0;
      let graphId = subToAdd.graph.label || '';
      while (get().graphRF.nodes.some((nod) => nod.id === graphId)) {
        graphId += id++;
      }
      newNode = {
        sourcePosition: Position.Right,
        targetPosition: Position.Left,

        id: graphId,

        type: 'graph',
        position: calcCoordinatesFirstNode(get().graphRF.nodes),

        data: {
          task_props: {
            task_type: 'graph',
            task_identifier: subToAdd.graph.id,
          },
          ui_props: {
            exists: true,
            type: 'internal',

            icon: subToAdd.graph?.uiProps?.icon || orange2,
            inputs: inputsSub,
            outputs: outputsSub,
            withImage: true,
            withLabel: true,
          },

          ewoks_props: {
            label: subToAdd.graph.label,
            default_inputs: [],
            task_generator: '',
            inputs_complete: false,
            default_error_node: false,
            default_error_attributes: {
              map_all_data: true,
              data_mapping: [],
            },
          },
          comment: '',
        },
      };

      get().setRecentGraphs(subToAdd);
    } else {
      get().setOpenSnackbar({
        open: true,
        text: 'Couldnt locate the workingGraph in the recent!',
        severity: 'warning',
      });
    }
    const newWorkingGraph = {
      graph: get().graphRF.graph,
      nodes: [...get().graphRF.nodes, newNode],
      links: get().graphRF.links,
    };
    get().setGraphRF(newWorkingGraph);
    get().setRecentGraphs(newWorkingGraph);
    return graph;
  },
});

function calcLabel(inputOutput: GraphNodes): string {
  return `${inputOutput.uiProps?.label ?? inputOutput.id}: ${
    inputOutput.node
  } ${inputOutput.sub_node ? ` -> ${inputOutput.sub_node}` : ''}`;
}

export default subGraph;
