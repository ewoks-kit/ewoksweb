import { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import GraphFormDialog from '../../../general/forms/GraphFormDialog';
import useStore from '../../../store/useStore';
import { GraphFormAction } from '../../../types';
import { Delete as DeleteIcon } from '@material-ui/icons';
import ConfirmDialog from '../../../general/ConfirmDialog';
import { deleteWorkflow } from 'api/workflows';
import commonStrings from 'commonStrings.json';
import { textForError } from '../../../utils';
import { EMPTY_GRAPH } from '../../../utils/emptyGraphs';
import { useReactFlow } from 'reactflow';
import { useTasks } from '../../../api/tasks';
import SuspenseBoundary from '../../../suspense/SuspenseBoundary';

export default function WorkflowSidebarMenu() {
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);

  const showSuccessMsg = useStore((state) => state.showSuccessMsg);
  const showErrorMsg = useStore((state) => state.showErrorMsg);
  const rfInstance = useReactFlow();
  const tasks = useTasks();

  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo
  );
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);
  const setRootWorkflow = useStore((state) => state.setRootWorkflow);

  async function agreeCallback() {
    setOpenAgreeDialog(false);
    if (displayedWorkflowInfo.id) {
      try {
        await deleteWorkflow(displayedWorkflowInfo.id);
        setRootWorkflow(EMPTY_GRAPH, rfInstance, tasks);
        showSuccessMsg(
          `Workflow ${displayedWorkflowInfo.id} successfully deleted!`
        );
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
        role="sidebarMenuItem"
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
        role="sidebarMenuItem"
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
        agreeCallback={agreeCallback}
        disagreeCallback={disagreeCallback}
      />
    </>
  );
}
