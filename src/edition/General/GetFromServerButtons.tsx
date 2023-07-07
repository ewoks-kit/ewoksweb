import { useState } from 'react';

import IntegratedSpinner from './IntegratedSpinner';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import useStore from '../../store/useStore';
import { getWorkflow } from '../../api/api';
import ConfirmDialog from 'edition/General/ConfirmDialog';
import { textForError } from '../../utils';
import { useReactFlow } from 'reactflow';
import useNodeDataStore from '../../store/useNodeDataStore';

interface GetFromServerButtonsProps {
  workflowId: string;
  showButtons: boolean[];
}

// DOC: buttons used to get or save to server
export default function GetFromServerButtons(props: GetFromServerButtonsProps) {
  const { workflowId, showButtons } = props;

  const rfInstance = useReactFlow();

  const setSubGraph = useStore((state) => state.setSubGraph);
  const initGraph = useStore((state) => state.initGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const [gettingFromServer, setGettingFromServer] = useState(false);
  const graphInfo = useStore((state) => state.graphInfo);
  const canvasGraphChanged = useStore((state) => state.canvasGraphChanged);
  const setCanvasGraphChanged = useStore(
    (state) => state.setCanvasGraphChanged
  );
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);
  const undoIndex = useStore((state) => state.undoIndex);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  function getSubgraphFromServer() {
    getFromServer('subgraph');
  }

  function disAgreeSaveWithout() {
    setOpenAgreeDialog(false);
  }

  async function getFromServer(isSubgraph: string) {
    setOpenAgreeDialog(false);
    if (workflowId) {
      setGettingFromServer(true);
      try {
        const response = await getWorkflow(workflowId);
        const graph = response.data;
        setOpenSnackbar({
          open: true,
          text: `Workflow ${
            graph.graph.label || 'without label!!!'
          } was downloaded successfully`,
          severity: 'success',
        });
        setCanvasGraphChanged(false);
        const nodes = rfInstance.getNodes();
        if (isSubgraph === 'subgraph') {
          const { nodeWithoutData, data } = await setSubGraph(
            graph,
            nodes,
            rfInstance.getEdges()
          );

          rfInstance.setNodes([...nodes, nodeWithoutData]);
          setNodeData(nodeWithoutData.id, data);
        } else {
          initGraph(graph, 'fromServer', rfInstance);
        }
      } catch (error) {
        setOpenSnackbar({
          open: true,
          text: textForError(
            error,
            'Error in retrieving workflow. Please check connectivity with the server!'
          ),
          severity: 'error',
        });
      } finally {
        setGettingFromServer(false);
      }
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please select a graph to fetch and re-click!',
        severity: 'warning',
      });
    }
  }

  const checkAndGetFromServer = (isSubgraph: string) => {
    if (
      workflowId &&
      graphInfo.id &&
      graphInfo.id !== workflowId &&
      canvasGraphChanged &&
      undoIndex !== 0
    ) {
      setOpenAgreeDialog(true);
    } else {
      getFromServer(isSubgraph);
    }
  };

  return (
    <>
      <ConfirmDialog
        title="There are unsaved changes"
        content="Continue without saving?"
        open={openAgreeDialog}
        agreeCallback={getFromServer}
        disagreeCallback={disAgreeSaveWithout}
      />
      {showButtons[0] && (
        <IntegratedSpinner
          getting={gettingFromServer}
          tooltip="Open from Server"
          action={() => checkAndGetFromServer('')}
          onClick={() => {
            // Keep logging in console for debugging when talking with a user
            /* eslint-disable no-console */
            console.log('Getting from server');
          }}
        >
          <CloudDownloadIcon />
        </IntegratedSpinner>
      )}
      {showButtons[1] && (
        <IntegratedSpinner
          getting={gettingFromServer}
          tooltip="Add workflow as subgraph"
          action={getSubgraphFromServer}
          onClick={() => {
            // Keep logging in console for debugging when talking with a user
            /* eslint-disable no-console */
            console.log('Getting subgraph from server');
          }}
        >
          <ArrowDownwardIcon />
        </IntegratedSpinner>
      )}
    </>
  );
}
