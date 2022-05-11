import axios from 'axios';
import configData from '../configData.json';

export const axiosRequest = axios.create({
  baseURL: configData.serverUrl,
});

// --------------Tasks
// Get '/tasks/descriptions'
export function getTaskDescription() {
  return axiosRequest.get(`/tasks/descriptions`);
}

// Delete task
export function deleteTask(id: string) {
  return axiosRequest.delete(`/task/${id}`);
}

// -------------Workflows
// Get
export function getWorkflowDescription() {
  return axiosRequest.get(`/workflows`);
}

// Post
export function postWorkflow(workflow) {
  return axiosRequest.post(`/workflows`, workflow);
}
