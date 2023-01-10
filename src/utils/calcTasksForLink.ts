import type { EwoksNode, GraphEwoks, Task } from '../types';

// find the outputs-inputs from the connected nodes
export function calcTasksForLink(
  tempGraph: GraphEwoks,
  source: string,
  target: string,
  newNodeSubgraphs: GraphEwoks[],
  tasks: Task[]
): Task[] {
  const sourceTmp = tempGraph.nodes.find((nod) => nod.id === source);
  const targetTmp = tempGraph.nodes.find((nod) => nod.id === target);

  let sourceTask: Task | undefined;
  let targetTask: Task | undefined;

  if (sourceTmp) {
    sourceTask = calcTask('source', sourceTmp, tasks, newNodeSubgraphs);
  }

  if (targetTmp) {
    targetTask = calcTask('target', targetTmp, tasks, newNodeSubgraphs);
  }

  // if not found app does not break, put an empty skeleton
  sourceTask = sourceTask || {
    output_names: [],
  };
  targetTask = targetTask || {
    optional_input_names: [],
    required_input_names: [],
  };

  return [sourceTask, targetTask];
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

  if (subgraphNodeSource?.graph?.output_nodes) {
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
