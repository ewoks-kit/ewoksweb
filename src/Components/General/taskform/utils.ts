import { postTask, putTask } from '../../../api/tasks';
import type { Task } from '../../../types';
import type { TaskFields } from './models';

export async function submitFormData(
  formData: TaskFields,
  initial_task?: Task,
  editExisting?: boolean
) {
  const parsedData = {
    ...initial_task,
    ...formData,
    required_input_names: formData.required_input_names?.split(','),
    optional_input_names: formData.optional_input_names?.split(','),
    output_names: formData.output_names?.split(','),
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
