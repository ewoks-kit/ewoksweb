import React from 'react';
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
import TemporaryDrawer from '../Components/Drawer';
import SubgraphsStack from '../Components/SubgraphsStack';
import LinearSpinner from '../Components/LinearSpinner';
import ExecuteWorkflow from '../Components/ExecuteWorkflow';
import Tooltip from '@material-ui/core/Tooltip';
import DashboardStyle from './DashboardStyle';
import SaveGetFromDisk from '../Components/SaveGetFromDisk';
import SaveToServer from '../Components/SaveToServer';
// import io from 'socket.io-client';
// import type { ExecutingEvent } from '../types';
import state from '../store/state';
// import configData from '../configData.json';

const useStyles = DashboardStyle;

// export const socket = io(configData.serverUrl);

export default function Dashboard() {
  const classes = useStyles();

  const undoF = React.useRef(null);
  const redoF = React.useRef(null);
  const saveToServerF = React.useRef(null);

  // const selectedElement = state((state) => state.selectedElement);
  const [open, setOpen] = React.useState(true);
  const [openSettings, setOpenSettings] = React.useState(false);
  const setWorkingGraph = state((state) => state.setWorkingGraph);
  const initializedGraph = state((state) => state.initializedGraph);
  const gettingFromServer = state((state) => state.gettingFromServer);
  const isExecuted = state((state) => state.isExecuted);
  // const setExecutingEvents = state((state) => state.setExecutingEvents);

  // useEffect(() => {
  //   // console.log('Executing');
  //   socket.on('Executing', (data) =>
  //     setExecutingEvents(data as ExecutingEvent)
  //   );
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [setExecutingEvents]);

  const handleOpenSettings = () => {
    setOpenSettings(!openSettings);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
    // setEditing(!editing);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const newGraph = () => {
    setWorkingGraph(initializedGraph);
  };

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
    }
  };

  return (
    <div
      className={classes.root}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
    >
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
          <Tooltip title="Start a new workflow" arrow>
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
          <Tooltip title="Manage tasks and workflows" arrow>
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
          <TemporaryDrawer
            handleOpenSettings={handleOpenSettings}
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
