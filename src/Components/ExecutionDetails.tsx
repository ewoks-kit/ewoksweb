import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
// import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
// import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import IntegratedSpinner from './IntegratedSpinner';
import state from '../store/state';
import { Button, Chip, IconButton } from '@material-ui/core';
// import SidebarTooltip from './SidebarTooltip';
import type { Event, GraphEwoks } from '../types';
import { getWorkflow } from '../utils/api';
import DeleteIcon from '@material-ui/icons/Delete';
// import useApi from '../hooks/useApi';
// import useGetWorkflow from '../hooks/useApi';

// TODO: Testing hooks with promises
// An async function for testing our hook.
// const myFunction = () => {
//   return new Promise((resolve, reject) => {
//     getWorkflow('11')
//       .then((response) => {
//         resolve(response.data);
//       })
//       .catch((error) => {
//         reject(new Error('something bad happened'));
//       });
//   });
// };

export default function ExecutionDetails() {
  const graphRF = state((state) => state.graphRF);

  const currentExecutionEvent = state((state) => state.currentExecutionEvent);

  const executedEvents = state((state) => state.executedEvents);
  const watchedWorkflows = state((state) => state.watchedWorkflows);
  const setWatchedWorkflows = state((state) => state.setWatchedWorkflows);
  const setExecutingEvents = state((state) => state.setExecutingEvents);
  const setInExecutionMode = state((state) => state.setInExecutionMode);

  const [currentWatchedEvents, setCurrentWatchedEvents] = useState(
    [] as Event[]
  );
  // const [jobs, setJobs] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Event>({} as Event);
  const [gettingFromServer, setGettingFromServer] = useState(false);
  const setWorkingGraph = state((state) => state.setWorkingGraph);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);
  const allWorkflows = state((state) => state.allWorkflows);
  // const [expandedWorkflows, setExpandedWorkflows] = useState<boolean>(false);
  // const openSettingsDrawer = state((state) => state.openSettingsDrawer);
  const setOpenSettingsDrawer = state((state) => state.setOpenSettingsDrawer);

  useEffect(() => {
    // TODO: it gets an undifined value on getFromServer
    // const allJobs = executedEvents
    //   .filter((ev) => ev.context === 'job' && ev.type === 'start')
    //   .map((job) => {
    //     let jobL = {};
    //     if (
    //       executedEvents.some(
    //         (jo) => jo.job_id === job.job_id && jo.type === 'end'
    //       )
    //     ) {
    //       jobL = { ...job, status: 'finished' };
    //     } else {
    //       jobL = { ...job, status: 'executing' };
    //     }
    //     return jobL;
    //   });
    // // console.log(allJobs);

    // setJobs(allJobs);

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
    const wjobs = watchedWorkflows.map((job) => {
      return { ...job[0], status: 'finished' };
    });

    setWorkflows([...allWorkflowsL, ...wjobs]);
  }, [executedEvents, graphRF.graph.label, watchedWorkflows]);

  // TODO: Testing hooks with promises
  // const { execute, status, value, error } = useApi(useGetWorkflow, false);

  // const handleChangeWorkflows = (
  //   event: React.SyntheticEvent,
  //   newExpanded: boolean
  // ) => {
  //   setExpandedWorkflows(newExpanded);
  // };

  const workflowDetails = (work) => {
    /* eslint-disable no-console */
    console.log(graphRF.graph.label, workflows, work);
    setSelectedWorkflow(work);
  };

  const formatedDate = (job) => {
    const { label } = (allWorkflows &&
      allWorkflows.find((work) => job.workflow_id === work.id)) || {
      label: '',
    };
    const dat = new Date(job.time);
    return `${
      label ? label.slice(0, 20) : (job.workflow_id as string)
    } ${dat.getHours()}:${dat.getMinutes()} ${dat.getDate()}/${
      dat.getMonth() + 1
    }/${dat.getFullYear()}`;
  };

  const executeWorkflow = async () => {
    const workflowId = selectedWorkflow.workflow_id;
    // Replay execution on canvas needs to put the workflow on canvas with the events
    // 1. Ask for saving the workflow that is on canvas
    // console.log(graphRF.graph.id, workflowId, selectedWorkflow);
    if (graphRF.graph.id !== workflowId) {
      // 2. Get the workflow from server if not on canvas
      // TODO: dublicated code with getFromServer, abstract in store? hook?
      setGettingFromServer(true);
      try {
        const response = await getWorkflow(workflowId);
        if (response.data) {
          setWorkingGraph(response.data as GraphEwoks, 'fromServer');

          setTimeout(() => {
            const events = getEventsForJob();
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
      const events = getEventsForJob();
      setInExecutionMode(true);
      events.forEach((ev) => setExecutingEvents(ev, false));
    }
  };

  const getEventsForJob = () => {
    let events = [] as Event[];
    const isInWatchedIndex = watchedWorkflows
      .map((job) => job[0].job_id === selectedWorkflow.job_id)
      .indexOf(true);
    // console.log(isInWatchedIndex, selectedWorkflow.job_id, watchedWorkflows);
    // Check if it is watched workflow from server or a live execution
    if (isInWatchedIndex !== -1) {
      console.log('it is part of the history');
      events = watchedWorkflows[isInWatchedIndex].map((ev, index) => {
        return { ...ev, id: index + 1 };
      });
      console.log(events);
    } else {
      events = executedEvents.filter(
        (ev) =>
          ev.workflow_id === selectedWorkflow.workflow_id &&
          ev.job_id === selectedWorkflow.job_id
      );
    }
    console.log(events);
    setCurrentWatchedEvents(events);
    return events;
  };

  const handleChangeOpenExecutions = async () => {
    setOpenSettingsDrawer('Executions');
  };

  const deleteWatchedJob = () => {
    // setWorkflows(
    //   workflows.filter((work) => work.job_id !== selectedWorkflow.job_id)
    // );
    console.log(watchedWorkflows, selectedWorkflow);
    setWatchedWorkflows(
      watchedWorkflows.filter(
        (work) => work[0].job_id !== selectedWorkflow.job_id
      )
    );
  };

  return (
    <>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Open Executions"
      /> */}
      {/* TODO: Testing hooks with promises */}
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
          key={work.time}
          style={{
            backgroundColor:
              work.status === 'finished' ? '#b6beec' : 'rgb(124, 163, 198)',
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
          {selectedWorkflow.time === work.time && (
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
          {selectedWorkflow.time === work.time && (
            <span style={{ display: 'flex' }}>
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
              <IconButton
                onClick={deleteWatchedJob}
                aria-label="delete"
                color="primary"
              >
                <DeleteIcon />
              </IconButton>
            </span>
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
      {currentWatchedEvents[currentExecutionEvent - 1] && (
        <ReactJson
          src={currentWatchedEvents[currentExecutionEvent - 1]}
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
