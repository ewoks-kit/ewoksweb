import type { Task } from '../types';

export const generalTasks: Task[] = [
  {
    icon: 'graphInput.svg',
    task_type: 'graphInput',
    output_names: [''],
    task_identifier: 'graphInput',
    optional_input_names: [''],
    category: 'General',
    required_input_names: [''],
  },
  {
    icon: 'graphOutput.svg',
    task_type: 'graphOutput',
    output_names: [''],
    task_identifier: 'graphOutput',
    optional_input_names: [''],
    category: 'General',
    required_input_names: [''],
  },
  {
    required_input_names: [],
    category: 'General',
    task_identifier: 'taskSkeleton',
    task_type: 'ppfmethod',
    icon: 'orange2.png',
    optional_input_names: [],
    output_names: [],
  },
];
