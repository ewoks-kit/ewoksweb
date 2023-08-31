import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Task } from '../types';
import { getTaskName } from '../utils';
import { assertDefined } from '../utils/typeGuards';
import { client } from './client';
import type {
  DeleteResponse,
  ListResponse,
  TaskDescriptionsResponse,
  TaskResponse,
} from './models';
import { QueryKey } from './models';

// Get '/tasks/descriptions'
export async function fetchTaskDescriptions() {
  return client.get<TaskDescriptionsResponse>(`/tasks/descriptions`);
}

// Delete task
export async function deleteTask(id: string) {
  return client.delete<DeleteResponse>(`/task/${id}`);
}

// Post task
export async function postTask(task: Task) {
  return client.post<TaskResponse>(`/tasks`, task);
}

// Put task
export function putTask(task: Task) {
  if (!task.task_identifier) {
    return new Error('Task has no task-identifier');
  }
  return client.put<TaskResponse>(`/task/${task.task_identifier}`, task);
}

// Discover tasks
export async function discoverTasks(moduleNames: string[]) {
  return client.post<ListResponse>(`/tasks/discover`, {
    modules: moduleNames,
  });
}

export function useTasks(): Task[] {
  const query = useQuery({
    queryKey: [QueryKey.Tasks],
    queryFn: fetchTaskDescriptions,
    suspense: true,
  });

  const { data: axiosResponse } = query;
  assertDefined(axiosResponse);
  return axiosResponse.data.items.sort((a, b) =>
    getTaskName(a).localeCompare(getTaskName(b))
  );
}

export function useInvalidateTasks() {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: [QueryKey.Tasks] });
}
