import type { GraphEwoks } from '../types';
import useStore from '../store/useStore';
import { isString } from '../utils/typeGuards';
import { fetchTaskDescriptions } from '../api/tasks';
import { textForError } from '../utils';
import commonStrings from '../commonStrings.json';

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
    const { graphInfo, workingGraph, setOpenSnackbar } = useStore.getState();

    if (workingGraph.graph.id !== graphInfo.id) {
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

export function useGetTasks() {
  return async () => {
    const { setOpenSnackbar, setTasks } = useStore.getState();

    try {
      const tasksData = await fetchTaskDescriptions();
      if (tasksData.data.items.length > 0) {
        const allTasks = tasksData.data.items;
        setTasks(allTasks);
      }
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(error, commonStrings.retrieveTasksError),
        severity: 'error',
      });
    }
  };
}

export function useTasks() {
  return useStore((state) => state.tasks);
}
