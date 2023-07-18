import type { Task } from '../types';
import { client } from './client';
import type {
  DeleteResponse,
  ListResponse,
  TaskDescriptionsResponse,
  TaskResponse,
} from './models';

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
