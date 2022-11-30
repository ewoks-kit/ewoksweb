import type { WorkflowDescription } from '../../../types';
import commonStrings from 'commonStrings.json';
import { getWorkflows } from '../../../utils';
import type { FetchResult } from './models';

export async function fetchWorkflows(): Promise<FetchResult> {
  // DOC: getWorkflows will fetch {label, category} not just label
  // depending on props.placeholder will show categories of workflows
  // after selecting a category workflows will be filtered for this category
  // TODO: error handling with try catch
  const workF: WorkflowDescription[] = await getWorkflows();

  if (workF.length === 0) {
    return {
      workflows: [],
      error: 'It seems you have no workflows to work with!',
    };
  }

  if (workF[0].label === 'network error') {
    return {
      workflows: [],
      error: `Something went wrong when contacting the server!
        Error status: ${
          workF[0].category || commonStrings.retrieveWorkflowsError
        }`,
    };
  }

  return { workflows: workF };
}

export function getFilterableCategories(workflows: WorkflowDescription[]) {
  const categoriesSet = new Set(
    workflows.map((workflow) => workflow.category).filter((cat) => !!cat)
  );

  return [...categoriesSet, 'All'];
}
