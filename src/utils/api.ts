import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  GraphEwoks,
  Task,
  IconsNames,
  WorkflowDescription,
  filterParams,
} from '../types';

export const axiosRequest = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

// --------------Tasks
// Get '/tasks/descriptions'
export function getTaskDescription(): Promise<{
  data: { items: Task[] };
}> {
  return axiosRequest.get(`/tasks/descriptions`);
}

// Delete task
export function deleteTask(
  id: string
): Promise<{
  data: { identifier: string };
}> {
  return axiosRequest.delete(`/task/${id}`);
}

// Post task
export function postTask(
  task: Task
): Promise<{
  data: Task;
}> {
  return axiosRequest.post(`/tasks`, task);
}

// Put task
export function putTask(
  task: Task
): Promise<{
  data: Task;
}> {
  return axiosRequest.put(`/task/${task.task_identifier}`, task);
}

// TODO: improve back as for a random string a 500 error arises
// Discover tasks
export function discoverTasks(moduleNames: string[]) {
  return axiosRequest.post(`/tasks/discover`, { modules: moduleNames });
}

// -------------Workflows
// Get /workflows
export function getWorkflowsDescriptions(): Promise<{
  data: { items: WorkflowDescription[] };
}> {
  return axiosRequest.get(`/workflows/descriptions`);
}

// Get /workflows only id
export function getWorkflowsIds(): Promise<{
  data: { identifiers: string[] };
}> {
  return axiosRequest.get(`/workflows`);
}

// Get workflow:id
export function getWorkflow(
  id: string
): Promise<{
  data: GraphEwoks;
}> {
  return axiosRequest.get(`/workflow/${id}`);
}

// Post
export function postWorkflow(
  workflow: GraphEwoks
): Promise<{
  data: GraphEwoks;
}> {
  return axiosRequest.post(`/workflows`, workflow);
}

// TODO add return types for execution api and move it in another file
// Post execute
export function executeWorkflow(workflowId: string) {
  return axiosRequest.post(`/execute/${workflowId}`, workflowId);
}

// Put
export function putWorkflow(
  workflow: GraphEwoks
): Promise<{
  data: GraphEwoks;
}> {
  return axiosRequest.put(`/workflow/${workflow.graph.id}`, workflow);
}

// Delete
export function deleteWorkflow(
  id: string
): Promise<{
  data: { identifier: string };
}> {
  return axiosRequest.delete(`/workflow/${id}`);
}

// Get executed workflows
export function getExecutionEvents(queryParams: filterParams) {
  const queryString = Object.keys(queryParams)
    .map((key) => `${key}=${queryParams[key] as string}`)
    .join('&');
  return axiosRequest.get(`/execution/events?${queryString}`);
}

// --------------Icons
// Get '/icons/descriptions'
export async function getIcons(): Promise<IconsNames> {
  const result: AxiosResponse<IconsNames> = await axiosRequest.get(`/icons`);
  return result.data;
}

// Get icon:id
export function getIcon(id: string): Promise<AxiosResponse<string>> {
  return axiosRequest.get<string>(`/icon/${id}`);
}

// Delete icon
export function deleteIcon(
  id: string
): Promise<{
  data: { identifier: string };
}> {
  return axiosRequest.delete(`/icon/${id}`);
}

// Post task
export function postIcon(
  iconName: string,
  iconData: string | ArrayBuffer
): Promise<{
  data: { data_url: string };
}> {
  return axiosRequest.post(`/icon/${iconName}`, { data_url: iconData });
}
