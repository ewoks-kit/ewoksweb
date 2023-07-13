import type { EwoksNode, GraphEwoks, Task } from '../types';

export function findLinkInputs(
  nodes: EwoksNode[],
  sourceNodeId: string,
  newNodeSubgraphs: GraphEwoks[],
  tasks: Task[]
): string[] {
  const sourceNode = nodes.find((nod) => nod.id === sourceNodeId);

  if (!sourceNode) {
    return [];
  }

  const sourceTask = calcTask('source', sourceNode, tasks, newNodeSubgraphs);
  return sourceTask?.output_names || [];
}

export function findLinkOutputs(
  nodes: EwoksNode[],
  targetNodeId: string,
  newNodeSubgraphs: GraphEwoks[],
  tasks: Task[]
): { required: string[]; optional: string[] } {
  const targetNode = nodes.find((nod) => nod.id === targetNodeId);

  if (!targetNode) {
    return { required: [], optional: [] };
  }

  const targetTask = calcTask('target', targetNode, tasks, newNodeSubgraphs);

  return {
    required: targetTask?.required_input_names || [],
    optional: targetTask?.optional_input_names || [],
  };
}

function calcTask(
  sourceOrTarget: 'source' | 'target',
  node: EwoksNode,
  tasks: Task[],
  newNodeSubgraphs: GraphEwoks[]
): Task | undefined {
  if (node.task_type !== 'graph') {
    return tasks.find((tas) => tas.task_identifier === node.task_identifier);
  }

  const subgraphNodeSource = newNodeSubgraphs.find(
    (subGr) => subGr.graph.id === node.task_identifier
  );

  const outputsOrOutputs: string[] = [];

  if (subgraphNodeSource?.graph.output_nodes) {
    subgraphNodeSource.graph.output_nodes.forEach((out) =>
      outputsOrOutputs.push(out.id)
    );
  }

  if (sourceOrTarget === 'source') {
    return {
      task_type: node.task_type,
      task_identifier: node.task_identifier,
      output_names: outputsOrOutputs,
    };
  }

  return {
    task_type: node.task_type,
    task_identifier: node.task_identifier,
    optional_input_names: outputsOrOutputs,
    required_input_names: [],
  };
}
