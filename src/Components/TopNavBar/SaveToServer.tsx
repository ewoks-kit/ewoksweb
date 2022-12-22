import { useState, useEffect } from 'react';
import IntegratedSpinner from '../General/IntegratedSpinner';
import { rfToEwoks } from '../../utils';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import useStore from '../../store/useStore';
import commonStrings from '../../commonStrings.json';
import FormDialog from '../General/FormDialog';
import curateGraph from './utils/curateGraph';
import { getWorkflowsIds, putWorkflow } from '../../utils/api';
import { FormAction } from '../../types';

function workflowExists(id, workflowsIds) {
  return workflowsIds.data.identifiers.includes(id);
}

// DOC: Save to server button with its spinner
export default function SaveToServer({ saveToServerF }) {
  const setGettingFromServer = useStore((st) => st.setGettingFromServer);
  const setCanvasGraphChanged = useStore((st) => st.setCanvasGraphChanged);
  const graphRF = useStore((state) => state.graphRF);
  const workingGraph = useStore((state) => state.workingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);
  const [action, setAction] = useState<FormAction>(FormAction.newGraph);

  useEffect(() => {
    saveToServerF.current = saveToServer;
  });

  async function saveToServer() {
    // DOC: Remove empty lines if any in DataMapping, Conditions, DefaultValues
    // and Nodes DataMapping before attempting to save
    const graphRFCurrated = curateGraph(graphRF);
    // DOC: search if id exists.
    // 1. If notExists open dialog for NEW NAME.
    // 2. If exists and you took it from me UPDATE without asking
    // 3. If exists and you took it from elseware open dialog for new name OR OVERWRITE
    const workflowsIds = await getWorkflowsIds();
    setGettingFromServer(true);
    const exists = workflowExists(graphRF.graph.id, workflowsIds);

    if (!exists) {
      setAction(FormAction.newGraph);
      setOpenSaveDialog(true);
    } else if (workingGraph.graph.id === graphRF.graph.id) {
      if (graphRF.graph.uiProps.source === 'fromServer') {
        try {
          await putWorkflow(rfToEwoks(graphRFCurrated));
          setOpenSnackbar({
            open: true,
            text: 'Graph saved successfully!',
            severity: 'success',
          });
          setCanvasGraphChanged(false);
        } catch (error) {
          setOpenSnackbar({
            open: true,
            text: error.response?.data?.message || commonStrings.savingError,
            severity: 'error',
          });
        } finally {
          setGettingFromServer(false);
        }
      } else if (graphRF.graph.uiProps.source !== 'fromServer') {
        setAction(FormAction.newGraphOrOverwrite);
        setOpenSaveDialog(true);
      } else {
        setGettingFromServer(false);
        setOpenSnackbar({
          open: true,
          text: 'No graph exists to save!',
          severity: 'warning',
        });
      }
    } else {
      setGettingFromServer(false);
      setOpenSnackbar({
        open: true,
        text:
          'Cannot save any changes to subgraphs! Open it as the main graph to make changes.',
        severity: 'warning',
      });
    }
  }

  return (
    <>
      <FormDialog
        elementToEdit={graphRF}
        action={action}
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
      />
      <IntegratedSpinner
        tooltip="Save to Server"
        action={() => null}
        getting={false}
        onClick={() => {
          saveToServer();
        }}
      >
        <CloudUploadIcon />
      </IntegratedSpinner>
    </>
  );
}
