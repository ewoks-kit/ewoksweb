import type { WorkflowDescription } from '../../types';
import { fetchWorkflowsDescriptions } from '../../api/workflows';

export async function getWorkflows(): Promise<WorkflowDescription[]> {
  const response = await fetchWorkflowsDescriptions();
  const workflows = response.data.items;

  if (workflows.length === 0) {
    throw new Error('It seems you have no workflows to work with!');
  }

  return workflows;
}

export function getFilterableCategories(workflows: WorkflowDescription[]) {
  const categoriesSet = new Set(
    workflows.map((workflow) => workflow.category).filter((cat) => !!cat)
  );

  return [...categoriesSet, 'All'];
}
