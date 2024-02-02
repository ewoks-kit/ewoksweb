import { useQuery, useQueryClient } from '@tanstack/react-query';

import type { Workflow, WorkflowDescription } from '../types';
import { assertDefined } from '../utils/typeGuards';
import { client } from './client';
import type {
  DeleteResponse,
  ExecuteWorkflowResponse,
  ExecutionParams,
  ListResponse,
  WorkflowDescriptionsResponse,
  WorkflowResponse,
} from './models';
import { QueryKey } from './models';

export async function fetchWorkflowsDescriptions() {
  return client.get<WorkflowDescriptionsResponse>(`/workflows/descriptions`);
}

export async function fetchWorkflowsIds() {
  return client.get<ListResponse>(`/workflows`);
}

export async function fetchWorkflow(id: string) {
  const { data } = await client.get<WorkflowResponse>(`/workflow/${id}`);
  return data;
}

export async function postWorkflow(workflow: Workflow) {
  return client.post<WorkflowResponse>(`/workflows`, workflow);
}

export async function putWorkflow(workflow: Workflow) {
  return client.put<WorkflowResponse>(
    `/workflow/${workflow.graph.id}`,
    workflow,
  );
}

export async function deleteWorkflow(id: string) {
  return client.delete<DeleteResponse>(`/workflow/${id}`);
}

export async function executeWorkflow(
  workflowId: string,
  params?: ExecutionParams,
) {
  return client.post<ExecuteWorkflowResponse>(`/execute/${workflowId}`, {
    execute_arguments: params,
  });
}

export async function getWorkflows(): Promise<WorkflowDescription[]> {
  const response = await fetchWorkflowsDescriptions();
  return response.data.items;
}

export function useWorkflow(id: string | undefined) {
  const { data } = useQuery({
    queryKey: [QueryKey.Workflow, id],
    queryFn: () => {
      assertDefined(id);
      return fetchWorkflow(id);
    },
    enabled: !!id,
    staleTime: Infinity,
    suspense: true,
  });
  return data;
}

export function useWorkflowsDLE() {
  return useQuery({
    queryKey: [QueryKey.Workflows],
    queryFn: getWorkflows,
    staleTime: Infinity,
  });
}

export function useWorkflowDescriptions(): WorkflowDescription[] {
  const query = useQuery({
    queryKey: [QueryKey.Workflows],
    queryFn: getWorkflows,
    staleTime: Infinity,
    suspense: true,
  });

  const { data: workflowDescriptions } = query;
  assertDefined(workflowDescriptions);

  return workflowDescriptions;
}

export function useInvalidateWorkflowDescriptions() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: [QueryKey.Workflows] });
}

export function useInvalidateWorkflow() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: [QueryKey.Workflow] });
}
