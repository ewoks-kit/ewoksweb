import type { Connection } from '@xyflow/react';

import type { EdgeWithData, NodeData, Task } from '../../types';
import { DEFAULT_LINK_VALUES } from '../../utils/defaultValues';
import { assertTaskInfo } from '../../utils/typeGuards';
import type { TaskInfo } from './models';

function isPpfTask(task: Task) {
  return ['ppfmethod', 'ppfport'].includes(task.task_type);
}

export function addConnectionToGraph(
  connection: Connection,
  nodesData: Map<string, NodeData>,
): EdgeWithData | undefined {
  const { source, target, sourceHandle, targetHandle } = connection;

  if (!source || !target) {
    return undefined;
  }

  const { task_props: sourceTask } = nodesData.get(source) || {
    task_props: undefined,
  };
  const { task_props: targetTask } = nodesData.get(target) || {
    task_props: undefined,
  };

  if (!sourceTask || !targetTask) {
    return undefined;
  }

  const link: EdgeWithData = {
    data: {
      startEnd:
        sourceTask.task_type === 'graphInput' ||
        targetTask.task_type === 'graphOutput',
      links_optional_output_names: targetTask.optional_input_names,
      links_required_output_names: targetTask.required_input_names,
      links_input_names: sourceTask.output_names,
      map_all_data:
        isPpfTask(sourceTask) || isPpfTask(targetTask) ? true : undefined,
      ...(sourceTask.task_type === 'graph' &&
        sourceHandle && { sub_source: sourceHandle }),
      ...(targetTask.task_type === 'graph' &&
        targetHandle && { sub_target: targetHandle }),
    },
    id: `${source}:${sourceHandle || 'sr'} → ${target}:${targetHandle || 'tl'}`,
    source,
    target,
    ...(sourceHandle && { sourceHandle }),
    ...(targetHandle && { targetHandle }),
    markerEnd: DEFAULT_LINK_VALUES.uiProps.markerEnd,
  };

  return link;
}

const DATA_TRANSFER_TASK_TYPE = 'ewoks/task';

export function attachTaskInfo(dataTransfer: DataTransfer, taskInfo: TaskInfo) {
  dataTransfer.setData(DATA_TRANSFER_TASK_TYPE, JSON.stringify(taskInfo));
  dataTransfer.effectAllowed = 'move';
}

export function retrieveTaskInfo(
  dataTransfer: DataTransfer,
  onError?: () => void,
): TaskInfo | undefined {
  try {
    const taskInfo = JSON.parse(dataTransfer.getData(DATA_TRANSFER_TASK_TYPE));
    assertTaskInfo(taskInfo);
    return taskInfo;
  } catch {
    onError?.();
    return undefined;
  }
}
