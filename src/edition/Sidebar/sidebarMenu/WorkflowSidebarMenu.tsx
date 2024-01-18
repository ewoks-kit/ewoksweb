import { Delete as DeleteIcon } from '@mui/icons-material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReactFlow } from 'reactflow';

import { useTasks } from '../../../api/tasks';
import { deleteWorkflow } from '../../../api/workflows';
import { useInvalidateWorkflows } from '../../../api/workflows';
import commonStrings from '../../../commonStrings.json';
import ConfirmDialog from '../../../general/ConfirmDialog';
import GraphFormDialog from '../../../general/forms/GraphFormDialog';
import useSnackbarStore from '../../../store/useSnackbarStore';
import useStore from '../../../store/useStore';
import SuspenseBoundary from '../../../suspense/SuspenseBoundary';
import { GraphFormAction } from '../../../types';
import { textForError } from '../../../utils';
import { EMPTY_GRAPH } from '../../../utils/emptyGraphs';

interface Props {
  onSelection: () => void;
}

export default function WorkflowSidebarMenu(props: Props) {
  const { onSelection } = props;
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);

  const showSuccessMsg = useSnackbarStore((state) => state.showSuccessMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const rfInstance = useReactFlow();
  const tasks = useTasks();
  const invalidateWorkflows = useInvalidateWorkflows();

  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);
  const setRootWorkflow = useStore((state) => state.setRootWorkflow);
  const [, setSearchParams] = useSearchParams();

  async function agreeCallback() {
    setOpenAgreeDialog(false);
    if (displayedWorkflowInfo.id) {
      try {
        await deleteWorkflow(displayedWorkflowInfo.id);
        setRootWorkflow(EMPTY_GRAPH, rfInstance, tasks);
        showSuccessMsg(
          `Workflow ${displayedWorkflowInfo.id} successfully deleted!`,
        );
        invalidateWorkflows();
        setSearchParams({});
      } catch (error) {
        showErrorMsg(textForError(error, commonStrings.deletingError));
      }
    }
  }

  function disagreeCallback() {
    setOpenAgreeDialog(false);
  }

  return (
    <>
      <SuspenseBoundary>
        <GraphFormDialog
          elementToEdit={displayedWorkflowInfo}
          action={GraphFormAction.cloneGraph}
          isOpen={openSaveDialog}
          onClose={() => setOpenSaveDialog(false)}
        />
      </SuspenseBoundary>

      <MenuItem
        onClick={() => setOpenSaveDialog(true)}
        role="menuitem"
        disabled={
          !rootWorkflowId || rootWorkflowId !== displayedWorkflowInfo.id
        }
      >
        <ListItemIcon>
          <FileCopyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Clone Workflow</ListItemText>
        <Typography variant="body2" color="primary" />
      </MenuItem>
      <MenuItem
        onClick={() => setOpenAgreeDialog(true)}
        role="menuitem"
        disabled={
          !rootWorkflowId || rootWorkflowId !== displayedWorkflowInfo.id
        }
      >
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete Workflow</ListItemText>
        <Typography variant="body2" color="primary" />
      </MenuItem>

      <ConfirmDialog
        title={`Delete workflow with id: "${displayedWorkflowInfo.id}"?`}
        content={`You are about to delete the workflow with id: "${displayedWorkflowInfo.id}".
              Please make sure that it is not used as a sub-workflow in other workflows!
              Do you agree to continue?`}
        open={openAgreeDialog}
        agreeCallback={() => {
          agreeCallback();
          onSelection();
        }}
        disagreeCallback={() => {
          disagreeCallback();
          onSelection();
        }}
      />
    </>
  );
}
