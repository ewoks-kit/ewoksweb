import type {
  EwoksRFLinkData,
  EwoksRFNodeData,
  GraphEwoks,
  GraphRF,
  Icon,
  Task,
} from './types';
import {
  calcGraphInputsOutputs,
  propIsEmpty,
} from './utils/CalcGraphInputsOutputs';
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
  loadedGraphsIds: string[]
): Promise<GraphEwoks[]> {
  const subgraphIds = graph.nodes
    .filter((nod) => nod.task_type === 'graph')
    .map((nod) => nod.task_identifier);

  if (subgraphIds.length === 0) {
    return [];
  }

  const graphIdsToFetch = subgraphIds.filter(
    (id) =>
      id && !loadedGraphsIds.some((loadedGraphsId) => id === loadedGraphsId)
  );

  try {
    const subgraphResponses = await Promise.all(
      graphIdsToFetch.map(fetchWorkflow)
    );
    return subgraphResponses.map((resp) => resp.data);
  } catch (error) {
    // TODO: remove after handling the error
    // eslint-disable-next-line no-console
    console.log('AXIOS ERROR', error);
    return [];
  }
}

export function rfToEwoks(tempGraph: GraphRF): GraphEwoks {
  // calculate input_nodes-output_nodes nodes from graphInput-graphOutput
  let graph = calcGraphInputsOutputs(tempGraph);
  const noteNodes = calcNoteNodes(tempGraph);
  const uiprops = { ...graph.uiProps, notes: noteNodes };

  graph = {
    ...graph,
    ...(propIsEmpty(uiprops) && {
      uiProps: uiprops,
    }),
  };

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
