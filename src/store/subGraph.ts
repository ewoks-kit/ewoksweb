import type {
  EwoksRFNode,
  GraphRF,
  GraphEwoks,
  GraphNodes,
  EwoksRFLink,
  EwoksRFNodeData,
} from '../types';
import { toRFEwoksNodes } from '../utils/toRFEwoksNodes';
import { toRFEwoksLinks } from '../utils/toRFEwoksLinks';
import { findAllSubgraphs } from './storeUtils/FindAllSubgraphs';
import type { GetState, SetState } from 'zustand';
import type { State } from '../types';
import { Position } from 'reactflow';
import type { Node, Edge, XYPosition } from 'reactflow';
import useNodeDataStore from './useNodeDataStore';
import { EMPTY_RF_GRAPH } from '../utils/emptyGraphs';

export interface SubGraphSlice {
  subGraph: GraphRF;
  setSubGraph: (
    graph: GraphEwoks,
    nodes: Node[],
    links: Edge[],
    subgraphPosition: XYPosition
  ) => Promise<{ nodeWithoutData: Node; data: EwoksRFNodeData }>;
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
  setSubGraph: async (subGraphL, nodes, links, subgraphPosition) => {
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

      get().addRecentGraph({
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

    const inputsSub = subToAdd.graph.input_nodes?.map((input) => {
      return {
        label: calcLabel(input),
        type: 'data ',
      };
    });
    const outputsSub = subToAdd.graph.output_nodes?.map((output) => {
      return {
        label: calcLabel(output),
        type: 'data ',
      };
    });
    let id = 0;
    let graphId = subToAdd.graph.label || '';
    while (nodes.some((nod) => nod.id === graphId)) {
      graphId += id++;
    }
    newNode = {
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      id: graphId,
      // TODO: Is this type the same with task_props.task_type? Is it used?
      type: 'graph',
      position: subgraphPosition,
      data: {
        task_props: {
          task_type: 'graph',
          task_identifier: subToAdd.graph.id,
        },
        ui_props: {
          exists: true,
          type: 'internal',
          icon: subToAdd.graph.uiProps?.icon,
          inputs: inputsSub,
          outputs: outputsSub,
          withImage: true,
          withLabel: true,
        },

        ewoks_props: {
          label: subToAdd.graph.label,
          default_inputs: [],
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

    get().addRecentGraph(subToAdd);

    const newWorkingGraph = {
      graph: EMPTY_RF_GRAPH.graph,
      nodes: [...nodes, newNode] as EwoksRFNode[],
      links: links as EwoksRFLink[],
    };

    useNodeDataStore.getState().setNodeData(newNode.id, newNode.data);

    get().addRecentGraph(newWorkingGraph);
    const { data, ...nodeWithoutData } = newNode;
    return { nodeWithoutData: nodeWithoutData as Node, data };
  },
});

function calcLabel(inputOutput: GraphNodes): string {
  return `${inputOutput.uiProps?.label ?? inputOutput.id}: ${
    inputOutput.node
  } ${inputOutput.sub_node ? ` -> ${inputOutput.sub_node}` : ''}`;
}

export default subGraph;
