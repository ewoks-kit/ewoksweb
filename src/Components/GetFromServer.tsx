import React from 'react';
import useStore from '../store';
import axios from 'axios';
import DashboardStyle from '../layout/DashboardStyle';
import IntegratedSpinner from '../Components/IntegratedSpinner';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FormControl from '@material-ui/core/FormControl';
import AutocompleteDrop from '../Components/AutocompleteDrop';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import type { GraphEwoks, GraphRF } from '../types';
import configData from '../configData.json';

const useStyles = DashboardStyle;

export default function GetFromServer() {
  const classes = useStyles();

  const [workflowValue, setWorkflowValue] = React.useState('');
  const setSubGraph = useStore((state) => state.setSubGraph);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const [gettingFromServer, setGettingFromServer] = React.useState(false);
  // TODO replace with the following brakes the round spinner
  // const gettingFromServer = useStore((state) => state.gettingFromServer);
  // const setGettingFromServer = useStore((state) => state.setGettingFromServer);

  const getSubgraphFromServer = () => {
    getFromServer('subgraph');
  };

  const setInputValue = (val) => {
    setWorkflowValue(val);
  };

  const getFromServer = async (isSubgraph) => {
    console.log(workflowValue);
    if (workflowValue) {
      setGettingFromServer(true);
      const response = await axios.get(
        // `http://mxbes2-1707:38280/ewoks/workflow/${workflowValue}`
        `${configData.serverUrl}/workflow/${workflowValue}`
      );
      if (response.data) {
        console.log(response.data);
        setGettingFromServer(false);
        if (isSubgraph === 'subgraph') {
          setSubGraph(response.data as GraphEwoks);
        } else {
          setWorkingGraph(response.data as GraphRF);
        }
      } else {
        setGettingFromServer(false);
        setOpenSnackbar({
          open: true,
          text: 'Could not locate the requested workflow! Maybe it is deleted!',
          severity: 'warning',
        });
      }
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please select a graph to fetch and re-click!',
        severity: 'warning',
      });
    }
  };

  return (
    <>
      <FormControl variant="standard" className={classes.formControl}>
        <AutocompleteDrop setInputValue={setInputValue} />
      </FormControl>
      <IntegratedSpinner
        getting={gettingFromServer}
        tooltip="Open and edit Workflow"
        action={getFromServer}
      >
        <CloudDownloadIcon />
      </IntegratedSpinner>
      <IntegratedSpinner
        getting={gettingFromServer}
        tooltip="Add workflow as subgraph"
        action={getSubgraphFromServer}
      >
        <ArrowDownwardIcon />
      </IntegratedSpinner>
    </>
  );
}
