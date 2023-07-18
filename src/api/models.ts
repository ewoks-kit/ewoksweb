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

export interface ExecutedJobsResponse {
  jobs: EwoksEvent[][];
}
