import type {
  EwoksRFNode,
  GraphEwoks,
  GraphRF,
  WorkflowDescription,
} from './types';
import axios from 'axios';
import { calcGraphInputsOutputs } from './utils/CalcGraphInputsOutputs';
import { toEwoksLinks } from './utils/toEwoksLinks';
import { toEwoksNodes } from './utils/toEwoksNodes';
import { calcNoteNodes } from './utils/calcNoteNodes';
import { getWorkflowsDescriptions, getWorkflow } from './utils/api';
import orange2 from 'images/orange2.png';

export const ewoksNetwork = {};

export async function getWorkflows(): Promise<WorkflowDescription[]> {
  let res = [];
  try {
    const workflows = await getWorkflowsDescriptions();
    if (workflows && workflows.data) {
      const workf: { items: WorkflowDescription[] } = workflows.data;
      res = workf.items;
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // Keep logging in console for debugging when talking with a user
      /* eslint-disable no-console */
      console.log(
        error.response.data,
        error.response.status,
        error.response.headers
      );
    } else if (error.request) {
      // The request was made but no response was received
      /* eslint-disable no-console */
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      /* eslint-disable no-console */
      console.log('Error', error.message);
    }
    /* eslint-disable no-console */
    console.log(error);
    // This is used to be able to use the Snackbar and inform the user
    // since it cannot be done from a ts file (?). A custom Hook maybe to remove it?
    // TODO: pass an onError callback to the function or return an error field in the
    // result that would be checked by the consumer as in !95
    res = [{ label: 'network error', category: error?.response?.status }];
  }
  return res;
}

export async function getSubgraphs(
  graph: GraphEwoks | GraphRF,
  recentGraphs: GraphRF[]
): Promise<GraphEwoks[]> {
  const nodes: EwoksRFNode[] = [...graph.nodes];
  const existingNodeSubgraphs = nodes.filter(
    (nod) => nod.task_type === 'graph'
  );
  let results = [] as GraphEwoks[];
  if (existingNodeSubgraphs.length > 0) {
    // there are subgraphs -> first search in the recentGraphs for them
    const notInRecent = [];
    existingNodeSubgraphs.forEach((graph) => {
      if (
        recentGraphs.filter((gr) => gr.graph.id === graph.task_identifier)
          .length === 0
      ) {
        // add them in an array to request them from the server
        notInRecent.push(graph.task_identifier);
      }
    });
    // For those that are not in recent get them from the server
    results = await axios
      .all(notInRecent.map((id: string) => getWorkflow(id)))
      .then(
        axios.spread((...res) => {
          // all requests are now complete in an array
          // if there is a null means the subgraph was not found
          // and it should show up in red
          const resCln = res.filter((result) => result.data !== null);
          return resCln.map((result) => result.data) as GraphEwoks[];
        })
      )
      .catch((error) => {
        // TODO: remove after handling the error
        console.log('AXIOS ERROR', error);
        return [];
      });
  }
  return results ? results : [];
}

export function rfToEwoks(tempGraph: GraphRF): GraphEwoks {
  // calculate input_nodes-output_nodes nodes from graphInput-graphOutput
  const graph = calcGraphInputsOutputs(tempGraph);
  const noteNodes = calcNoteNodes(tempGraph);
  graph.uiProps.notes = noteNodes;

  // DOC: remove "fromServer" which is for UIs internal use
  if (graph.uiProps?.source) {
    delete graph.uiProps?.source;
  }

  return {
    graph,
    nodes: toEwoksNodes(tempGraph.nodes),
    links: toEwoksLinks(tempGraph.links),
  };
}

export function findImage(img: string, allIcons) {
  const icon = allIcons.find((ico) => ico.name === img);

  return icon?.image?.data_url || orange2;
}
