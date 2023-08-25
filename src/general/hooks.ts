import type {
  EwoksRFLink,
  EwoksRFNode,
  EwoksRFNodeData,
  GraphEwoks,
  GraphNodes,
  GraphRF,
  Task,
} from '../types';
import useStore from '../store/useStore';
import { isString } from '../utils/typeGuards';
import type { Node, Edge, XYPosition } from 'reactflow';
import { Position } from 'reactflow';
import { findAllSubgraphs } from '../store/storeUtils/FindAllSubgraphs';
import { toRFEwoksNodes } from '../utils/toRFEwoksNodes';
import { toRFEwoksLinks } from '../utils/toRFEwoksLinks';
import { EMPTY_RF_GRAPH } from '../utils/emptyGraphs';
import useNodeDataStore from '../store/useNodeDataStore';

function tryJSONparse(str: string | ArrayBuffer | null): unknown {
  if (!isString(str)) {
    return null;
  }
  try {
    return JSON.parse(str);
  } catch (error) {
    /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
    console.warn(error);
    return null;
  }
}

export function useLoadGraph(onGraphLoad: (graph: GraphEwoks) => void) {
  return async (file: File) => {
    const { graphInfo, workingGraph, setOpenSnackbar } = useStore.getState();

    if (workingGraph.graph.id !== graphInfo.id) {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to add a new node-graph to any sub-graph!',
        severity: 'error',
      });
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      const { result } = reader;

      const newGraph = tryJSONparse(result);
      if (!newGraph) {
        setOpenSnackbar({
          open: true,
          text: 'Error in JSON structure. Please correct input file and retry!',
          severity: 'error',
        });
        return;
      }

      onGraphLoad(newGraph as GraphEwoks);
    };
    reader.readAsText(file);
  };
}

export async function useLoadSubworkflow(
  subGraphL: GraphEwoks,
  nodes: Node[],
  links: Edge[],
  position: XYPosition,
  tasks: Task[]
): Promise<{ nodeWithoutData: Node; data: EwoksRFNodeData }> {
  const { recentGraphs, addRecentGraph } = useStore.getState();
  // const recentGraphs = useStore((state) => state.recentGraphs);

  // 1. input the graphEwoks from server or file-system
  // 2. search for all subgraphs in it (async)
  const newNodeSubgraphs: GraphEwoks[] = await findAllSubgraphs(
    subGraphL,
    recentGraphs
  );

  // 3. Put the newNodeSubgraphs into recent in their graphRF form (sync)
  newNodeSubgraphs.forEach((gr) => {
    // calculate the rfNodes using the fetched subgraphs
    const rfNodes: EwoksRFNode[] = toRFEwoksNodes(gr, newNodeSubgraphs, tasks);

    addRecentGraph({
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
    position,
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

  addRecentGraph(subToAdd);

  const newWorkingGraph = {
    graph: EMPTY_RF_GRAPH.graph,
    nodes: [...nodes, newNode] as EwoksRFNode[],
    links: links as EwoksRFLink[],
  };

  useNodeDataStore.getState().setNodeData(newNode.id, newNode.data);

  addRecentGraph(newWorkingGraph);
  const { data, ...nodeWithoutData } = newNode;
  return { nodeWithoutData: nodeWithoutData as Node, data };
}

function calcLabel(inputOutput: GraphNodes): string {
  return `${inputOutput.uiProps?.label ?? inputOutput.id}: ${
    inputOutput.node
  } ${inputOutput.sub_node ? ` -> ${inputOutput.sub_node}` : ''}`;
}
