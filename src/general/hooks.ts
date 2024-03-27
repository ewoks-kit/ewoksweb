import { useState } from 'react';
import type { Edge } from 'reactflow';
import { useReactFlow } from 'reactflow';

import {
  putWorkflow,
  useInvalidateWorkflow,
  useInvalidateWorkflowDescriptions,
  useWorkflowIds,
} from '../api/workflows';
import commonStrings from '../commonStrings.json';
import type { Status } from '../edition/TopAppBar/models';
import { useNodesIds } from '../store/graph-hooks';
import useNodeDataStore from '../store/useNodeDataStore';
import useSnackbarStore from '../store/useSnackbarStore';
import useStore from '../store/useStore';
import useWorkflowHistory from '../store/useWorkflowHistory';
import type { RFNode, Workflow } from '../types';
import { WorkflowSource } from '../types';
import {
  getEdgesData,
  getNodesData,
  prepareEwoksGraph,
  textForError,
} from '../utils';
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

export function useSaveWorkflow() {
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const rfInstance = useReactFlow();
  const workflowIds = useWorkflowIds();
  const invalidateWorkflowDescriptions = useInvalidateWorkflowDescriptions();
  const invalidateWorkflow = useInvalidateWorkflow();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const rootWorkflowSource = useStore((state) => state.rootWorkflowSource);
  const showSuccessMsg = useSnackbarStore((state) => state.showSuccessMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const resetWorkflowHistory = useWorkflowHistory(
    (state) => state.resetWorkflowHistory,
  );

  function handleError(text: string) {
    showErrorMsg(text);
    setStatus('error');
  }

  async function handleSave(): Promise<boolean> {
    // If the workflow does not exist on the server, open dialog asking the user for a name
    if (!workflowIds.has(displayedWorkflowInfo.id)) {
      setDialogOpen(true);
      return false;
    }

    if (rootWorkflowSource === WorkflowSource.Empty) {
      handleError('No graph exists to save!');
      return false;
    }

    // If the workflow was imported from disk, open dialog asking the user for a name
    if (rootWorkflowSource === WorkflowSource.Disk) {
      setDialogOpen(true);
      return false;
    }

    try {
      await putWorkflow(
        prepareEwoksGraph(
          displayedWorkflowInfo,
          rfInstance.getNodes(),
          rfInstance.getEdges(),
          getNodesData(),
          getEdgesData(),
        ),
      );
      invalidateWorkflowDescriptions();
      invalidateWorkflow(displayedWorkflowInfo.id);
      resetWorkflowHistory();
      showSuccessMsg('Graph saved successfully!');
      setStatus('success');
      return true;
    } catch (error) {
      handleError(textForError(error, commonStrings.savingError));
      return false;
    }
  }

  return {
    isDialogOpen,
    setDialogOpen,
    status,
    setStatus,
    handleSave,
  };
}
export const useCloneNode = () => {
  const rfInstance = useReactFlow();
  const nodesIds = useNodesIds();
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  return (id: string) => {
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
    setNodeData(clone.id, nodeData);
  };
};

export function useUpdateEdge() {
  const { setEdges, getEdges } = useReactFlow();

  return (newEdge: Edge) => {
    const newEdges = [
      ...getEdges().filter((edge) => edge.id !== newEdge.id),
      newEdge,
    ];

    setEdges(newEdges);
  };
}
