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

import { tutorial_Graph } from '../store/tutorialWorkflows/tutorial_Graph.js';
import type { GraphRF } from '../types';

const tutorial_GraphL = (tutorial_Graph as unknown) as GraphRF;
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
  const isExecuted = state((state) => state.isExecuted);
  const graphRF = state((state) => state.graphRF);
  const selectedElement = state((state) => state.selectedElement);
  const [openSaveDialog, setOpenSaveDialog] = React.useState<boolean>(false);

  const newGraph = () => {
    // setOpenSaveDialog(true);
    setWorkingGraph(tutorial_GraphL);
  };

  useEffect(() => {
    newGraph();
    handleOpenSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    if ((event.ctrlKey || event.metaKey) && charCode === 's') {
      event.preventDefault();
      saveToServerF.current();
    } else if ((event.ctrlKey || event.metaKey) && charCode === 'z') {
      event.preventDefault();
      undoF.current();
    } else if ((event.ctrlKey || event.metaKey) && charCode === 'y') {
      event.preventDefault();
      redoF.current();
    } else if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      charCode === 'n'
    ) {
      event.preventDefault();
      event.stopPropagation();
      newGraph();
    } else if ((event.ctrlKey || event.metaKey) && charCode === 'v') {
      event.preventDefault();
      event.stopPropagation();
      console.log(selectedElement);
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
                disabled={isExecuted}
              >
                <FiberNew />
              </Fab>
            </IconButton>
          </Tooltip>
          <UndoRedo undoF={undoF} redoF={redoF} />
          <SaveGetFromDisk />
          <div className={classes.verticalRule} />
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
