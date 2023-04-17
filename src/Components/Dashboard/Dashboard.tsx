import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import FiberNew from '@material-ui/icons/FiberNew';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import Sidebar from 'Components/Sidebar/Sidebar';
import EditSidebar from 'Components/Sidebar/EditSidebar';
import { Link } from 'react-router-dom';
import Canvas from '../Canvas/Canvas';
// import UndoRedo from '../TopNavBar/UndoRedo';
import GetFromServer from '../General/GetFromServer';
import { Fab, IconButton, Typography } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import SimpleSnackbar from '../General/Snackbar';
import SettingsInfoDrawer from '../TopNavBar/SettingsInfoDrawer';
import SubgraphsStack from '../TopNavBar/SubgraphsStack';
import LinearSpinner from '../General/LinearSpinner';
// import ExecuteWorkflow from '../Execution/ExecuteWorkflow';
import Tooltip from '@material-ui/core/Tooltip';
import DashboardStyle from './DashboardStyle';
import SaveToServer from '../TopNavBar/SaveToServer';
import tooltipText from '../General/TooltipText';
import useStore from 'store/useStore';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import FormDialog from '../General/FormDialog';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../General/ErrorFallback';
import MenuPopover from '../General/MenuPopover';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import type { EwoksRFLinkData, EwoksRFNodeData } from '../../types';
import { FormAction } from '../../types';
import { getWorkflowsIds, putWorkflow } from '../../api/api';
import { getEdgesData, rfToEwoks, textForError } from '../../utils';
import commonStrings from '../../commonStrings.json';
import type { AxiosResponse } from 'axios';
import curateGraph from '../TopNavBar/utils/curateGraph';
import { useReactFlow } from 'reactflow';
import { getNodesData } from '../../utils';

const useStyles = DashboardStyle;

function workflowExists(
  id: string,
  workflowsIds: AxiosResponse<{ identifiers: string[] }>
) {
  return workflowsIds.data.identifiers.includes(id);
}

export default function Dashboard() {
  const classes = useStyles();

  const { getNodes, getEdges } = useReactFlow();

  const [openDrawers, setOpenDrawers] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const gettingFromServer = useStore((state) => state.gettingFromServer);
  const inExecutionMode = useStore((state) => state.inExecutionMode);
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

  const [action, setAction] = useState<FormAction>(FormAction.newGraph);

  const setUndoIndex = useStore((state) => state.setUndoIndex);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const undoIndex = useStore((state) => state.undoIndex);
  const initializedGraph = useStore((state) => state.initializedGraph);
  const initGraph = useStore((state) => state.initGraph);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setOpenSettings(false);
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

  function checkAndNewGraph(notSave: boolean) {
    if (canvasGraphChanged && undoIndex !== 0 && !notSave) {
      setOpenAgreeDialog(true);
    } else {
      initGraph(initializedGraph);
      setOpenSaveDialog(true);
      setOpenAgreeDialog(false);
      setCanvasGraphChanged(false);
    }
  }

  function openGraph() {
    handleOpenSettings();
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

        // TODO move nodesData out of Dashboard with saveToServer
        const nodesWithData = [...getNodes()].map((node) => {
          return {
            ...node,
            data: newNodesData.get(node.id) as EwoksRFNodeData,
          };
        });

        const edgesWithData = [...getEdges()].map((edge) => {
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
          <Tooltip
            title={tooltipText('Start a new workflow')}
            enterDelay={800}
            arrow
          >
            <IconButton
              color="inherit"
              onClick={() => checkAndNewGraph(false)}
              disabled={inExecutionMode}
            >
              <Fab
                className={classes.openFileButton}
                color="primary"
                size="small"
                component="span"
                aria-label="Start a new workflow"
                disabled={inExecutionMode}
              >
                <FiberNew />
              </Fab>
            </IconButton>
          </Tooltip>
          <Tooltip
            title={tooltipText('Open an existing workflow')}
            enterDelay={800}
            arrow
          >
            <IconButton
              color="inherit"
              onClick={openGraph}
              disabled={inExecutionMode}
            >
              <Fab
                className={classes.openFileButton}
                color="primary"
                size="small"
                component="span"
                aria-label="Open an existing workflow"
                disabled={inExecutionMode}
              >
                <ImportContactsIcon />
              </Fab>
            </IconButton>
          </Tooltip>
          <div className={classes.verticalRule} />
          {/* <UndoRedo undo={undo} redo={redo} /> */}
          <div className={classes.verticalRule} />
          <SaveToServer
            saveToServer={async () => void saveToServer()}
            action={action}
            open={openSaveDialog}
            setOpenSaveDialog={setOpenSaveDialog}
          />
          <GetFromServer />
          {/* TODO: commented for onlyEditRelease */}
          {/* <ExecuteWorkflow /> */}
          <div>
            <Tooltip title={tooltipText('More')} enterDelay={800} arrow>
              <IconButton color="inherit" onClick={handleClick}>
                <Fab
                  className={classes.openFileButton}
                  color="primary"
                  size="small"
                  component="span"
                  aria-label="More actions"
                >
                  <MoreVertIcon />
                </Fab>
              </IconButton>
            </Tooltip>
            <MenuPopover anchorEl={anchorEl} handleClose={handleClose} />
          </div>
          <div className={classes.verticalRule} />
          <Tooltip
            title={tooltipText('Manage tasks, icons and workflows')}
            enterDelay={800}
            arrow
          >
            <IconButton color="inherit" onClick={handleOpenSettings}>
              <Fab
                className={classes.openFileButton}
                color="primary"
                size="small"
                component="span"
                aria-label="Manage tasks, icons and workflows"
                data-cy="openTopDrawerButton"
              >
                <SettingsIcon />
              </Fab>
            </IconButton>
          </Tooltip>

          <Tooltip
            title={tooltipText('Guide for Ewoks UI')}
            enterDelay={800}
            arrow
          >
            <IconButton color="inherit">
              <Typography component="h1" variant="h5" color="primary">
                <Link to="/">
                  <Fab
                    className={classes.openFileButton}
                    color="primary"
                    size="small"
                    component="span"
                    aria-label="Guide for Ewoks UI"
                  >
                    <ArrowUpwardIcon />
                  </Fab>
                </Link>
              </Typography>
            </IconButton>
          </Tooltip>
          <SettingsInfoDrawer
            handleOpenDrawers={handleOpenDrawers}
            openDrawers={openDrawers}
            openInfo={openInfo}
            openSettings={openSettings}
          />
        </Toolbar>
      </AppBar>

      <ReflexContainer
        orientation="vertical"
        className={classes.reflexContainer}
      >
        <ReflexElement minSize={100} maxSize={500} size={350}>
          <Sidebar />
        </ReflexElement>
        <ReflexSplitter propagate className={classes.reflexSplitter} />
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
