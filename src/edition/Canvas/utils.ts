import type { Connection } from 'reactflow';

import type { EwoksRFLink, EwoksRFNodeData } from '../../types';
import { DEFAULT_LINK_VALUES } from '../../utils/defaultValues';
import { assertTaskInfo } from '../../utils/typeGuards';
import type { TaskInfo } from './models';

export function trimLabel(label: string) {
  if (label.length <= 20) {
    return label;
  }

  return label.split('.').pop();
}

export const defaultLinkStyle = {
  style: { stroke: '#96a5f9', strokeWidth: '3px' },
  labelBgPadding: [8, 4] as [number, number],
  labelBgBorderRadius: 4,
  labelStyle: { fill: 'rgb(150, 165, 249)', fontWeight: 500, fontSize: 14 },
  labelBgStyle: {
    fill: 'rgb(223, 226, 247)',
    fillOpacity: 1,
    strokeWidth: '3px',
    stroke: 'rgb(150, 165, 249)',
  },
};

export function addConnectionToGraph(
  connection: Connection,
  nodesData: Map<string, EwoksRFNodeData>
): EwoksRFLink | undefined {
  const { source, target, sourceHandle, targetHandle } = connection;

  if (!source || !target) {
    return undefined;
  }

  const sourceTaskData = nodesData.get(source);
  const targetTaskData = nodesData.get(target);

  if (!sourceTaskData || !targetTaskData) {
    return undefined;
  }

  const link: EwoksRFLink = {
    data: {
      startEnd:
        sourceTaskData.task_props.task_type === 'graphInput' ||
        targetTaskData.task_props.task_type === 'graphOutput',
      // DOC: node optional_input_names are link's optional_output_names
      links_optional_output_names:
        targetTaskData.task_props.optional_input_names,
      // DOC: node required_input_names are link's required_output_names
      links_required_output_names:
        targetTaskData.task_props.required_input_names,
      // DOC: node output_names are link's input_names
      links_input_names: sourceTaskData.task_props.output_names,
      map_all_data:
        ['ppfmethod', 'ppfport'].includes(
          sourceTaskData.task_props.task_type
        ) ||
        ['ppfmethod', 'ppfport'].includes(targetTaskData.task_props.task_type),
      ...(sourceTaskData.task_props.task_type === 'graph' &&
        sourceHandle && { sub_source: sourceHandle }),
      ...(targetTaskData.task_props.task_type === 'graph' &&
        targetHandle && { sub_target: targetHandle }),
    },
    id: `${source}:${sourceHandle || 'sr'}->${target}:${targetHandle || 'tl'}`,
    source,
    target,
    ...(sourceHandle && { sourceHandle }),
    ...(targetHandle && { targetHandle }),
    markerEnd: DEFAULT_LINK_VALUES.uiProps.markerEnd,
    ...defaultLinkStyle,
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
  onError?: () => void
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
