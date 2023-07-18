import type { GraphEwoks, WorkflowDescription } from '../types';
import { axiosRequest } from './api';

// -------------Workflows
// Get /workflows
export async function getWorkflowsDescriptions() {
  return axiosRequest.get<{ items: WorkflowDescription[] }>(
    `/workflows/descriptions`
  );
}

// Get /workflows only id
export async function getWorkflowsIds() {
  return axiosRequest.get<{ identifiers: string[] }>(`/workflows`);
}

// Get workflow:id
export async function getWorkflow(id: string) {
  return axiosRequest.get<GraphEwoks>(`/workflow/${id}`);
}

// Post
export async function postWorkflow(workflow: GraphEwoks) {
  return axiosRequest.post<GraphEwoks>(`/workflows`, workflow);
}

interface ExecutionResponse {
  job_id: string;
}

// Post execute
export async function executeWorkflow(workflowId: string) {
  return axiosRequest.post<ExecutionResponse>(
    `/execute/${workflowId}`,
    workflowId
  );
}

// Put
export async function putWorkflow(workflow: GraphEwoks) {
  return axiosRequest.put<GraphEwoks>(
    `/workflow/${workflow.graph.id}`,
    workflow
  );
}

// Delete
export async function deleteWorkflow(id: string) {
  return axiosRequest.delete<{ identifier: string }>(`/workflow/${id}`);
}
