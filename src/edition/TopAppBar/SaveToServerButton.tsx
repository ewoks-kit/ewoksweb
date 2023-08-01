import useStore from '../../store/useStore';
import GraphFormDialog from '../../general/forms/GraphFormDialog';
import { useState } from 'react';
import { GraphFormAction } from '../../types';
import { useKeyboardEvent } from '@react-hookz/web';
import type { EwoksRFLinkData, EwoksRFNodeData } from '../../types';
import { putWorkflow, useMutateWorkflows } from '../../api/workflows';
import { getEdgesData, rfToEwoks, textForError } from '../../utils';
import commonStrings from '../../commonStrings.json';
import { useReactFlow } from 'reactflow';
import { getNodesData } from '../../utils';
import { getWorkflowIdsFromServer, curateGraph } from './utils';

import styles from './TopAppBar.module.css';
import { IconButton, Tooltip } from '@material-ui/core';
import tooltipText from '../../general/TooltipText';
import type { Status } from './models';
import StatusIcon from './StatusButton';

// DOC: Save to server button with its spinner
export default function SaveToServerButton() {
  const graphInfo = useStore((state) => state.graphInfo);
  const rfInstance = useReactFlow();
  const mutateWorkflows = useMutateWorkflows();

  const [isDialogOpen, setDialogOpen] = useState(false);

  const [status, setStatus] = useState<Status>('idle');

  const workingGraph = useStore((state) => state.workingGraph);
  const workingGraphSource = useStore((state) => state.workingGraphSource);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const [action, setAction] = useState<
    GraphFormAction.newGraph | GraphFormAction.newGraphOrOverwrite
  >(GraphFormAction.newGraph);

  function handleError(text: string) {
    setOpenSnackbar({
      open: true,
      text,
      severity: 'error',
    });
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
        textForError(response.error, commonStrings.retrieveWorkflowsError)
      );
      return;
    }

    const workflowsIds = response.data;

    if (!workflowsIds.includes(graphInfo.id)) {
      setAction(GraphFormAction.newGraph);
      setDialogOpen(true);
      return;
    }

    if (workingGraph.graph.id !== graphInfo.id) {
      handleError(
        'Cannot save any changes to subgraphs! Open it as the main graph to make changes.'
      );
      return;
    }

    if (!workingGraphSource) {
      handleError('No graph exists to save!');
      return;
    }

    if (workingGraphSource !== 'fromServer') {
      setAction(GraphFormAction.newGraphOrOverwrite);
      setDialogOpen(true);
      return;
    }

    // DOC: Remove empty lines if any in DataMapping, Conditions, DefaultValues
    try {
      const { newNodesData, newEdgesData } = curateGraph(
        getNodesData(),
        getEdgesData()
      );

      const nodesWithData = [...rfInstance.getNodes()].map((node) => {
        return {
          ...node,
          data: newNodesData.get(node.id) as EwoksRFNodeData,
        };
      });

      const edgesWithData = [...rfInstance.getEdges()].map((edge) => {
        return {
          ...edge,
          data: newEdgesData.get(edge.id) as EwoksRFLinkData,
        };
      });

      await putWorkflow(
        rfToEwoks({
          graph: graphInfo,
          nodes: nodesWithData,
          links: edgesWithData,
        })
      );
      mutateWorkflows();

      setOpenSnackbar({
        open: true,
        text: 'Graph saved successfully!',
        severity: 'success',
      });
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
    []
  );

  return (
    <>
      <GraphFormDialog
        elementToEdit={graphInfo}
        action={action}
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
      />
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
