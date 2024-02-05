import { useState } from 'react';
import { useReactFlow } from 'reactflow';

import {
  putWorkflow,
  useInvalidateWorkflow,
  useInvalidateWorkflowDescriptions,
} from '../api/workflows';
import commonStrings from '../commonStrings.json';
import type { Status } from '../edition/TopAppBar/models';
import { getWorkflowIdsFromServer } from '../edition/TopAppBar/utils';
import { useNodesIds } from '../store/graph-hooks';
import useNodeDataStore from '../store/useNodeDataStore';
import useSnackbarStore from '../store/useSnackbarStore';
import useStore from '../store/useStore';
import type { RFNode, Workflow } from '../types';
import { GraphFormAction } from '../types';
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
  const invalidateWorkflowDescriptions = useInvalidateWorkflowDescriptions();
  const invalidateWorkflow = useInvalidateWorkflow();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const rootWorkflowSource = useStore((state) => state.rootWorkflowSource);
  const showSuccessMsg = useSnackbarStore((state) => state.showSuccessMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const [action, setAction] = useState<
    GraphFormAction.newGraph | GraphFormAction.newGraphOrOverwrite
  >(GraphFormAction.newGraph);

  function handleError(text: string) {
    showErrorMsg(text);
    setStatus('error');
  }

  async function handleSave(): Promise<boolean> {
    // DOC: search if id exists.
    // 1. If notExists open dialog for NEW NAME.
    // 2. If exists and you took it from the server UPDATE without asking
    // 3. If exists and you took it from elseware open dialog for new name OR OVERWRITE
    const response = await getWorkflowIdsFromServer();
    if (response.error) {
      handleError(
        textForError(response.error, commonStrings.retrieveWorkflowsError),
      );
      return false;
    }

    const workflowsIds = response.data;

    if (!workflowsIds.includes(displayedWorkflowInfo.id)) {
      setAction(GraphFormAction.newGraph);
      setDialogOpen(true);
      return false;
    }

    if (!rootWorkflowSource) {
      handleError('No graph exists to save!');
      return false;
    }

    if (rootWorkflowSource !== 'fromServer') {
      setAction(GraphFormAction.newGraphOrOverwrite);
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
    action,
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
