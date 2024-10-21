import type { Edge, Node } from '@xyflow/react';

import { fetchWorkflow } from './api/workflows';
import { curateEdgeData, curateNodeData } from './edition/TopAppBar/utils';
import { enrichWithData } from './general/forms/utils';
import orange3 from './images/orange3.png';
import useEdgeDataStore from './store/useEdgeDataStore';
import useNodeDataStore from './store/useNodeDataStore';
import useSnackbarStore from './store/useSnackbarStore';
import type {
  EdgeWithData,
  EwoksNode,
  GraphDetails,
  Icon,
  LinkData,
  NodeData,
  NodeWithData,
  Task,
  Workflow,
} from './types';
import {
  computeInputNodes,
  computeNotes,
  computeOutputNodes,
} from './utils/specialNodes';
import { toEwoksLinks } from './utils/toEwoksLinks';
import { toEwoksNodes } from './utils/toEwoksNodes';
import {
  hasMessage,
  hasRequest,
  isEwoksServerErrorResponse,
  isString,
} from './utils/typeGuards';
import { hasDefinedFields } from './utils/utils';

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

export function toEwoksWorkflow(
  graphDetails: GraphDetails,
  nodesWithoutData: Node[],
  edgesWithoutData: Edge[],
  rawNodeData: Map<string, NodeData>,
  rawLinkData: Map<string, LinkData>,
): Workflow {
  const nodeData = curateNodeData(rawNodeData);
  const nodes = nodesWithoutData.map((node) => enrichWithData(node, nodeData));

  const linkData = curateEdgeData(rawLinkData);
  const links = edgesWithoutData.map((edge) => enrichWithData(edge, linkData));

  return {
    graph: toEwoksGraph(graphDetails, nodes, links),
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

export function getTaskName(task: Task): string {
  const { task_identifier, task_type } = task;
  const task_members = task_identifier.split('.');

  if (task_members.length === 0) {
    return task_identifier;
  }

  if (task_type === 'ppfmethod') {
    // ppfmethod are all called run so we use the module name instead
    return task_members[task_members.length - 2];
  }

  return task_members[task_members.length - 1];
}

function toEwoksGraph(
  details: GraphDetails,
  nodes: NodeWithData[],
  links: EdgeWithData[],
): GraphDetails {
  const input_nodes = computeInputNodes(nodes, links);
  const output_nodes = computeOutputNodes(nodes, links);
  const notes = computeNotes(nodes);
  const uiProps =
    notes.length > 0 ? { ...details.uiProps, notes } : details.uiProps;

  return {
    id: details.id,
    ...(details.label && { label: details.label }),
    ...(details.category && {
      category: details.category,
    }),
    ...(hasDefinedFields(input_nodes) && {
      input_nodes,
    }),
    ...(hasDefinedFields(output_nodes) && {
      output_nodes,
    }),
    ...(hasDefinedFields(uiProps) && {
      uiProps,
    }),
    ...(hasDefinedFields(details.keywords) && {
      keywords: details.keywords,
    }),
    ...(hasDefinedFields(details.input_schema) && {
      input_schema: details.input_schema,
    }),
    ...(hasDefinedFields(details.ui_schema) && {
      ui_schema: details.ui_schema,
    }),
    ...(hasDefinedFields(details.execute_arguments) && {
      execute_arguments: details.execute_arguments,
    }),
    ...(hasDefinedFields(details.worker_options) && {
      worker_options: details.worker_options,
    }),
  };
}

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

export function loadGraphFromFile(onGraphLoad: (graph: Workflow) => void) {
  return async (file: File) => {
    const { showErrorMsg } = useSnackbarStore.getState();

    const reader = new FileReader();

    reader.onloadend = async () => {
      const { result } = reader;

      const newGraph = tryJSONparse(result);
      if (!newGraph) {
        showErrorMsg(
          'Error in JSON structure. Please correct input file and retry!',
        );
        return;
      }

      onGraphLoad(newGraph as Workflow);
    };
    reader.readAsText(file);
  };
}
