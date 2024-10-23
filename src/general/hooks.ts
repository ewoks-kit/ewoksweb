import type { Edge } from '@xyflow/react';
import { useReactFlow } from '@xyflow/react';
import { useState } from 'react';

import {
  putWorkflow,
  useInvalidateWorkflow,
  useInvalidateWorkflowDescriptions,
  useWorkflowIds,
} from '../api/workflows';
import type { Status } from '../edition/TopAppBar/models';
import useSnackbarStore from '../store/useSnackbarStore';
import useWorkflowHistory from '../store/useWorkflowHistory';
import useWorkflowStore from '../store/useWorkflowStore';
import { WorkflowSource } from '../types';
import { getEdgesData, getNodesData, toEwoksWorkflow } from '../utils';

export function useSaveWorkflow() {
  const displayedWorkflowInfo = useWorkflowStore((state) => state.workflowInfo);
  const rfInstance = useReactFlow();
  const workflowIds = useWorkflowIds();
  const invalidateWorkflowDescriptions = useInvalidateWorkflowDescriptions();
  const invalidateWorkflow = useInvalidateWorkflow();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const rootWorkflowSource = useWorkflowStore((state) => state.workflowSource);
  const showSuccessMsg = useSnackbarStore((state) => state.showSuccessMsg);
  const resetWorkflowHistory = useWorkflowHistory(
    (state) => state.resetWorkflowHistory,
  );

  async function handleSave(): Promise<boolean> {
    // If the workflow does not exist on the server or was imported from disk, open dialog asking the user for a name
    if (
      rootWorkflowSource === WorkflowSource.Disk ||
      !workflowIds.has(displayedWorkflowInfo.id)
    ) {
      setDialogOpen(true);
      return false;
    }

    if (rootWorkflowSource === WorkflowSource.Empty) {
      throw new Error('No graph exists to save!');
    }

    await putWorkflow(
      toEwoksWorkflow(
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
  }

  return {
    isDialogOpen,
    setDialogOpen,
    status,
    setStatus,
    handleSave,
  };
}

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
