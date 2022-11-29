import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import FiberNew from '@material-ui/icons/FiberNew';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import Sidebar from 'Components/Sidebar/Sidebar';
import { ReactFlowProvider } from 'react-flow-renderer';
import { Link } from 'react-router-dom';
import Canvas from '../Canvas/Canvas';
import UndoRedo from '../TopNavBar/UndoRedo';
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
import { FormAction } from '../../types';

const useStyles = DashboardStyle;

export default function Dashboard() {
  const classes = useStyles();

  const undoF = React.useRef(null);
  const redoF = React.useRef(null);
  const saveToServerF = React.useRef(null);

  const [openDrawers, setOpenDrawers] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const gettingFromServer = useStore((state) => state.gettingFromServer);
  const inExecutionMode = useStore((state) => state.inExecutionMode);
  const graphRF = useStore((state) => state.graphRF);
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);
  const openSettingsDrawer = useStore((state) => state.openSettingsDrawer);
  const setOpenSettingsDrawer = useStore(
    (state) => state.setOpenSettingsDrawer
  );
  const canvasGraphChanged = useStore((state) => state.canvasGraphChanged);
  const setCanvasGraphChanged = useStore(
    (state) => state.setCanvasGraphChanged
  );
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const undoIndex = useStore((state) => state.undoIndex);
  const initializedGraph = useStore((state) => state.initializedGraph);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    handleOpenInfo();
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
    } else if (openSettingsDrawer === 'close') {
      setOpenInfo(false);
      setOpenDrawers(false);
      setOpenSettings(false);
    }
  }, [openSettingsDrawer, setOpenSettingsDrawer]);

  const checkAndNewGraph = (notSave: boolean) => {
    if (canvasGraphChanged && undoIndex !== 0 && !notSave) {
      setOpenAgreeDialog(true);
    } else {
      setWorkingGraph(initializedGraph);
      setOpenSaveDialog(true);
      setOpenAgreeDialog(false);
      setCanvasGraphChanged(false);
    }
  };

  const openGraph = () => {
    handleOpenSettings();
  };

  const handleOpenSettings = () => {
    setOpenInfo(false);
    setOpenSettings(true);
    setOpenDrawers(true);
  };
  const handleOpenDrawers = () => {
    setOpenDrawers(!openDrawers);
  };

  const handleOpenInfo = () => {
    setOpenSettings(false);
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  function handleKeyDown(event) {
    const charCode = String.fromCharCode(event.which).toLowerCase();

    const keys = event.ctrlKey || event.metaKey;
    if (keys && charCode === 's') {
      event.preventDefault();
      event.stopPropagation();
      saveToServerF.current();
    } else if (keys && charCode === 'z') {
      event.preventDefault();
      event.stopPropagation();
      undoF.current();
    } else if (keys && charCode === 'y') {
      event.preventDefault();
      event.stopPropagation();
      redoF.current();
    } else if (keys && event.shiftKey && charCode === 'n') {
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
        elementToEdit={graphRF}
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
              data-cy="newWorkflowButton"
            >
              <Fab
                className={classes.openFileButton}
                color="primary"
                size="small"
                component="span"
                aria-label="add"
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
                aria-label="add"
                disabled={inExecutionMode}
              >
                <ImportContactsIcon />
              </Fab>
            </IconButton>
          </Tooltip>
          <div className={classes.verticalRule} />
          <UndoRedo undoF={undoF} redoF={redoF} />
          <div className={classes.verticalRule} />
          <SaveToServer saveToServerF={saveToServerF} />
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
                  aria-label="add"
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
                aria-label="add"
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
                    aria-label="add"
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

              <ReactFlowProvider>
                <ErrorBoundary
                  FallbackComponent={(fallbackProps) => (
                    <ErrorFallback {...fallbackProps} />
                  )}
                >
                  <Canvas />
                </ErrorBoundary>
              </ReactFlowProvider>
            </Paper>
          </main>
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
}
