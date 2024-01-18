import type {
  EwoksEvent,
  EwoksLink,
  EwoksNode,
  GraphDetails,
  InputTableRow,
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

export interface ObjectEditDialogContent {
  id?: string;
  title?: string;
  object?: object;
  callbackProps: { rows: InputTableRow[]; id: string };
}

// https://ewokscore.readthedocs.io/en/latest/execute_io.html
export interface NodeExecutionInput {
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
