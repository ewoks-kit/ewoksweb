import type {
  EwoksRFLink,
  EwoksRFNode,
  EwoksRFNodeData,
  GraphEwoks,
  GraphNodes,
  GraphRF,
  Task,
} from '../../types';
import useStore from '../../store/useStore';
import type { Node, Edge, XYPosition } from 'reactflow';
import { Position } from 'reactflow';
import { findAllSubgraphs } from '../../store/storeUtils/FindAllSubgraphs';
import { toRFEwoksNodes } from '../../utils/toRFEwoksNodes';
import { toRFEwoksLinks } from '../../utils/toRFEwoksLinks';
import { EMPTY_RF_GRAPH } from '../../utils/emptyGraphs';
import useNodeDataStore from '../../store/useNodeDataStore';

export async function loadSubworkflow(
  subGraphL: GraphEwoks,
  nodes: Node[],
  links: Edge[],
  position: XYPosition,
  tasks: Task[]
): Promise<{ nodeWithoutData: Node; data: EwoksRFNodeData }> {
  const { loadedGraphs, addLoadedGraph } = useStore.getState();

  // 1. input the graphEwoks from server or file-system
  // 2. search for all subgraphs in it (async)
  const newNodeSubgraphs: GraphEwoks[] = await findAllSubgraphs(subGraphL, [
    ...loadedGraphs.values(),
  ]);

  // 3. Put the newNodeSubgraphs into recent in their graphRF form (sync)
  newNodeSubgraphs.forEach((gr) => {
    // calculate the rfNodes using the fetched subgraphs
    const rfNodes: EwoksRFNode[] = toRFEwoksNodes(gr, newNodeSubgraphs, tasks);

    addLoadedGraph({
      graph: gr.graph,
      nodes: rfNodes,
      links: toRFEwoksLinks(gr, newNodeSubgraphs, tasks),
    });
  });
  // 4. Calculate the new graph given the subgraphs
  const grfNodes = toRFEwoksNodes(subGraphL, newNodeSubgraphs, tasks);

  const graph = {
    graph: subGraphL.graph,
    nodes: grfNodes,
    links: toRFEwoksLinks(subGraphL, newNodeSubgraphs, tasks),
  };
  // Adding a subgraph to the rootWorkflow:
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
    position,
    data: {
      task_props: {
        task_type: 'graph',
        task_identifier: subToAdd.graph.id,
      },
      ui_props: {
        exists: true,
        type: 'internal',
        inputs: inputsSub,
        outputs: outputsSub,
      },

      ewoks_props: {
        label: subToAdd.graph.label,
      },
    },
  };

  addLoadedGraph(subToAdd);

  const newWorkingGraph = {
    graph: EMPTY_RF_GRAPH.graph,
    nodes: [...nodes, newNode] as EwoksRFNode[],
    links: links as EwoksRFLink[],
  };

  useNodeDataStore.getState().setNodeData(newNode.id, newNode.data);

  addLoadedGraph(newWorkingGraph);
  const { data, ...nodeWithoutData } = newNode;
  return { nodeWithoutData: nodeWithoutData as Node, data };
}

function calcLabel(inputOutput: GraphNodes): string {
  return `${inputOutput.uiProps?.label ?? inputOutput.id}: ${
    inputOutput.node
  } ${inputOutput.sub_node ? ` -> ${inputOutput.sub_node}` : ''}`;
}
