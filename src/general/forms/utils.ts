import type { Edge, Node } from '@xyflow/react';

import { postTask, putTask } from '../../api/tasks';
import type { LinkData, NodeData, Task, TaskType } from '../../types';
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
    ...parseTaskIO(
      task_type,
      required_input_names,
      optional_input_names,
      output_names,
    ),
    task_type,
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
  dataContainer: Map<string, T extends Node ? NodeData : LinkData>,
) {
  const data = dataContainer.get(element.id);
  assertDefined(data);

  return { ...element, data };
}

function parseTaskIO(
  taskType: TaskType,
  requiredInputs: string | undefined,
  optionalInputs: string | undefined,
  outputs: string | undefined,
): {
  required_input_names?: string[];
  optional_input_names?: string[];
  output_names?: string[];
} {
  // Task type specific behaviour as described in https://ewokscore.readthedocs.io/en/stable/definitions.html#task-implementation
  switch (taskType) {
    case 'class': {
      return {
        ...(requiredInputs
          ? { required_input_names: requiredInputs.split(',') }
          : {}),
        ...(optionalInputs
          ? { optional_input_names: optionalInputs.split(',') }
          : {}),
        ...(outputs ? { output_names: outputs.split(',') } : {}),
      };
    }

    case 'method': {
      return {
        required_input_names: ['_method'],
        output_names: ['return_value'],
      };
    }

    case 'ppfmethod':
    case 'ppfport': {
      return { optional_input_names: ['_ppfdict'], output_names: ['_ppfdict'] };
    }

    case 'script': {
      return {
        required_input_names: ['_script'],
        output_names: ['return_value'],
      };
    }

    case 'notebook': {
      return {
        required_input_names: ['_notebook'],
        output_names: ['results', 'output_notebook'],
      };
    }

    default: {
      throw new Error(`Unsupported task type ${taskType}`);
    }
  }
}
