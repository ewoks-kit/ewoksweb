import type { TaskType } from '../../types';

export interface TaskInfo {
  task_identifier: string;
  task_type: TaskType;
  icon?: string;
  category?: string;
}
