import type {
  EwoksEvent,
  EwoksLink,
  EwoksNode,
  GraphDetails,
  Task,
  WorkflowDescription,
} from '../types';

export interface ListResponse {
  identifiers: string[];
}

export interface DeleteResponse {
  identifier: string;
}

export interface IconResponse {
  data_url: string;
}

export type TaskResponse = Task;

export interface TaskDescriptionsResponse {
  items: Task[];
}

export interface WorkflowResponse {
  graph: GraphDetails;
  nodes: Omit<EwoksNode, 'uiProps'>[];
  links: Omit<EwoksLink, 'uiProps' | 'startEnd'>[];
}

export interface WorkflowDescriptionsResponse {
  items: WorkflowDescription[];
}

export interface ExecuteWorkflowResponse {
  job_id: string;
}

export type EwoksJob = EwoksEvent[];

export interface ExecutedJobsResponse {
  jobs: EwoksJob[];
}

export enum QueryKey {
  Jobs = 'jobs',
  Icons = 'icons',
  Tasks = 'tasks',
  Workflow = 'workflow',
  Workflows = 'workflows',
}

// https://ewokscore.readthedocs.io/en/latest/execute_io.html
interface NodeExecutionInput {
  name: string | number;
  value: unknown;
  label?: string;
  task_identifier?: string;
  id?: string;
  all?: boolean;
}

export interface ExecutionParams {
  inputs?: NodeExecutionInput[];
  engine?: Engine;
}

export type Engine = null | 'dask' | 'ppf';
