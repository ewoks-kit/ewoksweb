import { useReactFlow } from 'reactflow';

import { useNodesIds } from '../store/graph-hooks';
import useNodeDataStore from '../store/useNodeDataStore';
import useSnackbarStore from '../store/useSnackbarStore';
import useStore from '../store/useStore';
import type { RFNode, Workflow } from '../types';
import { getNodeData } from '../utils';
import { calcNewId } from '../utils/calcNewId';
import { assertDefined, assertNodeDataDefined } from '../utils/typeGuards';
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

export const useCloneNode = () => {
  const rfInstance = useReactFlow();
  const nodesIds = useNodesIds();
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  const cloneNode = (id: string) => {
    const nodeData = getNodeData(id);
    assertNodeDataDefined(nodeData, id);
    const nodeToClone = rfInstance.getNode(id);
    assertDefined(nodeToClone);

    const clone: RFNode = {
      ...nodeToClone,
      id: calcNewId(id, nodesIds),
      selected: false,
      position: {
        x: nodeToClone.position.x + 100,
        y: nodeToClone.position.y + 100,
      },
      data: {},
    };

    rfInstance.addNodes(clone);
    assertNodeDataDefined(nodeData, id);
    setNodeData(clone.id, nodeData);
  };

  return { cloneNode };
};
