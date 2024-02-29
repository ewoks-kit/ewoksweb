import { Delete as DeleteIcon } from '@mui/icons-material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReactFlow } from 'reactflow';

import { useTasks } from '../../../api/tasks';
import { deleteWorkflow } from '../../../api/workflows';
import { useInvalidateWorkflowDescriptions } from '../../../api/workflows';
import commonStrings from '../../../commonStrings.json';
import ConfirmDialog from '../../../general/ConfirmDialog';
import GraphFormDialog from '../../../general/forms/GraphFormDialog';
import useSnackbarStore from '../../../store/useSnackbarStore';
import useStore from '../../../store/useStore';
import SuspenseBoundary from '../../../suspense/SuspenseBoundary';
import { textForError } from '../../../utils';

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
  const invalidateWorkflowDescriptions = useInvalidateWorkflowDescriptions();

  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);
  const resetRootWorkflow = useStore((state) => state.resetRootWorkflow);
  const [, setSearchParams] = useSearchParams();

  async function agreeCallback() {
    setOpenAgreeDialog(false);
    if (displayedWorkflowInfo.id) {
      try {
        await deleteWorkflow(displayedWorkflowInfo.id);
        invalidateWorkflowDescriptions();

        resetRootWorkflow(rfInstance, tasks);
        showSuccessMsg(
          `Workflow ${displayedWorkflowInfo.id} successfully deleted!`,
        );
        setSearchParams({});
      } catch (error) {
        showErrorMsg(textForError(error, commonStrings.deletingError));
      }
    }
  }

  return (
    <>
      <SuspenseBoundary>
        <GraphFormDialog
          elementToEdit={displayedWorkflowInfo}
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
        <ListItemText>Save as...</ListItemText>
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
          setOpenAgreeDialog(false);
          onSelection();
        }}
      />
    </>
  );
}
