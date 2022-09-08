import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import FiberNew from '@material-ui/icons/FiberNew';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import Sidebar from './sidebar';
import { ReactFlowProvider } from 'react-flow-renderer';
import { Link } from 'react-router-dom';

import Canvas from './Canvas';
import UndoRedo from '../Components/UndoRedo';
import GetFromServer from '../Components/GetFromServer';
import { Fab, IconButton, Typography } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import SimpleSnackbar from '../Components/Snackbar';
import SettingsInfoDrawer from '../Components/SettingsInfoDrawer';
import SubgraphsStack from '../Components/SubgraphsStack';
import LinearSpinner from '../Components/LinearSpinner';
import ExecuteWorkflow from '../Components/ExecuteWorkflow';
import Tooltip from '@material-ui/core/Tooltip';
import DashboardStyle from './DashboardStyle';
import SaveToServer from '../Components/SaveToServer';
import tooltipText from '../Components/TooltipText';
import state from '../store/state';
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation';
import FormDialog from '../Components/FormDialog';
import ConfirmDialog from '../Components/ConfirmDialog';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../Components/General/ErrorFallback';
import MenuPopover from '../Components/MenuPopover';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';

const useStyles = DashboardStyle;

export default function Dashboard() {
  const classes = useStyles();

  const undoF = React.useRef(null);
  const redoF = React.useRef(null);
  const saveToServerF = React.useRef(null);

  const [openDrawers, setOpenDrawers] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [workflowIdInTextbox, setWorkflowIdInTextbox] = useState('');
  const setWorkingGraph = state((state) => state.setWorkingGraph);
  const gettingFromServer = state((state) => state.gettingFromServer);
  const inExecutionMode = state((state) => state.inExecutionMode);
  const graphRF = state((state) => state.graphRF);
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);
  const initializedGraph = state((state) => state.initializedGraph);
  const openSettingsDrawer = state((state) => state.openSettingsDrawer);
  const setOpenSettingsDrawer = state((state) => state.setOpenSettingsDrawer);
  const canvasGraphChanged = state((state) => state.canvasGraphChanged);
  const setCanvasGraphChanged = state((state) => state.setCanvasGraphChanged);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const undoIndex = state((state) => state.undoIndex);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    // console.log(openDrawers);
    handleOpenInfo();
  }, []);

  useEffect(() => {
    // console.log(openDrawers, openSettings);
    if (!openDrawers) {
      setOpenSettings(false);
      setOpenSettingsDrawer('Workflows');
    }
  }, [openDrawers, openSettings, setOpenSettingsDrawer]);

  useEffect(() => {
    // console.log(openSettingsDrawer);
    if (openSettingsDrawer === 'Executions') {
      setOpenInfo(false);
      setOpenDrawers(true);
      setOpenSettings(true);
    }
    // setOpenSettingsDrawer('');
  }, [openSettingsDrawer, setOpenSettingsDrawer]);

  const checkAndNewGraph = () => {
    if (canvasGraphChanged && undoIndex !== 0) {
      setOpenAgreeDialog(true);
    } else {
      newGraph();
      setOpenAgreeDialog(false);
      setCanvasGraphChanged(false);
    }
  };

  const newGraph = () => {
    setWorkingGraph(initializedGraph, 'fromUser');
    setOpenSaveDialog(true);
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
    // setOpenInfo(true);
    setOpenSettings(false);
    // setOpenDrawers(true);
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const handleKeyDown = (event) => {
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
      newGraph();
    }
  };

  const disAgreeSaveWithout = () => {
    setOpenAgreeDialog(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function workflowIdInAutocomplete(id) {
    setWorkflowIdInTextbox(id);
  }

  return (
    <>
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
          agreeCallback={newGraph}
          disagreeCallback={disAgreeSaveWithout}
        />
        <FormDialog
          elementToEdit={graphRF}
          action="cloneGraph"
          open={openSaveDialog}
          setOpenSaveDialog={setOpenSaveDialog}
        />
        <CssBaseline />
        <SimpleSnackbar />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, classes.appBarShift)}
          style={{ height: '5%', minHeight: '64px' }}
        >
          <Toolbar className={classes.toolbar}>
            <SubgraphsStack />
            <Tooltip
              title={tooltipText('Start a new workflow')}
              enterDelay={800}
              arrow
            >
              <IconButton color="inherit" onClick={checkAndNewGraph}>
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
              <IconButton color="inherit" onClick={openGraph}>
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
            <GetFromServer
              workflowIdInAutocomplete={workflowIdInAutocomplete}
            />
            <ExecuteWorkflow />
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
              <MenuPopover
                anchorEl={anchorEl}
                handleClose={handleClose}
                workflowIdInTextbox={workflowIdInTextbox}
              />
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
              {/* onClick={handleOpenInfo} */}
              <IconButton color="inherit">
                <Typography
                  component="h1"
                  variant="h5"
                  color="primary"
                  style={{ padding: '5px' }}
                >
                  <Link to="/">
                    <Fab
                      className={classes.openFileButton}
                      color="primary"
                      size="small"
                      component="span"
                      aria-label="add"
                    >
                      <NotListedLocationIcon />
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
      </div>
      <ReflexContainer
        orientation="vertical"
        style={{
          flex: '1 4 0%',
          display: 'flex',
          minWidth: 0,
        }}
      >
        <ReflexElement
          className="left-pane"
          minSize={100}
          maxSize={500}
          size={350}
        >
          <Sidebar />
          {/* </Drawer> */}
        </ReflexElement>

        {/* <ReflexSplitter propagate /> */}
        <ReflexSplitter
          propagate
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '0.325rem',
            height: '100vh',
            backgroundColor: 'rgb(233, 235, 247)',
            borderRight: 'none !important',
            borderLeftColor: '#eee !important',
            color: '#777',
            cursor: 'col-resize',
            transition: 'none',
            // display: activePanel ? undefined : 'none',
          }}
        >
          {/* <ChevronLeftIcon /> */}
          {/* <hr /> */}
        </ReflexSplitter>

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
                  // resetKeys={[]}
                  // onError={() => console.log()}
                >
                  <Canvas />
                </ErrorBoundary>
              </ReactFlowProvider>
            </Paper>
          </main>
        </ReflexElement>

        {/* <Drawer /> */}
        {/* </div> */}
      </ReflexContainer>
    </>
  );
}
