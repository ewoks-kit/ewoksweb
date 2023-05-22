import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';
import type { GraphEwoks } from '../../types';
import useStore from '../../store/useStore';
import { isString } from '../../utils/typeGuards';

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

export function useLoadGraph() {
  const rfInstance = useReactFlow();
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  return async (file: File) => {
    const {
      graphInfo,
      workingGraph,
      graphOrSubgraph,
      initGraph,
      setSubGraph,
      setOpenSnackbar,
    } = useStore.getState();

    if (workingGraph.graph.id !== graphInfo.id) {
      setOpenSnackbar({
        open: true,
        text: 'Not allowed to add a new node-graph to any sub-graph!',
        severity: 'error',
      });
      return;
    }

    const reader = new FileReader();
    // eslint-disable-next-line require-atomic-updates
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

      if (graphOrSubgraph) {
        await initGraph(newGraph as GraphEwoks, 'fromDisk', rfInstance);
      } else {
        const nodes = rfInstance.getNodes();
        const { nodeWithoutData, data } = await setSubGraph(
          newGraph as GraphEwoks,
          nodes,
          rfInstance.getEdges()
        );
        rfInstance.setNodes([...nodes, nodeWithoutData]);
        setNodeData(nodeWithoutData.id, data);
      }
    };
    reader.readAsText(file);
  };
}
