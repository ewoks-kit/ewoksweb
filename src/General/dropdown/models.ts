import type { WorkflowDescription } from '../../types';

export enum FetchStatus {
  ToDo = 'To Do',
  Pending = 'Pending',
  Done = 'Done',
}

export interface FetchResult {
  workflows: WorkflowDescription[];
  error?: string;
}
