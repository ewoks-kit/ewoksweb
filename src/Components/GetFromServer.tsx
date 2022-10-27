import { useState } from 'react';

import DashboardStyle from '../layout/DashboardStyle';
import FormControl from '@material-ui/core/FormControl';
import AutocompleteDrop from '../Components/AutocompleteDrop';
import state from '../store/state';
import type { GraphEwoks, WorkflowDescription } from '../types';
import { getWorkflow } from '../utils/api';
import ConfirmDialog from './ConfirmDialog';
import { validateEwoksGraph } from '../utils/EwoksValidator';

const useStyles = DashboardStyle;

export default function GetFromServer() {
  const classes = useStyles();

  const [workflowId, setWorkflowId] = useState('');
  const setWorkingGraph = state((state) => state.setWorkingGraph);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const setCanvasGraphChanged = state((state) => state.setCanvasGraphChanged);
  const graphRF = state((state) => state.graphRF);
  const canvasGraphChanged = state((state) => state.canvasGraphChanged);
  const undoIndex = state((state) => state.undoIndex);

  async function setInputValue(workflowDetails: WorkflowDescription) {
    // console.log(workflowDetails, graphRF);

    if (workflowDetails?.id) {
      setWorkflowId(workflowDetails.id || '');
    }

    setOpenAgreeDialog(false);
    if (workflowDetails?.id && graphRF?.graph?.id !== workflowDetails.id) {
      if (canvasGraphChanged && undoIndex !== 0) {
        setOpenAgreeDialog(true);
      } else {
        // console.log(workflowDetails.id);
        getFromServer(workflowDetails.id);
      }
    }
  }

  async function getFromServer(workflowIdparam: string) {
    if (workflowIdparam) {
      // setGettingFromServer(true);
      try {
        const response = await getWorkflow(workflowIdparam);
        if (response.data) {
          const graph = response.data as GraphEwoks;
          setOpenSnackbar({
            open: true,
            text: `Workflow ${graph.graph.label} was downloaded successfully`,
            severity: 'success',
          });
          setCanvasGraphChanged(false);
          setWorkingGraph(graph, 'fromServer');
          validateEwoksGraph(graph);
        } else {
          setOpenSnackbar({
            open: true,
            text:
              'Could not locate the requested workflow! Maybe it is deleted!',
            severity: 'warning',
          });
        }
      } catch (error) {
        // console.log(error);
        setOpenSnackbar({
          open: true,
          text:
            error.response?.data?.message ||
            'Error in retrieving workflow. Please check connectivity with the server!',
          severity: 'error',
        });
      } finally {
        // setGettingFromServer(false);
      }
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please select a graph to fetch and re-click!',
        severity: 'warning',
      });
    }
  }

  const disAgreeSaveWithout = () => {
    setOpenAgreeDialog(false);
  };

  return (
    <>
      <ConfirmDialog
        title="There are unsaved changes"
        content="Continue without saving?"
        open={openAgreeDialog}
        agreeCallback={() => getFromServer(workflowId)}
        disagreeCallback={disAgreeSaveWithout}
      />
      <FormControl
        variant="standard"
        style={{
          minWidth: '220px',
          backgroundColor: '#7685dd',
          borderRadius: '4px',
        }}
        className={classes.formControl}
      >
        <AutocompleteDrop
          setInputValue={setInputValue}
          placeholder="Open Workflow"
          category=""
        />
      </FormControl>
    </>
  );
}
