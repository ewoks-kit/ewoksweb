import type { Task } from '../types';
import { getTaskName } from '../utils';

export const GRAPH_INPUT_ICON = 'graphInput.svg';
export const GRAPH_OUTPUT_ICON = 'graphOutput.svg';

function getPrefix(task: Task): string {
  const { task_type } = task;
  switch (task_type) {
    case 'graphInput': {
      return 'In';
    }
    case 'graphOutput': {
      return 'Out';
    }
    case 'note': {
      return 'Note';
    }
    default: {
      return getTaskName(task);
    }
  }
}

export function generateNewNodeId(task: Task, nodesIds: string[]): string {
  const prefix = getPrefix(task);

  let id = 0;
  const ids = new Set(nodesIds);
  while (ids.has(`${prefix}${id}`)) {
    id++;
  }
  return `${prefix}${id}`;
}
