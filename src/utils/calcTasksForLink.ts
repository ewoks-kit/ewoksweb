import type { EwoksNode, Workflow } from '../ewoksTypes';
import type { Task } from '../types';
import { getSubgraphInputs, getSubgraphOutputs } from './subgraphUtils';

export function findLinkInputs(
  nodes: EwoksNode[],
  sourceNodeId: string,
  subgraphs: Workflow[],
  tasks: Task[],
): string[] {
  const sourceNode = nodes.find((nod) => nod.id === sourceNodeId);

  if (!sourceNode) {
    return [];
  }

  if (sourceNode.task_type === 'graph') {
    return getSubgraphOutputs(sourceNode, subgraphs);
  }

  const task = tasks.find(
    (tas) => tas.task_identifier === sourceNode.task_identifier,
  );
  return task?.output_names || [];
}

export function findLinkOutputs(
  nodes: EwoksNode[],
  targetNodeId: string,
  subgraphs: Workflow[],
  tasks: Task[],
): { required: string[]; optional: string[] } {
  const targetNode = nodes.find((nod) => nod.id === targetNodeId);

  if (!targetNode) {
    return { required: [], optional: [] };
  }

  if (targetNode.task_type === 'graph') {
    return getSubgraphInputs(targetNode, subgraphs);
  }

  const task = tasks.find(
    (tas) => tas.task_identifier === targetNode.task_identifier,
  );
  return {
    required: task?.required_input_names || [],
    optional: task?.optional_input_names || [],
  };
}
