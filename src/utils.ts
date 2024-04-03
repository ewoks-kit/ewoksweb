import type { Edge, Node } from 'reactflow';

import { fetchWorkflow } from './api/workflows';
import { curateEdgeData, curateNodeData } from './edition/TopAppBar/utils';
import { enrichWithData } from './general/forms/utils';
import orange3 from './images/orange3.png';
import useEdgeDataStore from './store/useEdgeDataStore';
import useNodeDataStore from './store/useNodeDataStore';
import type {
  EwoksNode,
  GraphDetails,
  Icon,
  LinkData,
  NodeData,
  Workflow,
} from './types';
import {
  computeInputNodes,
  computeOutputNodes,
  enrichUiPropsWithNotes,
} from './utils/specialNodes';
import { toEwoksLinks } from './utils/toEwoksLinks';
import { toEwoksNodes } from './utils/toEwoksNodes';
import {
  hasMessage,
  hasRequest,
  isEwoksServerErrorResponse,
} from './utils/typeGuards';
import { isEmpty } from './utils/utils';

export const DEFAULT_ICON: Icon = { name: 'orange3.png', data_url: orange3 };

export async function getSubgraphs(nodes: EwoksNode[]): Promise<Workflow[]> {
  const subgraphIds = nodes
    .filter((node) => node.task_type === 'graph')
    .map((node) => node.task_identifier);

  if (subgraphIds.length === 0) {
    return [];
  }

  try {
    return await Promise.all(subgraphIds.map(fetchWorkflow));
  } catch (error) {
    // TODO: remove after handling the error
    // eslint-disable-next-line no-console
    console.log('AXIOS ERROR', error);
    return [];
  }
}

export function prepareEwoksGraph(
  rawGraphInfo: GraphDetails,
  nodesWithoutData: Node[],
  edgesWithoutData: Edge[],
  rawNodeData: Map<string, NodeData>,
  rawLinkData: Map<string, LinkData>,
): Workflow {
  const nodeData = curateNodeData(rawNodeData);
  const nodes = nodesWithoutData.map((node) => enrichWithData(node, nodeData));

  const linkData = curateEdgeData(rawLinkData);
  const links = edgesWithoutData.map((edge) => enrichWithData(edge, linkData));

  const graphInfo: GraphDetails = {
    ...rawGraphInfo,
    input_nodes: computeInputNodes(nodes, links),
    output_nodes: computeOutputNodes(nodes, links),
    uiProps: enrichUiPropsWithNotes(rawGraphInfo.uiProps, nodes),
  };

  return {
    graph: curateGraphInfo(graphInfo),
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

  // The request was made but no response was received
  // See https://github.com/axios/axios#handling-errors
  if (hasRequest(error)) {
    return 'Server is unreachable! Make sure ewoksserver is up and accessible before trying again.';
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

function curateGraphInfo(rawInfo: GraphDetails) {
  return {
    id: rawInfo.id,
    ...(rawInfo.label && { label: rawInfo.label }),
    ...(rawInfo.category && {
      category: rawInfo.category,
    }),
    ...(!isEmpty(rawInfo.input_nodes) && {
      input_nodes: rawInfo.input_nodes,
    }),
    ...(!isEmpty(rawInfo.output_nodes) && {
      output_nodes: rawInfo.output_nodes,
    }),
    ...(!isEmpty(rawInfo.uiProps) && {
      uiProps: { ...rawInfo.uiProps },
    }),
    ...(!isEmpty(rawInfo.keywords) && {
      keywords: rawInfo.keywords,
    }),
    ...(!isEmpty(rawInfo.input_schema) && {
      input_schema: rawInfo.input_schema,
    }),
    ...(!isEmpty(rawInfo.ui_schema) && {
      ui_schema: rawInfo.ui_schema,
    }),
    ...(!isEmpty(rawInfo.execute_arguments) && {
      execute_arguments: rawInfo.execute_arguments,
    }),
    ...(!isEmpty(rawInfo.worker_options) && {
      worker_options: rawInfo.worker_options,
    }),
  };
}
