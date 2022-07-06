/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
// import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
// import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import IntegratedSpinner from './IntegratedSpinner';
import state from '../store/state';
import { Button, Chip, Switch } from '@material-ui/core';
// import SidebarTooltip from './SidebarTooltip';
import type { Event, GraphEwoks, GraphRF } from '../types';
import DashboardStyle from '../layout/DashboardStyle';
import { getWorkflow, getExecutionEvents } from '../utils/api';
import useApi from '../hooks/useApi';

const useStyles = DashboardStyle;

// An async function for testing our hook.
const myFunction = () => {
  return new Promise((resolve, reject) => {
    getWorkflow('11')
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(new Error('something bad happened'));
      });
  });
};

export default function ExecutionDetails() {
  const classes = useStyles();

  const graphRF = state((state) => state.graphRF);
  const setGraphRF = state((state) => state.setGraphRF);

  const currentExecutionEvent = state((state) => state.currentExecutionEvent);

  const executedEvents = state((state) => state.executedEvents);
  const setExecutingEvents = state((state) => state.setExecutingEvents);
  const setInExecutionMode = state((state) => state.setInExecutionMode);

  const [jobs, setJobs] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Event>({} as Event);
  const [gettingFromServer, setGettingFromServer] = useState(false);
  const setWorkingGraph = state((state) => state.setWorkingGraph);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const allWorkflows = state((state) => state.allWorkflows);
  const [openDrawers, setOpenDrawers] = React.useState(true);
  const [openSettings, setOpenSettings] = React.useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [expandedWorkflows, setExpandedWorkflows] = useState<boolean>(false);
  const openSettingsDrawer = state((state) => state.openSettingsDrawer);
  const setOpenSettingsDrawer = state((state) => state.setOpenSettingsDrawer);

  useEffect(() => {
    // console.log(graphRF.graph.label); // TODO: it gets an undifined value on getFromServer
    const allJobs = executedEvents
      .filter((ev) => ev.context === 'job' && ev.type === 'start')
      .map((job) => {
        let jobL = {};
        if (
          executedEvents.some(
            (jo) => jo.job_id === job.job_id && jo.type === 'end'
          )
        ) {
          jobL = { ...job, status: 'finished' };
        } else {
          jobL = { ...job, status: 'executing' };
        }
        return jobL;
      });
    console.log(allJobs);

    setJobs(allJobs);

    const allWorkflowsL = executedEvents
      .filter((ev) => ev.context === 'workflow' && ev.type === 'start')
      .map((work) => {
        let workL = {};
        if (
          executedEvents.some(
            (wor) => wor.workflow_id === work.workflow_id && wor.type === 'end'
          )
        ) {
          workL = { ...work, status: 'finished' };
        } else {
          workL = { ...work, status: 'executing' };
        }
        return workL;
      });

    setWorkflows(allWorkflowsL);
  }, [executedEvents, graphRF.graph.label]);

  const { execute, status, value, error } = useApi(myFunction, false);

  const handleChangeWorkflows = (
    event: React.SyntheticEvent,
    newExpanded: boolean
  ) => {
    setExpandedWorkflows(newExpanded);
  };

  const workflowDetails = (work) => {
    // console.log(workflows, work);
    setSelectedWorkflow(work);
  };

  const formatedDate = (job) => {
    console.log(allWorkflows);
    const { label } = allWorkflows.find((work) => job.workflow_id === work.id);
    const dat = new Date(job.time);
    return `${
      label ? label.slice(0, 20) : (job.workflow_id as string)
    } ${dat.getHours()}:${dat.getMinutes()} ${dat.getDay()}/${dat.getMonth()}/${dat.getFullYear()}`;
  };

  const executeWorkflow = async () => {
    const workflowId = selectedWorkflow.workflow_id;
    // Replay execution on canvas needs to put the workflow on canvas with the events
    // 1. Ask for saving the workflow that is on canvas
    console.log(graphRF.graph.id, workflowId, selectedWorkflow);
    if (graphRF.graph.id !== workflowId) {
      console.log('save workflow with await');

      // 2. Get the workflow from server if not on canvas
      // TODO: dublicated code with getFromServer, abstract in store? hook?
      setGettingFromServer(true);
      try {
        const response = await getWorkflow(workflowId);
        if (response.data) {
          console.log(response.data);
          setWorkingGraph(response.data as GraphEwoks, 'fromServer');
          // setGraphRF(response.data as GraphRF);

          setTimeout(() => {
            const events = executedEvents.filter(
              (ev) =>
                ev.workflow_id === selectedWorkflow.workflow_id &&
                ev.job_id === selectedWorkflow.job_id
            );
            console.log(events);
            setInExecutionMode(true);
            // TODO: timeout is needed because executingEvents try to find
            // the nodes before they are there from the server
            // probably because setWorkingGraph changes the graphRF used in executingEvents
            events.forEach((ev) => setExecutingEvents(ev, false));
          }, 400);
        } else {
          setOpenSnackbar({
            open: true,
            text:
              'Could not locate the requested workflow! Maybe it is deleted!',
            severity: 'warning',
          });
        }
      } catch (error) {
        setOpenSnackbar({
          open: true,
          text:
            error.response?.data?.message ||
            'Error in retrieving workflow. Please check connectivity with the server!',
          severity: 'error',
        });
      } finally {
        setGettingFromServer(false);
      }
    } else {
      const events = executedEvents.filter(
        (ev) =>
          ev.workflow_id === selectedWorkflow.workflow_id &&
          ev.job_id === selectedWorkflow.job_id
      );
      console.log(events);
      setInExecutionMode(true);
      events.forEach((ev) => setExecutingEvents(ev, false));
    }
    // setGraphRF(selectedWorkflow);
  };

  const handleChangeOpenExecutions = async (event) => {
    // console.log(event.target.checked);
    setOpenSettingsDrawer('Executions');
    // const response = await getExecutionEvents();
  };

  return (
    <>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Open Executions"
      /> */}
      {/* <div>
        {status === 'idle' && (
          <div>Start your journey by clicking a button</div>
        )}
        {status === 'success' && <div>{value.graph.id}</div>}
        {status === 'error' && <div>{error.name}</div>}
        <button onClick={execute} disabled={status === 'pending'} type="button">
          {status !== 'pending' ? 'Click me' : 'Loading...'}
        </button>
      </div> */}
      {workflows.map((work) => (
        <div
          key={work.id}
          style={{
            backgroundColor:
              work.status === 'finished' ? '#b6beec' : 'rgb(255, 167, 1)',
            borderRadius: '5px',
            margin: '2px',
          }}
        >
          <div
            style={{
              display: 'block',
              paddingTop: '5px',
              paddingBottom: '5px',
            }}
          >
            <Chip
              label={formatedDate(work)}
              onClick={() => workflowDetails(work)}
              style={{
                paddingTop: '5px',
                paddingBottom: '5px',
                backgroundColor: '#e9ebf7',
              }}
              size="medium"
              // variant="outlined"
            />
          </div>
          {selectedWorkflow.id === work.id && (
            <div style={{ display: 'flex', width: '98%' }}>
              <ReactJson
                src={work}
                name="Execution details"
                theme="monokai"
                collapsed
                collapseStringsAfterLength={15}
                groupArraysAfterLength={15}
                enableClipboard={false}
                quotesOnKeys={false}
                style={{
                  backgroundColor: 'rgb(59, 77, 172)',
                  margin: '7px',
                }}
                displayDataTypes={false}
              />
            </div>
          )}
          {selectedWorkflow.id === work.id && (
            <IntegratedSpinner
              getting={gettingFromServer}
              tooltip="Execute Workflow and exit Execution mode"
              action={executeWorkflow}
              onClick={() => {
                /* eslint-disable no-console */
                console.log('Starting Execution');
              }}
            >
              <PlayCircleOutlineIcon fontSize="large" />
            </IntegratedSpinner>
          )}
        </div>
      ))}
      <Button
        onClick={handleChangeOpenExecutions}
        variant="outlined"
        size="small"
      >
        All Executions
      </Button>
      {executedEvents[currentExecutionEvent - 1] && (
        <ReactJson
          src={executedEvents[currentExecutionEvent - 1]}
          name="Event details"
          theme="monokai"
          collapsed
          collapseStringsAfterLength={20}
          groupArraysAfterLength={15}
          enableClipboard={false}
          quotesOnKeys={false}
          style={{ backgroundColor: 'rgb(59, 77, 172)' }}
          displayDataTypes={false}
        />
      )}
    </>
  );
}
