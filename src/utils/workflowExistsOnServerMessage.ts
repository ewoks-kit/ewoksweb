// import { useWorkflowsDLE } from '../api/workflows';
// import useSnackbarStore from '../store/useSnackbarStore';
import type { WorkflowDescription } from '../types';

export function workflowExistsOnServerMessage(
  workflowId: string,
  workflows: WorkflowDescription[] | undefined,
  showErrorMsg: (message: string, time: number) => void,
): boolean {
  if (workflows) {
    const subgraphExistsOnServer = workflows.some(
      (workflow) => workflow.id === workflowId,
    );

    if (!subgraphExistsOnServer) {
      showErrorMsg(
        `Workflow with id: ${workflowId} is not available in the list of workflows.
        Please provide the workflow (create new or import from disk) by saving it to the server.
        Then the workflow will be complete, able to be executed and correctly visualized on the canvas.`,
        30_000,
      );
      return false;
    }
    return true;
  }
  return false;
}
