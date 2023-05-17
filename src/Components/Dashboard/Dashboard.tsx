import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import EditSidebar from 'Components/Sidebar/EditSidebar';
// import { Link } from 'react-router-dom';
import Canvas from '../Canvas/Canvas';
// import UndoRedo from '../TopNavBar/UndoRedo';
import GetFromServer from '../General/GetFromServer';
import SimpleSnackbar from '../General/Snackbar';
import SettingsInfoDrawer from '../TopNavBar/SettingsInfoDrawer';
import SubgraphsStack from '../TopNavBar/SubgraphsStack';
import LinearSpinner from '../General/LinearSpinner';
// import ExecuteWorkflow from '../Execution/ExecuteWorkflow';
import { useDashboardStyles } from './useDashboardStyles';
import SaveToServer from '../TopNavBar/SaveToServer';
import useStore from 'store/useStore';
// import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import FormDialog from '../General/FormDialog';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../General/ErrorFallback';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import type { EwoksRFLinkData, EwoksRFNodeData } from '../../types';
import { FormAction } from '../../types';
import { getWorkflow, getWorkflowsIds, putWorkflow } from '../../api/api';
import { getEdgesData, rfToEwoks, textForError } from '../../utils';
import commonStrings from '../../commonStrings.json';
import type { AxiosResponse } from 'axios';
import curateGraph from '../TopNavBar/utils/curateGraph';
import { useReactFlow } from 'reactflow';
import { getNodesData } from '../../utils';
import OverflowDrawer from '../AddNodesDrawer/OverflowDrawer';
import { getTaskDescription } from '../../api/tasks';
import MoreMenu from '../TopNavBar/MoreMenu';
import addNodesSidebarState from '../../store/addNodesSidebarState';

const initialWorkflowId = process.env.REACT_APP_INITIAL_WORKFLOW_ID;

function workflowExists(
  id: string,
  workflowsIds: AxiosResponse<{ identifiers: string[] }>
) {
  return workflowsIds.data.identifiers.includes(id);
}

export default function Dashboard() {
  const classes = useDashboardStyles();

  const rfInstance = useReactFlow();

  const [openDrawers, setOpenDrawers] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const gettingFromServer = useStore((state) => state.gettingFromServer);
  const graphInfo = useStore((state) => state.graphInfo);
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);
  const openSettingsDrawer = useStore((state) => state.openSettingsDrawer);
  const setOpenSettingsDrawer = useStore(
    (state) => state.setOpenSettingsDrawer
  );
  const canvasGraphChanged = useStore((state) => state.canvasGraphChanged);
  const setCanvasGraphChanged = useStore(
    (state) => state.setCanvasGraphChanged
  );
  const setGettingFromServer = useStore((st) => st.setGettingFromServer);
  const workingGraph = useStore((state) => state.workingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const tasks = useStore((state) => state.tasks);
  const setTasks = useStore((state) => state.setTasks);
  const toggleAddNodesSidebar = addNodesSidebarState(
    (state) => state.toggleAddNodesSidebar
  );

  const [action, setAction] = useState<FormAction>(FormAction.newGraph);

  const setUndoIndex = useStore((state) => state.setUndoIndex);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const undoIndex = useStore((state) => state.undoIndex);
  const initializedGraph = useStore((state) => state.initializedGraph);
  const initGraph = useStore((state) => state.initGraph);

  useEffect(() => {
    if (initialWorkflowId) {
      const loadGraph = async () => {
        const { data: graph } = await getWorkflow(initialWorkflowId);
        initGraph(graph, 'fromServer', rfInstance);
      };
      loadGraph();
    }
  }, [initGraph, rfInstance]);

  useEffect(() => {
    initGraph(initializedGraph, undefined, rfInstance);
    // Only run once on initial render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!openDrawers) {
      setOpenSettings(false);
      setOpenSettingsDrawer('Workflows');
    }
  }, [openDrawers, openSettings, setOpenSettingsDrawer]);

  useEffect(() => {
    if (openSettingsDrawer === 'Executions') {
      setOpenInfo(false);
      setOpenDrawers(true);
      setOpenSettings(true);
      return;
    }

    if (openSettingsDrawer === 'close') {
      setOpenInfo(false);
      setOpenDrawers(false);
      setOpenSettings(false);
    }
  }, [openSettingsDrawer]);

  useEffect(() => {
    // TODO: examine the strategy for re-fetching tasks like with icons
    if (tasks.length === 0) {
      getTasks();
    }
  });

  const getTasks = async () => {
    try {
      const tasksData = await getTaskDescription();
      if (tasksData.data.items.length > 0) {
        const allTasks = tasksData.data.items;
        setTasks(allTasks);
      }
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(error, commonStrings.retrieveTasksError),
        severity: 'error',
      });
    }
  };

  function checkAndNewGraph(notSave: boolean) {
    if (canvasGraphChanged && undoIndex !== 0 && !notSave) {
      setOpenAgreeDialog(true);
    } else {
      initGraph(initializedGraph, undefined, rfInstance);
      setOpenSaveDialog(true);
      setOpenAgreeDialog(false);
      setCanvasGraphChanged(false);
      toggleAddNodesSidebar(true);
    }
  }

  function handleOpenSettings() {
    setOpenInfo(false);
    setOpenSettings(true);
    setOpenDrawers(true);
  }

  function handleOpenDrawers() {
    setOpenDrawers(!openDrawers);
  }

  // TODO: remove? this type of styling
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  function handleKeyDown(event: React.KeyboardEvent<HTMLImageElement>) {
    const controlKey = event.ctrlKey || event.metaKey;
    if (!controlKey) {
      return;
    }

    const charCode = String.fromCodePoint(event.which).toLowerCase();

    if (charCode === 's') {
      event.preventDefault();
      event.stopPropagation();
      saveToServer();
      return;
    }
    if (charCode === 'z') {
      event.preventDefault();
      event.stopPropagation();
      undo();
      return;
    }
    if (charCode === 'y') {
      event.preventDefault();
      event.stopPropagation();
      redo();
      return;
    }
    if (event.shiftKey && charCode === 'n') {
      event.preventDefault();
      event.stopPropagation();
      checkAndNewGraph(false);
    }
  }

  const disAgreeSaveWithout = () => {
    setOpenAgreeDialog(false);
  };

  function undo() {
    setUndoIndex(undoIndex - 1);
  }

  function redo() {
    setUndoIndex(undoIndex + 1);
  }

  async function saveToServer() {
    // DOC: Remove empty lines if any in DataMapping, Conditions, DefaultValues
    // DOC: search if id exists.
    // 1. If notExists open dialog for NEW NAME.
    // 2. If exists and you took it from the server UPDATE without asking
    // 3. If exists and you took it from elseware open dialog for new name OR OVERWRITE
    const workflowsIds = await getWorkflowsIds();
    setGettingFromServer(true);

    if (!workflowExists(graphInfo.id, workflowsIds)) {
      setAction(FormAction.newGraph);
      setOpenSaveDialog(true);
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
        setCanvasGraphChanged(false);
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
      setAction(FormAction.newGraphOrOverwrite);
      setOpenSaveDialog(true);
      return;
    }

    setGettingFromServer(false);
    setOpenSnackbar({
      open: true,
      text: 'No graph exists to save!',
      severity: 'warning',
    });
  }

  return (
    <div
      className={classes.root}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
    >
      <ConfirmDialog
        title="There are unsaved changes"
        content="Continue without saving?"
        open={openAgreeDialog}
        agreeCallback={() => checkAndNewGraph(true)}
        disagreeCallback={disAgreeSaveWithout}
      />
      <FormDialog
        elementToEdit={graphInfo}
        action={FormAction.newGraph}
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
      />
      <CssBaseline />
      <SimpleSnackbar />
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <SubgraphsStack />

          <GetFromServer />
          <SaveToServer
            saveToServer={async () => void saveToServer()}
            action={action}
            open={openSaveDialog}
            setOpenSaveDialog={setOpenSaveDialog}
          />
          <div>
            <MoreMenu
              checkAndNewGraph={() => checkAndNewGraph(false)}
              handleOpenSettings={handleOpenSettings}
            />
          </div>
          <SettingsInfoDrawer
            handleOpenDrawers={handleOpenDrawers}
            openDrawers={openDrawers}
            openInfo={openInfo}
            openSettings={openSettings}
          />
        </Toolbar>
      </AppBar>
      <OverflowDrawer />
      <ReflexContainer
        orientation="vertical"
        className={classes.reflexContainer}
      >
        <ReflexElement className="right-pane">
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Paper className={fixedHeightPaper}>
              {gettingFromServer && <LinearSpinner />}

              <ErrorBoundary
                FallbackComponent={(fallbackProps) => (
                  <ErrorFallback {...fallbackProps} />
                )}
              >
                <Canvas />
              </ErrorBoundary>
            </Paper>
          </main>
        </ReflexElement>
        <ReflexSplitter propagate className={classes.reflexSplitter} />
        <ReflexElement minSize={100} maxSize={500} size={350}>
          <EditSidebar />
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
}
