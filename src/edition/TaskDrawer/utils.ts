import type {
  EwoksRFNode,
  EwoksRFNodeData,
  GraphEwoks,
  GraphNodes,
  Task,
} from '../../types';
import useStore from '../../store/useStore';
import type { Node, Edge, XYPosition } from 'reactflow';
import { Position } from 'reactflow';
import { findAllSubgraphs } from '../../store/storeUtils/FindAllSubgraphs';
import { toRFEwoksNodes } from '../../utils/toRFEwoksNodes';
import { toRFEwoksLinks } from '../../utils/toRFEwoksLinks';

export async function loadSubworkflow(
  subGraph: GraphEwoks,
  nodes: Node[],
  links: Edge[],
  position: XYPosition,
  tasks: Task[]
): Promise<{ nodeWithoutData: Node; data: EwoksRFNodeData }> {
  const { loadedGraphs, addLoadedGraph } = useStore.getState();

  // 1. search for all subgraphs in the added subgraph (async)
  const newNodeSubgraphs: GraphEwoks[] = await findAllSubgraphs(subGraph, [
    ...loadedGraphs.values(),
  ]);

  // 2. Put the newNodeSubgraphs into recent in their graphRF form (sync)
  newNodeSubgraphs.forEach((gr) => {
    // calculate the rfNodes using the fetched subgraphs
    addLoadedGraph({
      graph: gr.graph,
      nodes: toRFEwoksNodes(gr, newNodeSubgraphs, tasks),
      links: toRFEwoksLinks(gr, newNodeSubgraphs, tasks),
    });
  });

  // 3. Create a new node that is a subgraph
  let newNode = {} as EwoksRFNode;

  const inputsSub = subGraph.graph.input_nodes?.map((input) => {
    return {
      label: calcLabel(input),
      type: 'data ',
    };
  });
  const outputsSub = subGraph.graph.output_nodes?.map((output) => {
    return {
      label: calcLabel(output),
      type: 'data ',
    };
  });
  let id = 0;
  let graphId = subGraph.graph.label || '';
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
        task_identifier: subGraph.graph.id,
      },
      ui_props: {
        exists: true,
        type: 'internal',
        ...(inputsSub && inputsSub.length > 0 && { inputs: inputsSub }),
        ...(outputsSub && outputsSub.length > 0 && { outputs: outputsSub }),
      },

      ewoks_props: {
        label: subGraph.graph.label,
      },
    },
  };

  // 4. Calculate the new graph given the subgraphs and added to loadedGraphs
  addLoadedGraph({
    graph: subGraph.graph,
    nodes: toRFEwoksNodes(subGraph, newNodeSubgraphs, tasks),
    links: toRFEwoksLinks(subGraph, newNodeSubgraphs, tasks),
  });

  const { data, ...nodeWithoutData } = newNode;
  return { nodeWithoutData: nodeWithoutData as Node, data };
}

function calcLabel(inputOutput: GraphNodes): string {
  return `${inputOutput.uiProps?.label ?? inputOutput.id}: ${
    inputOutput.node
  } ${inputOutput.sub_node ? ` -> ${inputOutput.sub_node}` : ''}`;
}
