import type { TaskType } from '../../../types';

export interface TaskFields {
  task_type: TaskType;
  task_identifier: string;
  optional_input_names?: string;
  output_names?: string;
  required_input_names?: string;
  icon: string;
  category?: string;
}

export const TASK_TYPES = ['class', 'method', 'script', 'ppfmethod', 'ppfport'];
