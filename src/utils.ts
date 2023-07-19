import type {
  EwoksRFLinkData,
  EwoksRFNodeData,
  GraphEwoks,
  GraphRF,
  Icon,
  Task,
} from './types';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { calcGraphInputsOutputs } from './utils/CalcGraphInputsOutputs';
import { toEwoksLinks } from './utils/toEwoksLinks';
import { toEwoksNodes } from './utils/toEwoksNodes';
import { calcNoteNodes } from './utils/calcNoteNodes';
import { fetchWorkflow } from './api/workflows';
import orange3 from 'images/orange3.png';
import { isEwoksServerErrorResponse } from './utils/typeGuards';
import useNodeDataStore from './store/useNodeDataStore';
import useEdgeDataStore from './store/useEdgeDataStore';

const DEFAULT_ICON = orange3;

export async function getSubgraphs(
  graph: GraphEwoks,
  recentGraphIds: string[]
): Promise<GraphEwoks[]> {
  const existingNodeSubgraphs = graph.nodes.filter(
    (nod) => nod.task_type === 'graph'
  );
  let results: GraphEwoks[] = [];
  if (existingNodeSubgraphs.length > 0) {
    // there are subgraphs -> first search in the recentGraphs for them
    const notInRecent: string[] = [];
    existingNodeSubgraphs.forEach((graphL) => {
      if (!recentGraphIds.some((id) => id === graphL.task_identifier)) {
        // add them in an array to request them from the server
        notInRecent.push(graphL.task_identifier);
      }
    });
    // For those that are not in recent get them from the server
    results = await axios
      .all(notInRecent.map((id: string) => fetchWorkflow(id)))
      .then(
        axios.spread((...res: AxiosResponse<GraphEwoks | null, unknown>[]) => {
          const graphs: (GraphEwoks | null)[] = [...res].map((re) => re.data);
          // all requests are now complete in an array
          // if there is a null means the subgraph was not found
          // and it should show up in red
          return graphs.reduce<GraphEwoks[]>((acc, data) => {
            return data !== null ? [...acc, data] : acc;
          }, []);
        })
      )
      .catch((error) => {
        // TODO: remove after handling the error
        console.log('AXIOS ERROR', error);
        return [];
      });
  }
  return results;
}

export function rfToEwoks(tempGraph: GraphRF): GraphEwoks {
  // calculate input_nodes-output_nodes nodes from graphInput-graphOutput
  let graph = calcGraphInputsOutputs(tempGraph);
  const noteNodes = calcNoteNodes(tempGraph);
  graph = { ...graph, uiProps: { ...graph.uiProps, notes: noteNodes } };

  // DOC: remove "fromServer" which is for UIs internal use
  if (graph.uiProps?.source) {
    delete graph.uiProps.source;
  }

  return {
    graph,
    nodes: toEwoksNodes(tempGraph.nodes),
    links: toEwoksLinks(tempGraph.links),
  };
}

export function findImage(img: string | undefined, allIcons: Icon[]): string {
  if (!img) {
    return DEFAULT_ICON;
  }

  const icon = allIcons.find((ico) => ico.name === img);
  if (!icon) {
    return DEFAULT_ICON;
  }

  return icon.data_url;
}

export function textForError(error: unknown, alternative: string): string {
  if (isEwoksServerErrorResponse(error)) {
    return error.response.data.message;
  }

  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return alternative;
}

export function getNodesData(): Map<string, EwoksRFNodeData> {
  return useNodeDataStore.getState().nodesData;
}

export function getNodeData(id: string): EwoksRFNodeData | undefined {
  return useNodeDataStore.getState().nodesData.get(id);
}

export function getEdgesData(): Map<string, EwoksRFLinkData> {
  return useEdgeDataStore.getState().edgesData;
}

export function getEdgeData(id: string): EwoksRFLinkData | undefined {
  return useEdgeDataStore.getState().edgesData.get(id);
}

export function getTaskName(task: Task): string {
  const { task_identifier } = task;

  const task_members = task_identifier.split('.');

  if (task_members.length === 0) {
    return task_identifier;
  }

  return task_members[task_members.length - 1];
}
