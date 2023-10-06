import type { Edge, Node } from 'reactflow';

import { postTask, putTask } from '../../api/tasks';
import type { EwoksRFLinkData, EwoksRFNodeData, Task } from '../../types';
import { assertDefined } from '../../utils/typeGuards';
import type { TaskFields } from './models';

export async function submitTaskFormData(
  formData: TaskFields,
  initial_task?: Task,
  editExisting?: boolean,
) {
  const {
    task_type,
    required_input_names,
    optional_input_names,
    output_names,
    ...restFormData
  } = formData;

  if (task_type === '') {
    throw new Error('Please give a task type');
  }

  const parsedData: Task = {
    ...initial_task,
    ...restFormData,
    task_type,
    ...(required_input_names
      ? { required_input_names: required_input_names.split(',') }
      : {}),
    ...(optional_input_names
      ? { optional_input_names: optional_input_names.split(',') }
      : {}),
    ...(output_names ? { output_names: output_names.split(',') } : {}),
  };

  if (
    hasDuplicates([
      ...(parsedData.required_input_names || []),
      ...(parsedData.optional_input_names || []),
    ])
  ) {
    throw new Error('A task cannot have multiple inputs of the same name!');
  }

  if (hasDuplicates(parsedData.output_names || [])) {
    throw new Error('A task cannot have multiple outputs of the same name!');
  }

  const saveTask = editExisting ? putTask : postTask;

  await saveTask(parsedData);
}

export function hasDuplicates(arr: string[]): boolean {
  if (arr.length === 0) {
    return false;
  }
  return new Set(arr).size < arr.length;
}

export function enrichWithData<T extends Node | Edge>(
  element: T,
  dataContainer: Map<
    string,
    T extends Node ? EwoksRFNodeData : EwoksRFLinkData
  >,
) {
  const data = dataContainer.get(element.id);
  assertDefined(data);

  return { ...element, data };
}
