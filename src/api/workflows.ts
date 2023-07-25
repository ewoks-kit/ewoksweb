import { useDLE, useSuspense, useController } from '@rest-hooks/react';
import { Endpoint } from '@rest-hooks/rest';
import type { GraphEwoks, WorkflowDescription } from '../types';
import { client } from './client';
import type {
  DeleteResponse,
  ExecuteWorkflowResponse,
  ListResponse,
  WorkflowDescriptionsResponse,
  WorkflowResponse,
} from './models';

export async function fetchWorkflowsDescriptions() {
  return client.get<WorkflowDescriptionsResponse>(`/workflows/descriptions`);
}

export async function fetchWorkflowsIds() {
  return client.get<ListResponse>(`/workflows`);
}

export async function fetchWorkflow(id: string) {
  return client.get<WorkflowResponse>(`/workflow/${id}`);
}

export async function postWorkflow(workflow: GraphEwoks) {
  return client.post<WorkflowResponse>(`/workflows`, workflow);
}

export async function putWorkflow(workflow: GraphEwoks) {
  return client.put<WorkflowResponse>(
    `/workflow/${workflow.graph.id}`,
    workflow
  );
}

export async function deleteWorkflow(id: string) {
  return client.delete<DeleteResponse>(`/workflow/${id}`);
}

export async function executeWorkflow(workflowId: string) {
  return client.post<ExecuteWorkflowResponse>(
    `/execute/${workflowId}`,
    workflowId
  );
}

export async function getWorkflows(): Promise<WorkflowDescription[]> {
  const response = await fetchWorkflowsDescriptions();
  const workflows = response.data.items;

  if (workflows.length === 0) {
    throw new Error('It seems you have no workflows to work with!');
  }

  return workflows;
}

const getWorkflowsEndpoint = new Endpoint(getWorkflows, {
  name: 'getWorkflows',
});

export function useWorkflows() {
  return useSuspense(getWorkflowsEndpoint);
}

export function useWorkflowsDLE() {
  return useDLE(getWorkflowsEndpoint);
}

export function useMutateWorkflows() {
  const ctrl = useController();

  return async () => ctrl.invalidate(getWorkflowsEndpoint);
}
