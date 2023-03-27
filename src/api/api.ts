import axios from 'axios';
import type {
  GraphEwoks,
  Task,
  WorkflowDescription,
  filterParams,
} from '../types';

export const axiosRequest = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

// --------------Tasks
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

// TODO: improve back as for a random string a 500 error arises
// Discover tasks
export function discoverTasks(moduleNames: string[]) {
  return axiosRequest.post(`/tasks/discover`, { modules: moduleNames });
}

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

// TODO add return types for execution api and move it in another file
// Post execute
export function executeWorkflow(workflowId: string) {
  return axiosRequest.post(`/execute/${workflowId}`, workflowId);
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

// TODO: types for execution API
// Get executed workflows
export function getExecutionEvents(queryParams: filterParams) {
  const query = new URLSearchParams(Object.entries(queryParams));
  return axiosRequest.get(`/execution/events?${query.toString()}`);
}
