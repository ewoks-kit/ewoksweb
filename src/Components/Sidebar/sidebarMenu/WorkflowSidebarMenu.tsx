import { useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FormDialog from '../../General/FormDialog';
import useStore from '../../../store/useStore';
import { FormAction } from '../../../types';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { useReactFlow } from 'reactflow';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { deleteWorkflow } from 'api/api';
import commonStrings from 'commonStrings.json';
import { textForError } from '../../../utils';

export default function WorkflowSidebarMenu() {
  const rfInstance = useReactFlow();

  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);
  const initializedGraph = useStore((state) => state.initializedGraph);
  const initGraph = useStore((state) => state.initGraph);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const graphInfo = useStore((state) => state.graphInfo);
  const workingGraph = useStore((state) => state.workingGraph);
  const [cannotCloneDelete] = useState<boolean>(
    !workingGraph.graph.id || workingGraph.graph.id !== graphInfo.id
  );

  const agreeCallback = async () => {
    setOpenAgreeDialog(false);
    if (graphInfo.id) {
      try {
        await deleteWorkflow(graphInfo.id);
        setOpenSnackbar({
          open: true,
          text: `Workflow ${graphInfo.id} successfully deleted!`,
          severity: 'success',
        });
      } catch (error) {
        setOpenSnackbar({
          open: true,
          text: textForError(error, commonStrings.deletingError),
          severity: 'error',
        });
      }
    }

    initGraph(initializedGraph, undefined, rfInstance);
  };

  const disAgreeCallback = () => {
    setOpenAgreeDialog(false);
  };

  return (
    <>
      <FormDialog
        elementToEdit={graphInfo}
        action={FormAction.cloneGraph}
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
      />

      <MenuItem
        onClick={() => setOpenSaveDialog(true)}
        role="sidebarMenuItem"
        disabled={cannotCloneDelete}
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
        disabled={cannotCloneDelete}
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
              Please make sure that it is not used as a subgraph in other workflows!
              Do you agree to continue?`}
        open={openAgreeDialog}
        agreeCallback={agreeCallback}
        disagreeCallback={disAgreeCallback}
      />
    </>
  );
}
