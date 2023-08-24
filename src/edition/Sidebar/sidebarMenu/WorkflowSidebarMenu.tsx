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

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const rfInstance = useReactFlow();
  const tasks = useTasks();

  const graphInfo = useStore((state) => state.graphInfo);
  const workingGraph = useStore((state) => state.workingGraph);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);

  async function agreeCallback() {
    setOpenAgreeDialog(false);
    if (graphInfo.id) {
      try {
        await deleteWorkflow(graphInfo.id);
        setOpenSnackbar({
          open: true,
          text: `Workflow ${graphInfo.id} successfully deleted!`,
          severity: 'success',
        });
        setWorkingGraph(EMPTY_GRAPH, rfInstance, tasks);
      } catch (error) {
        setOpenSnackbar({
          open: true,
          text: textForError(error, commonStrings.deletingError),
          severity: 'error',
        });
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
          elementToEdit={graphInfo}
          action={GraphFormAction.cloneGraph}
          isOpen={openSaveDialog}
          onClose={() => setOpenSaveDialog(false)}
        />
      </SuspenseBoundary>

      <MenuItem
        onClick={() => setOpenSaveDialog(true)}
        role="sidebarMenuItem"
        disabled={
          !workingGraph.graph.id || workingGraph.graph.id !== graphInfo.id
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
          !workingGraph.graph.id || workingGraph.graph.id !== graphInfo.id
        }
      >
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete Workflow</ListItemText>
        <Typography variant="body2" color="primary" />
      </MenuItem>

      <ConfirmDialog
        title={`Delete workflow with id: "${graphInfo.id}"?`}
        content={`You are about to delete the workflow with id: "${graphInfo.id}".
              Please make sure that it is not used as a sub-workflow in other workflows!
              Do you agree to continue?`}
        open={openAgreeDialog}
        agreeCallback={agreeCallback}
        disagreeCallback={disagreeCallback}
      />
    </>
  );
}
