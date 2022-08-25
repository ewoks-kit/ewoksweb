import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import FiberNew from '@material-ui/icons/FiberNew';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import Sidebar from './sidebar';
import { ReactFlowProvider } from 'react-flow-renderer';

import Canvas from './Canvas';
import UndoRedo from '../Components/UndoRedo';
import GetFromServer from '../Components/GetFromServer';
import { Button, Fab, IconButton, Menu, MenuItem } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import SimpleSnackbar from '../Components/Snackbar';
import SettingsInfoDrawer from '../Components/SettingsInfoDrawer';
import SubgraphsStack from '../Components/SubgraphsStack';
import LinearSpinner from '../Components/LinearSpinner';
import ExecuteWorkflow from '../Components/ExecuteWorkflow';
import Tooltip from '@material-ui/core/Tooltip';
import DashboardStyle from './DashboardStyle';
import SaveGetFromDisk from '../Components/SaveGetFromDisk';
import SaveToServer from '../Components/SaveToServer';
import tooltipText from '../Components/TooltipText';
import state from '../store/state';
import NotListedLocationIcon from '@material-ui/icons/NotListedLocation';
import FormDialog from '../Components/FormDialog';
import ConfirmDialog from '../Components/ConfirmDialog';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../Components/General/ErrorFallback';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';

const useStyles = DashboardStyle;

export default function Dashboard() {
  const classes = useStyles();

  const undoF = React.useRef(null);
  const redoF = React.useRef(null);
  const saveToServerF = React.useRef(null);

  const [open, setOpen] = React.useState(true);
  const [openDrawers, setOpenDrawers] = React.useState(true);
  const [openSettings, setOpenSettings] = React.useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);
  const setWorkingGraph = state((state) => state.setWorkingGraph);
  const gettingFromServer = state((state) => state.gettingFromServer);
  const inExecutionMode = state((state) => state.inExecutionMode);
  const graphRF = state((state) => state.graphRF);
  const [openSaveDialog, setOpenSaveDialog] = React.useState<boolean>(false);
  const initializedGraph = state((state) => state.initializedGraph);
  const openSettingsDrawer = state((state) => state.openSettingsDrawer);
  const setOpenSettingsDrawer = state((state) => state.setOpenSettingsDrawer);
  const canvasGraphChanged = state((state) => state.canvasGraphChanged);
  const setCanvasGraphChanged = state((state) => state.setCanvasGraphChanged);
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const undoIndex = state((state) => state.undoIndex);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
    setOpenInfo(true);
    setOpenSettings(false);
    setOpenDrawers(true);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
    // setEditing(!editing);
  };
  const handleDrawerClose = () => {
    setOpen(false);
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
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
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
            <SaveToServer saveToServerF={saveToServerF} />
            <GetFromServer />
            <ExecuteWorkflow />
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

            <div>
              <Tooltip
                title={tooltipText('Manage tasks, icons and workflows')}
                enterDelay={800}
                arrow
              >
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
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <SaveGetFromDisk />
                  <SaveGetFromDisk />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <GetFromServer />
                </MenuItem>
              </Menu>
            </div>

            <Tooltip
              title={tooltipText('Guide for Ewoks UI')}
              enterDelay={800}
              arrow
            >
              <IconButton color="inherit" onClick={handleOpenInfo}>
                <Fab
                  className={classes.openFileButton}
                  color="primary"
                  size="small"
                  component="span"
                  aria-label="add"
                >
                  <NotListedLocationIcon />
                </Fab>
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
          minSize={200}
          maxSize={500}
          size={350}
        >
          {/* <Drawer
            variant="permanent"
            classes={{
              paper: clsx(
                classes.drawerPaper,
                !open && classes.drawerPaperClose
              ),
            }}
            open={open}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <Divider /> */}
          <Sidebar />
          {/* </Drawer> */}
        </ReflexElement>

        {/* <ReflexSplitter propagate /> */}
        <ReflexSplitter
          propagate
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '0.225rem',
            height: '950px',
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
          <hr />
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
