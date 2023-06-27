import IntegratedSpinner from '../General/IntegratedSpinner';
import SaveIcon from '@material-ui/icons/Save';
import useStore from '../../store/useStore';
import GraphFormDialog from '../General/GraphFormDialog';
import { useState } from 'react';
import { GraphFormAction } from '../../types';
import { useKeyboardEvent } from '@react-hookz/web';
import type { EwoksRFLinkData, EwoksRFNodeData } from '../../types';
import { getWorkflowsIds, putWorkflow } from '../../api/api';
import { getEdgesData, rfToEwoks, textForError } from '../../utils';
import commonStrings from '../../commonStrings.json';
import curateGraph from './utils/curateGraph';
import { useReactFlow } from 'reactflow';
import { getNodesData } from '../../utils';

// DOC: Save to server button with its spinner
export default function SaveToServerButton() {
  const graphInfo = useStore((state) => state.graphInfo);
  const rfInstance = useReactFlow();

  const [isDialogOpen, setDialogOpen] = useState(false);

  const setGettingFromServer = useStore((state) => state.setGettingFromServer);
  const workingGraph = useStore((state) => state.workingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const [action, setAction] = useState<GraphFormAction>(
    GraphFormAction.newGraph
  );

  async function handleSave() {
    // DOC: Remove empty lines if any in DataMapping, Conditions, DefaultValues
    // DOC: search if id exists.
    // 1. If notExists open dialog for NEW NAME.
    // 2. If exists and you took it from the server UPDATE without asking
    // 3. If exists and you took it from elseware open dialog for new name OR OVERWRITE
    const { data: workflowsIds } = await getWorkflowsIds();
    setGettingFromServer(true);

    if (!workflowsIds.identifiers.includes(graphInfo.id)) {
      setAction(GraphFormAction.newGraph);
      setDialogOpen(true);
      return;
    }

    if (workingGraph.graph.id !== graphInfo.id) {
      setGettingFromServer(false);
      setOpenSnackbar({
        open: true,
        text:
          'Cannot save any changes to subgraphs! Open it as the main graph to make changes.',
        severity: 'warning',
      });
      return;
    }

    if (graphInfo.uiProps?.source === 'fromServer') {
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

        setOpenSnackbar({
          open: true,
          text: 'Graph saved successfully!',
          severity: 'success',
        });
      } catch (error) {
        setOpenSnackbar({
          open: true,
          text: textForError(error, commonStrings.savingError),
          severity: 'error',
        });
      } finally {
        setGettingFromServer(false);
      }
      return;
    }

    if (graphInfo.uiProps?.source !== 'fromServer') {
      setAction(GraphFormAction.newGraphOrOverwrite);
      setDialogOpen(true);
      return;
    }

    setGettingFromServer(false);
    setOpenSnackbar({
      open: true,
      text: 'No graph exists to save!',
      severity: 'warning',
    });
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
        open={isDialogOpen}
        setOpenSaveDialog={setDialogOpen}
      />
      <IntegratedSpinner
        tooltip="Save to Server"
        action={() => null}
        getting={false}
        onClick={() => {
          void handleSave();
        }}
      >
        <SaveIcon data-cy="saveToServer" />
      </IntegratedSpinner>
    </>
  );
}
