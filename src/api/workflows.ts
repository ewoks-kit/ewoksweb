import type { GraphEwoks } from '../types';
import { axiosRequest } from './api';
import type {
  DeleteResponse,
  ExecuteWorkflowResponse,
  ListResponse,
  WorkflowDescriptionsResponse,
  WorkflowResponse,
} from './models';

export async function getWorkflowsDescriptions() {
  return axiosRequest.get<WorkflowDescriptionsResponse>(
    `/workflows/descriptions`
  );
}

export async function getWorkflowsIds() {
  return axiosRequest.get<ListResponse>(`/workflows`);
}

export async function getWorkflow(id: string) {
  return axiosRequest.get<WorkflowResponse>(`/workflow/${id}`);
}

export async function postWorkflow(workflow: GraphEwoks) {
  return axiosRequest.post<WorkflowResponse>(`/workflows`, workflow);
}

export async function putWorkflow(workflow: GraphEwoks) {
  return axiosRequest.put<WorkflowResponse>(
    `/workflow/${workflow.graph.id}`,
    workflow
  );
}

export async function deleteWorkflow(id: string) {
  return axiosRequest.delete<DeleteResponse>(`/workflow/${id}`);
}

export async function executeWorkflow(workflowId: string) {
  return axiosRequest.post<ExecuteWorkflowResponse>(
    `/execute/${workflowId}`,
    workflowId
  );
}
