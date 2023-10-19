import type { Edge, Node } from 'reactflow';

import { fetchWorkflow } from './api/workflows';
import { curateEdgeData, curateNodeData } from './edition/TopAppBar/utils';
import { enrichWithData } from './general/forms/utils';
import orange3 from './images/orange3.png';
import useEdgeDataStore from './store/useEdgeDataStore';
import useNodeDataStore from './store/useNodeDataStore';
import type { GraphDetails, Icon, LinkData, NodeData, Workflow } from './types';
import { calcEwoksGraphProp } from './utils/CalcGraphInputsOutputs';
import { calcNoteNodes } from './utils/calcNoteNodes';
import { toEwoksLinks } from './utils/toEwoksLinks';
import { toEwoksNodes } from './utils/toEwoksNodes';
import { hasMessage, isEwoksServerErrorResponse } from './utils/typeGuards';
import { propIsEmpty } from './utils/utils';

export const DEFAULT_ICON: Icon = { name: 'orange3.png', data_url: orange3 };

export async function getSubgraphs(graph: Workflow): Promise<Workflow[]> {
  const subgraphIds = graph.nodes
    .filter((nod) => nod.task_type === 'graph')
    .map((nod) => nod.task_identifier);

  if (subgraphIds.length === 0) {
    return [];
  }

  // const graphIdsToFetch = subgraphIds.filter(
  //   (id) =>
  //     id && !loadedGraphsIds.some((loadedGraphsId) => id === loadedGraphsId),
  // );

  try {
    const subgraphResponses = await Promise.all(subgraphIds.map(fetchWorkflow));
    return subgraphResponses.map((resp) => resp.data);
  } catch (error) {
    // TODO: remove after handling the error
    // eslint-disable-next-line no-console
    console.log('AXIOS ERROR', error);
    return [];
  }
}

export function prepareEwoksGraph(
  graphInfo: GraphDetails,
  nodesWithoutData: Node[],
  edgesWithoutData: Edge[],
  rawNodeData: Map<string, NodeData>,
  rawLinkData: Map<string, LinkData>,
): Workflow {
  const nodeData = curateNodeData(rawNodeData);
  const nodes = nodesWithoutData.map((node) => enrichWithData(node, nodeData));

  const linkData = curateEdgeData(rawLinkData);
  const links = edgesWithoutData.map((edge) => enrichWithData(edge, linkData));

  let graph = calcEwoksGraphProp({ graph: graphInfo, nodes, links });
  const noteNodes = calcNoteNodes(nodes);
  const uiprops =
    noteNodes.length > 0
      ? { ...graph.uiProps, notes: noteNodes }
      : graph.uiProps;

  graph = {
    ...graph,
    ...(propIsEmpty(uiprops) && {
      uiProps: uiprops,
    }),
  };

  return {
    graph,
    nodes: toEwoksNodes(nodes),
    links: toEwoksLinks(links),
  };
}

export function findImage(img: string | undefined, allIcons: Icon[]): string {
  if (!img) {
    return DEFAULT_ICON.data_url;
  }

  const icon = allIcons.find((ico) => ico.name === img);
  if (!icon) {
    return DEFAULT_ICON.data_url;
  }

  return icon.data_url;
}

export function textForError(error: unknown, alternative: string): string {
  if (isEwoksServerErrorResponse(error)) {
    return error.response.data.message;
  }

  if (hasMessage(error)) {
    return error.message;
  }

  return alternative;
}

export function getNodesData(): Map<string, NodeData> {
  return useNodeDataStore.getState().nodesData;
}

export function getNodeData(id: string): NodeData | undefined {
  return useNodeDataStore.getState().nodesData.get(id);
}

export function getEdgesData(): Map<string, LinkData> {
  return useEdgeDataStore.getState().edgesData;
}

export function getEdgeData(id: string): LinkData | undefined {
  return useEdgeDataStore.getState().edgesData.get(id);
}

export function getTaskName(task_identifier: string): string {
  const task_members = task_identifier.split('.');

  if (task_members.length === 0) {
    return task_identifier;
  }

  return task_members[task_members.length - 1];
}
