import React, { useEffect } from 'react';
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
import { Fab, IconButton } from '@material-ui/core';
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

import type { GraphRF } from '../types';

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

  useEffect(() => {
    console.log(openDrawers);
    handleOpenInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(openDrawers, openSettings);
    if (!openDrawers) {
      setOpenSettings(false);
      setOpenSettingsDrawer('Workflows');
    }
  }, [openDrawers, openSettings, setOpenSettingsDrawer]);

  useEffect(() => {
    console.log(openSettingsDrawer);
    if (openSettingsDrawer === 'Executions') {
      setOpenInfo(false);
      setOpenDrawers(true);
      setOpenSettings(true);
    }
    // setOpenSettingsDrawer('');
  }, [openSettingsDrawer, setOpenSettingsDrawer]);

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

  return (
    <div
      className={classes.root}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
    >
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
            <IconButton color="inherit" onClick={newGraph}>
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
          <SaveGetFromDisk />
          <div className={classes.verticalRule} />
          <SaveToServer saveToServerF={saveToServerF} />
          <GetFromServer onlyButtons={false} />
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
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <Divider />
        <Sidebar />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <Paper className={fixedHeightPaper}>
          {gettingFromServer && <LinearSpinner />}
          <ReactFlowProvider>
            <Canvas />
          </ReactFlowProvider>
        </Paper>
      </main>
      <Drawer />
    </div>
  );
}
