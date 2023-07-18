import axios from 'axios';
import type { GraphEwoks, WorkflowDescription } from '../types';
import { baseUrl } from './url';

export const axiosRequest = axios.create({
  baseURL: baseUrl,
});

// -------------Workflows
// Get /workflows
export function getWorkflowsDescriptions() {
  return axiosRequest.get<{ items: WorkflowDescription[] }>(
    `/workflows/descriptions`
  );
}

// Get /workflows only id
export function getWorkflowsIds() {
  return axiosRequest.get<{ identifiers: string[] }>(`/workflows`);
}

// Get workflow:id
export function getWorkflow(id: string) {
  return axiosRequest.get<GraphEwoks>(`/workflow/${id}`);
}

// Post
export function postWorkflow(workflow: GraphEwoks) {
  return axiosRequest.post<GraphEwoks>(`/workflows`, workflow);
}

interface ExecutionResponse {
  job_id: string;
}

// Post execute
export function executeWorkflow(workflowId: string) {
  return axiosRequest.post<ExecutionResponse>(
    `/execute/${workflowId}`,
    workflowId
  );
}

// Put
export function putWorkflow(workflow: GraphEwoks) {
  return axiosRequest.put<GraphEwoks>(
    `/workflow/${workflow.graph.id}`,
    workflow
  );
}

// Delete
export function deleteWorkflow(id: string) {
  return axiosRequest.delete<{ identifier: string }>(`/workflow/${id}`);
}
