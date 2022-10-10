import { useState } from 'react';

import DashboardStyle from '../layout/DashboardStyle';
import FormControl from '@material-ui/core/FormControl';
import AutocompleteDrop from '../Components/AutocompleteDrop';
// import GetFromServerButtons from './GetFromServerButtons';
import useGetWorkflow from '../hooks/useGetWorkflow';
import state from '../store/state';
import type { GraphEwoks } from '../types';
import { getWorkflow } from '../utils/api';

const useStyles = DashboardStyle;

interface GetFromServerProps {
  workflowIdInAutocomplete(id: string): void;
}
export default function GetFromServer(props: GetFromServerProps) {
  const classes = useStyles();

  const [workflowId, setWorkflowId] = useState('');
  const setWorkingGraph = state((state) => state.setWorkingGraph);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const setCanvasGraphChanged = state((state) => state.setCanvasGraphChanged);
  const graphRF = state((state) => state.graphRF);
  const canvasGraphChanged = state((state) => state.canvasGraphChanged);
  const undoIndex = state((state) => state.undoIndex);

  const setInputValue = async (workflowDetails) => {
    console.log(workflowDetails);
    if (workflowDetails && workflowDetails.id) {
      setWorkflowId(workflowDetails.id || '');
      props.workflowIdInAutocomplete(workflowDetails.id || '');
    }

    console.log('get from server');
    setOpenAgreeDialog(false);
    if (
      workflowDetails &&
      workflowDetails.id &&
      graphRF.graph.id &&
      graphRF.graph.id !== workflowId &&
      canvasGraphChanged &&
      undoIndex !== 0
    ) {
      setOpenAgreeDialog(true);
    } else {
      if (workflowDetails && workflowDetails.id) {
        // setGettingFromServer(true);
        try {
          const response = await getWorkflow(workflowDetails.id);
          if (response.data) {
            const graph = response.data as GraphEwoks;
            // setCallSuccess(true);
            setOpenSnackbar({
              open: true,
              text: `Workflow ${graph.graph.label} was downloaded succesfully`,
              severity: 'success',
            });
            setCanvasGraphChanged(false);
            setWorkingGraph(graph, 'fromServer');
          } else {
            setOpenSnackbar({
              open: true,
              text:
                'Could not locate the requested workflow! Maybe it is deleted!',
              severity: 'warning',
            });
          }
        } catch (error) {
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
  };

  return (
    <>
      <FormControl
        variant="standard"
        // TODO: remove if build problem is resolved
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
      {/* TODO remove buttons if not used here */}
      {/* <GetFromServerButtons
        workflowId={workflowId}
        showButtons={[false, false]}
      /> */}
    </>
  );
}
