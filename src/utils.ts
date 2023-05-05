import type {
  EwoksRFLinkData,
  EwoksRFNodeData,
  GraphEwoks,
  GraphRF,
  Icon,
  WorkflowDescription,
} from './types';
import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import { calcGraphInputsOutputs } from './utils/CalcGraphInputsOutputs';
import { toEwoksLinks } from './utils/toEwoksLinks';
import { toEwoksNodes } from './utils/toEwoksNodes';
import { calcNoteNodes } from './utils/calcNoteNodes';
import { getWorkflowsDescriptions, getWorkflow } from './api/api';
import orange3 from 'images/orange3.png';
import { isEwoksServerErrorResponse } from './utils/typeGuards';
import useNodeDataStore from './store/useNodeDataStore';
import useEdgeDataStore from './store/useEdgeDataStore';

const DEFAULT_ICON = orange3;

export async function getWorkflows(): Promise<WorkflowDescription[]> {
  let res: WorkflowDescription[] = [];
  try {
    const workflows = await getWorkflowsDescriptions();
    const workf: { items: WorkflowDescription[] } = workflows.data;
    res = workf.items;
  } catch (error) {
    const err = error as AxiosError;
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // Keep logging in console for debugging when talking with a user
      /* eslint-disable no-console */
      console.log(err.response.data, err.response.status, err.response.headers);
    } else if (err.request) {
      // The request was made but no response was received
      /* eslint-disable no-console */
      console.log(err.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      /* eslint-disable no-console */
      console.log('Error', err.message);
    }
    /* eslint-disable no-console */
    console.log(error);
    // This is used to be able to use the Snackbar and inform the user
    // since it cannot be done from a ts file (?). A custom Hook maybe to remove it?
    // TODO: pass an onError callback to the function or return an error field in the
    // result that would be checked by the consumer as in !95
    res = [
      {
        id: 'network error',
        label: 'network error',
        category: err.response?.status.toString(),
      },
    ];
  }
  return res;
}

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
      .all(notInRecent.map((id: string) => getWorkflow(id)))
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
  console.log(tempGraph.nodes);

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

  return icon?.image?.data_url || DEFAULT_ICON;
}

export function textForError(error: unknown, alternative: string): string {
  if (isEwoksServerErrorResponse(error)) {
    return error.response.data.message;
  }

  if (axios.isAxiosError(error)) {
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
