import { useQuery, useQueryClient } from '@tanstack/react-query';

import type { Workflow } from '../types';
import { assertDefined } from '../utils/typeGuards';
import { client } from './client';
import type {
  DeleteResponse,
  ExecuteWorkflowResponse,
  ExecutionParams,
  WorkflowDescriptionsResponse,
  WorkflowResponse,
} from './models';
import { QueryKey } from './models';

async function fetchWorkflowDescriptions() {
  const response = await client.get<WorkflowDescriptionsResponse>(
    `/workflows/descriptions`,
  );
  return response.data.items.filter((w) => !!w.id);
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
  return client.post<ExecuteWorkflowResponse>(`/execute/${workflowId}`, params);
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

export function useWorkflowDescriptionsDLE() {
  return useQuery({
    queryKey: [QueryKey.WorkflowDescriptions],
    queryFn: fetchWorkflowDescriptions,
    staleTime: Infinity,
  });
}

export function useWorkflowIds(): Set<string> {
  const query = useQuery({
    queryKey: [QueryKey.WorkflowDescriptions],
    queryFn: fetchWorkflowDescriptions,
    staleTime: Infinity,
    suspense: true,
  });

  const { data: workflowDescriptions } = query;
  assertDefined(workflowDescriptions);

  return new Set(workflowDescriptions.map((d) => d.id));
}

export function useInvalidateWorkflowDescriptions() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: [QueryKey.WorkflowDescriptions],
    });
}

export function useInvalidateWorkflow() {
  const queryClient = useQueryClient();
  return (workflowId: string) => {
    queryClient.invalidateQueries({
      queryKey: [QueryKey.Workflow, workflowId],
    });
  };
}
