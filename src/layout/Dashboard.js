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
import Sidebar from '../sidebar';
import useStore from '../store';
import Canvas from './Canvas';
import UndoRedo from '../Components/UndoRedo';
import GetFromServer from '../Components/GetFromServer';
import { Fab, IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import { rfToEwoks } from '../utils';
import axios from 'axios';
import SimpleSnackbar from '../Components/Snackbar';
import TemporaryDrawer from '../Components/Drawer';
import SubgraphsStack from '../Components/SubgraphsStack';
import LinearSpinner from '../Components/LinearSpinner';
import Tooltip from '@material-ui/core/Tooltip';
import DashboardStyle from './DashboardStyle';
import SendIcon from '@material-ui/icons/Send';
import IntegratedSpinner from '../Components/IntegratedSpinner';
import SaveGetFromDisk from '../Components/SaveGetFromDisk';
// import MyDrawer from './MyDrawer';
import SaveToServer from '../Components/SaveToServer';
import ClearIcon from '@material-ui/icons/Clear';
import configData from '../configData.json';

const useStyles = DashboardStyle;

export default function Dashboard() {
  const classes = useStyles();

  const undoF = React.useRef(null);
  const redoF = React.useRef(null);
  const saveToServerF = React.useRef(null);

  const graphRF = useStore((state) => state.graphRF);
  const selectedElement = useStore((state) => state.selectedElement);
  const [open, setOpen] = React.useState(true);
  const [openSettings, setOpenSettings] = React.useState(false);
  const recentGraphs = useStore((state) => state.recentGraphs);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const initializedGraph = useStore((state) => state.initializedGraph);
  const gettingFromServer = useStore((state) => state.gettingFromServer);
  const isExecuted = useStore((state) => state.isExecuted);
  const setIsExecuted = useStore((state) => state.setIsExecuted);

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

  const executeWorkflow = async () => {
    // console.log('execute workflow', recentGraphs, graphRF);
    console.log(isExecuted);
    if (recentGraphs.length > 0) {
      setIsExecuted(!isExecuted);
      // await axios
      //   .post(`${configData.serverUrl}/workflow/execute`, rfToEwoks(graphRF))
      //   .then((res) =>
      //     setOpenSnackbar({
      //       open: true,
      //       text: res,
      //       severity: 'warning',
      //     })
      //   )
      //   .catch((error) =>
      //     setOpenSnackbar({
      //       open: true,
      //       text: error,
      //       severity: 'warning',
      //     })
      //   );
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please open a workflow in the canvas to execute',
        severity: 'warning',
      });
    }
  };

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
            <IconButton color="inherit">
              <Fab
                className={classes.openFileButton}
                color="primary"
                size="small"
                component="span"
                aria-label="add"
              >
                <FiberNew onClick={newGraph} />
              </Fab>
            </IconButton>
          </Tooltip>
          <UndoRedo undoF={undoF} redoF={redoF} />
          {/* <RecentFiles /> */}
          <SaveGetFromDisk />
          <div className={classes.verticalRule} />
          <SaveToServer saveToServerF={saveToServerF} />
          <GetFromServer />
          <IntegratedSpinner
            tooltip="Execute Workflow and exit Execution mode"
            action={executeWorkflow}
          >
            {isExecuted ? <ClearIcon /> : <SendIcon />}
          </IntegratedSpinner>
          <div className={classes.verticalRule} />
          <Tooltip title="Manage tasks and workflows" arrow>
            <IconButton color="inherit">
              <Fab
                className={classes.openFileButton}
                color="primary"
                size="small"
                component="span"
                aria-label="add"
              >
                <SettingsIcon onClick={handleOpenSettings} />
              </Fab>
            </IconButton>
          </Tooltip>
          <TemporaryDrawer
            handleOpenSettings={handleOpenSettings}
            openSettings={openSettings}
          />
        </Toolbar>
      </AppBar>
      {/* <MyDrawer /> */}
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
        <Sidebar element={selectedElement} />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <Paper className={fixedHeightPaper}>
          {gettingFromServer ? <LinearSpinner getting /> : <Canvas />}
        </Paper>
      </main>
      <Drawer />
    </div>
  );
}
