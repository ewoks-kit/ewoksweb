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
import SaveIcon from '@material-ui/icons/Save';
import FiberNew from '@material-ui/icons/FiberNew';
import Sidebar from '../sidebar';
import useStore from '../store';
import Canvas from './Canvas';
import Upload from '../Components/Upload';
import UndoRedo from '../Components/UndoRedo';
import GetFromServer from '../Components/GetFromServer';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
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

const useStyles = DashboardStyle;

function download(content, fileName, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export default function Dashboard() {
  const classes = useStyles();

  const inputFile = React.useRef(null);

  const graphRF = useStore((state) => state.graphRF);
  const selectedElement = useStore((state) => state.selectedElement);
  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);
  const [selectedGraph, setSelectedGraph] = React.useState('');
  const [open, setOpen] = React.useState(true);
  const [openSettings, setOpenSettings] = React.useState(false);
  const recentGraphs = useStore((state) => state.recentGraphs);
  const setRecentGraphs = useStore((state) => state.setRecentGraphs);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const setSubGraph = useStore((state) => state.setSubGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const initializedGraph = useStore((state) => state.initializedGraph);
  const [gettingFromServer, setGettingFromServer] = React.useState(false);

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

  // const selectedGraphChange = (event) => {
  //   setSelectedGraph(event.target.value);
  // };

  const loadFromDisk = (val) => {
    // TODO: possible race situation with setting pgraphOrSubgraph
    setGraphOrSubgraph(true);
  };

  const saveToDisk = (event) => {
    download(
      JSON.stringify(rfToEwoks(graphRF), null, 2),
      `${graphRF.graph.label}.json`,
      'text/plain'
    );
  };

  const saveToServer = async () => {
    // if id: new_graph000 request label update and the POST with id=label
    // else PUT and replace existing on server
    setGettingFromServer(true);
    if (graphRF.graph.id === 'new_graph000') {
      if (graphRF.graph.label === 'new_graph000') {
        setOpenSnackbar({
          open: true,
          text:
            'Please insert a new label to be also used as an id for the new workflow and then save!',
          severity: 'warning',
        });
        setGettingFromServer(false);
        return;
      }
      const newIdGraph = {
        graph: { ...graphRF.graph, id: graphRF.graph.label },
        nodes: graphRF.nodes,
        links: graphRF.links,
      };
      const response = await axios
        .post(`http://localhost:5000/workflows`, rfToEwoks(newIdGraph))
        .then((res) => {
          setGettingFromServer(false);
          setWorkingGraph(res.data);
          setRecentGraphs({}, true);
        });
    } else if (graphRF.graph.id) {
      const response = await axios
        .put(
          `http://localhost:5000/workflow/${graphRF.graph.id}`,
          rfToEwoks(graphRF)
        )
        .then((res) => setGettingFromServer(false));
    } else {
      setOpenSnackbar({
        open: true,
        text: 'No graph exists to save!',
        severity: 'warning',
      });
    }
  };

  const executeWorkflow = async () => {
    // console.log('execute workflow', recentGraphs, graphRF);
    if (recentGraphs.length > 0) {
      await axios
        .post(`http://localhost:5000/workflow/execute`, rfToEwoks(graphRF))
        .then((res) =>
          setOpenSnackbar({
            open: true,
            text: res,
            severity: 'warning',
          })
        )
        .catch((error) =>
          setOpenSnackbar({
            open: true,
            text: error,
            severity: 'warning',
          })
        );
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please open a workflow in the canvas to execute',
        severity: 'warning',
      });
    }
  };

  const newGraph = (event) => {
    // Name of graph unique and used in recentGraphs, graphRF, subgraphsStack
    // setGraphRF(initializedGraph);
    setWorkingGraph(initializedGraph);
  };

  const handleKeyDown = (event) => {
    //
    const charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === 's') {
      event.preventDefault();
      saveToServer();
    }
    // else if ((event.ctrlKey || event.metaKey) && charCode === 'c') {
    //   console.log('CTRL+C Pressed');
    // }
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
          <UndoRedo />
          {/* <FormControl variant="standard" className={classes.formControl}>
            <InputLabel
              id="demo-simple-select-filled-label"
              style={{ color: 'white' }}
            >
              Recent Files
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={selectedGraph}
              onChange={selectedGraphChange}
            >
              {recentGraphs.map((gr, index) => (
                <MenuItem value={gr.graph.label} key={gr.graph.id}>
                  <em>{gr.graph.label}</em>
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <Tooltip title="Save to Disk" arrow>
            <IconButton color="inherit">
              <Fab
                className={classes.openFileButton}
                color="primary"
                size="small"
                component="span"
                aria-label="add"
              >
                <SaveIcon onClick={saveToDisk} />
              </Fab>
            </IconButton>
          </Tooltip>
          <Tooltip title="Load from Disk" arrow>
            <IconButton color="inherit">
              <Upload>
                <AddIcon onClick={loadFromDisk} />
              </Upload>
            </IconButton>
          </Tooltip>
          <div className={classes.verticalRule} />
          <IntegratedSpinner tooltip="Save Workflow">
            <CloudUploadIcon onClick={saveToServer} />
          </IntegratedSpinner>
          <GetFromServer />
          <IntegratedSpinner
            tooltip="Execute Workflow"
            action={executeWorkflow}
          >
            <SendIcon />
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
