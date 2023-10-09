import { IconButton, Tooltip } from '@mui/material';
import { useKeyboardEvent } from '@react-hookz/web';
import { useState } from 'react';
import { useReactFlow } from 'reactflow';

import { putWorkflow, useInvalidateWorkflows } from '../../api/workflows';
import commonStrings from '../../commonStrings.json';
import GraphFormDialog from '../../general/forms/GraphFormDialog';
import tooltipText from '../../general/TooltipText';
import useSnackbarStore from '../../store/useSnackbarStore';
import useStore from '../../store/useStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import { GraphFormAction } from '../../types';
import { getEdgesData, prepareEwoksGraph, textForError } from '../../utils';
import { getNodesData } from '../../utils';
import type { Status } from './models';
import StatusIcon from './StatusButton';
import styles from './TopAppBar.module.css';
import { getWorkflowIdsFromServer } from './utils';

// DOC: Save to server button with its spinner
export default function SaveToServerButton() {
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const rfInstance = useReactFlow();
  const invalidateWorkflows = useInvalidateWorkflows();

  const [isDialogOpen, setDialogOpen] = useState(false);

  const [status, setStatus] = useState<Status>('idle');

  const rootWorkflowId = useStore((state) => state.rootWorkflowId);
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

  async function handleSave() {
    // DOC: search if id exists.
    // 1. If notExists open dialog for NEW NAME.
    // 2. If exists and you took it from the server UPDATE without asking
    // 3. If exists and you took it from elseware open dialog for new name OR OVERWRITE

    const response = await getWorkflowIdsFromServer();
    if (response.error) {
      handleError(
        textForError(response.error, commonStrings.retrieveWorkflowsError),
      );
      return;
    }

    const workflowsIds = response.data;

    if (!workflowsIds.includes(displayedWorkflowInfo.id)) {
      setAction(GraphFormAction.newGraph);
      setDialogOpen(true);
      return;
    }

    if (rootWorkflowId !== displayedWorkflowInfo.id) {
      handleError(
        'Cannot save any changes to subgraphs! Open it as the main graph to make changes.',
      );
      return;
    }

    if (!rootWorkflowSource) {
      handleError('No graph exists to save!');
      return;
    }

    if (rootWorkflowSource !== 'fromServer') {
      setAction(GraphFormAction.newGraphOrOverwrite);
      setDialogOpen(true);
      return;
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
      invalidateWorkflows();

      showSuccessMsg('Graph saved successfully!');
      setStatus('success');
    } catch (error) {
      handleError(textForError(error, commonStrings.savingError));
    }
  }

  useKeyboardEvent(
    (e) => (e.ctrlKey || e.metaKey) && e.key === 's',
    (e) => {
      e.preventDefault();
      void handleSave();
    },
    [],
  );

  return (
    <>
      <SuspenseBoundary>
        <GraphFormDialog
          elementToEdit={displayedWorkflowInfo}
          action={action}
          isOpen={isDialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      </SuspenseBoundary>
      <Tooltip title={tooltipText('Save to server')} enterDelay={500} arrow>
        <IconButton
          className={styles.saveButton}
          onClick={() => {
            void handleSave();
          }}
          aria-label="Save workflow to server"
          color="inherit"
        >
          <StatusIcon status={status} setStatus={setStatus} />
        </IconButton>
      </Tooltip>
    </>
  );
}
