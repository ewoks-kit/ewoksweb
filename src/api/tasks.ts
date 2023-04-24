import type { Task } from '../types';
import { axiosRequest } from './api';

// Get '/tasks/descriptions'
export function getTaskDescription() {
  return axiosRequest.get<{ items: Task[] }>(`/tasks/descriptions`);
}

// Delete task
export function deleteTask(id: string) {
  return axiosRequest.delete<{ identifier: string }>(`/task/${id}`);
}

// Post task
export function postTask(task: Task) {
  return axiosRequest.post<Task>(`/tasks`, task);
}

// Put task
export function putTask(task: Task) {
  if (!task.task_identifier) {
    return new Error('Task has no task-identifier');
  }
  return axiosRequest.put<Task>(`/task/${task.task_identifier}`, task);
}

// Discover tasks
export function discoverTasks(moduleNames: string[]) {
  return axiosRequest.post<{ identifiers: string[] }>(`/tasks/discover`, {
    modules: moduleNames,
  });
}
