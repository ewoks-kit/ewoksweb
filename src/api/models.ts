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
  Workflows = 'workflows',
}

export interface ObjectEditDialogContent {
  id?: string;
  title?: string;
  object?: object;
  callbackProps: { rows: InputTableRow[]; id: string };
}

export interface NodeExecutionInput {
  name?: string | number;
  type: string;
  value?: unknown;
  id: string;
  label?: string;
  taskIdentifier?: string;
  nodeId?: string;
}

export interface ExecutionParameters {
  name: string | number;
  type: string;
  value: unknown;
  id: string;
}

export interface ExecutionParams {
  executeArgs?: { perNodeInputs?: NodeExecutionInput[]; engine?: string };
}

export interface ExecuteDialogProps {
  open: boolean;
  onClose: (value?: string) => void;
  executeWorkflow: (params?: ExecutionParams) => Promise<void>;
}
