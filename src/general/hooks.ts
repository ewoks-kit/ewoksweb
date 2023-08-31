import type { GraphEwoks } from '../types';
import useStore from '../store/useStore';
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

export function useLoadGraph(onGraphLoad: (graph: GraphEwoks) => void) {
  return async (file: File) => {
    const {
      displayedWorkflowInfo,
      rootWorkflowId,
      setOpenSnackbar,
    } = useStore.getState();

    if (rootWorkflowId !== displayedWorkflowInfo.id) {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to add a new node-graph to any sub-graph!',
        severity: 'error',
      });
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      const { result } = reader;

      const newGraph = tryJSONparse(result);
      if (!newGraph) {
        setOpenSnackbar({
          open: true,
          text: 'Error in JSON structure. Please correct input file and retry!',
          severity: 'error',
        });
        return;
      }

      onGraphLoad(newGraph as GraphEwoks);
    };
    reader.readAsText(file);
  };
}
