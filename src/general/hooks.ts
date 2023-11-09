import { useWorkflowsDLE } from '../api/workflows';
import useSnackbarStore from '../store/useSnackbarStore';
import useStore from '../store/useStore';
import type { Workflow } from '../types';
import { isString } from '../utils/typeGuards';

function tryJSONparse(str: string | ArrayBuffer | null): unknown {
  if (!isString(str)) {
    return null;
  }
  try {
    return JSON.parse(str);
  } catch (error) {
    /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
    console.warn(error);
    return null;
  }
}

export function useLoadGraph(onGraphLoad: (graph: Workflow) => void) {
  return async (file: File) => {
    const { displayedWorkflowInfo, rootWorkflowId } = useStore.getState();
    const { showErrorMsg } = useSnackbarStore.getState();

    if (rootWorkflowId !== displayedWorkflowInfo.id) {
      showErrorMsg('Not allowed to add a new node-graph to any sub-graph!');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      const { result } = reader;

      const newGraph = tryJSONparse(result);
      if (!newGraph) {
        showErrorMsg(
          'Error in JSON structure. Please correct input file and retry!',
        );
        return;
      }

      onGraphLoad(newGraph as Workflow);
    };
    reader.readAsText(file);
  };
}

export function useWorkflowExistsOnServerMessage(workflowId: string) {
  const { data: workflows } = useWorkflowsDLE();
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);

  const subgraphExistsOnServer = workflows?.some(
    (workflow) => workflow.id === workflowId,
  );

  if (!subgraphExistsOnServer) {
    showErrorMsg(
      `Workflow with id: ${workflowId} is not available in the list of workflows.
      Please provide the workflow (create new or import from disk) by saving it to the server.
      Then the workflow will be complete, able to be executed and correctly visualized on the canvas.`,
      60_000,
    );
  }
}
