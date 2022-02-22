import type { GraphEwoks, Task } from '../types';

// find the outputs-inputs from the connected nodes
export function calcTasksForLink(
  tempGraph: GraphEwoks,
  source: string,
  target: string,
  newNodeSubgraphs,
  tasks: Task[]
): Task[] {
  const sourceTmp = tempGraph.nodes.find((nod) => nod.id === source);
  const targetTmp = tempGraph.nodes.find((nod) => nod.id === target);
  // TODO? if undefined source or/and target node does not exist

  let sourceTask = {} as Task;
  let targetTask = {} as Task;

  if (sourceTmp) {
    if (sourceTmp.task_type !== 'graph') {
      // TODO: if a task find it in tasks. IF NOT THERE?
      sourceTask = tasks.find(
        (tas) => tas.task_identifier === sourceTmp.task_identifier
      );
    } else {
      // TODO following line exuiProps.commentamine
      // if node=subgraph calculate inputs-outputs from subgraph.graph
      const subgraphNodeSource = newNodeSubgraphs.find(
        (subGr) => subGr.graph.id === sourceTmp.task_identifier
      );

      const outputs = [];

      if (subgraphNodeSource) {
        subgraphNodeSource.graph.output_nodes.forEach((out) =>
          outputs.push(out.id)
        );
      }
      sourceTask = {
        task_type: sourceTmp.task_type,
        task_identifier: sourceTmp.task_identifier,
        output_names: outputs,
      };
    }
  }

  if (targetTmp) {
    if (targetTmp.task_type !== 'graph') {
      // TODO: if a task find it in tasks. IF NOT THERE? add a default?
      targetTask = tasks.find(
        (tas) => tas.task_identifier === targetTmp.task_identifier
      );
    } else {
      // TODO following line examine
      const subgraphNodeTarget = newNodeSubgraphs.find(
        (subGr) => subGr.graph.id === targetTmp.task_identifier
      );
      // if subgraphNodeTarget undefined = not fount
      const inputs = [];
      if (subgraphNodeTarget) {
        subgraphNodeTarget.graph.input_nodes.forEach((inp) =>
          inputs.push(inp.id)
        );
      }

      targetTask = {
        task_type: targetTmp.task_type,
        task_identifier: targetTmp.task_identifier,
        optional_input_names: inputs,
        required_input_names: [],
      };
    }
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
