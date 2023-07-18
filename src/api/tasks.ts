import type { Task } from '../types';
import { axiosRequest } from './api';
import type {
  DeleteResponse,
  ListResponse,
  TaskDescriptionsResponse,
  TaskResponse,
} from './models';

// Get '/tasks/descriptions'
export async function getTaskDescriptions() {
  return axiosRequest.get<TaskDescriptionsResponse>(`/tasks/descriptions`);
}

// Delete task
export async function deleteTask(id: string) {
  return axiosRequest.delete<DeleteResponse>(`/task/${id}`);
}

// Post task
export async function postTask(task: Task) {
  return axiosRequest.post<TaskResponse>(`/tasks`, task);
}

// Put task
export function putTask(task: Task) {
  if (!task.task_identifier) {
    return new Error('Task has no task-identifier');
  }
  return axiosRequest.put<TaskResponse>(`/task/${task.task_identifier}`, task);
}

// Discover tasks
export async function discoverTasks(moduleNames: string[]) {
  return axiosRequest.post<ListResponse>(`/tasks/discover`, {
    modules: moduleNames,
  });
}
