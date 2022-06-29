import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
// import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import IntegratedSpinner from './IntegratedSpinner';
import state from '../store/state';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  TextField,
  Button,
} from '@material-ui/core';
import SidebarTooltip from './SidebarTooltip';
import type { Event, GraphRF } from '../types';
import DashboardStyle from '../layout/DashboardStyle';
import { getWorkflow } from '../utils/api';

const useStyles = DashboardStyle;

const executeJob = () => {
  // co;
};

// const showSelected = (work) => {
//   // console.log(work);
//   Object.keys(work).forEach((key) => {
//     if (work[key] === null) {
//       delete work[key];
//     }
//   });
//   return work;
// };

const formatedDate = (job) => {
  const dat = new Date(job.time);
  return `${
    job.workflow_id.slice(0, 20) as string
  } ${dat.getHours()}:${dat.getMinutes()} ${dat.getDay()}/${dat.getMonth()}/${dat.getFullYear()}`;
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
  const [selectedWorkflow, setSelectedWorkflow] = useState<Event>({});
  const [selectedJob, setSelectedJob] = useState<Event>({});
  const [expandedJobs, setExpandedJobs] = useState<boolean>(false);
  const [expandedWorkflows, setExpandedWorkflows] = useState<boolean>(false);
  const [workflowNameFilter, setWorkflowNameFilter] = useState<String>('');
  const [fromDateFilter, setFromDateFilter] = useState<String>('');
  const [toDateFilter, setToDateFilter] = useState<String>('');
  const [gettingFromServer, setGettingFromServer] = useState(false);
  const setWorkingGraph = state((state) => state.setWorkingGraph);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);

  useEffect(() => {
    // console.log(graphRF.graph.label); // TODO: it gets an undifined value on getFromServer
    setWorkflowNameFilter(graphRF.graph.label || 'no_Graph');
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

    setJobs(allJobs);

    const allWorkflows = executedEvents
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

    setWorkflows(allWorkflows);
  }, [executedEvents, graphRF.graph.label]);

  const handleChangeJobs = (
    event: React.SyntheticEvent,
    newExpanded: boolean
  ) => {
    setExpandedJobs(newExpanded);
  };

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

  const jobDetails = (job) => {
    setSelectedJob(job);
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
          setWorkingGraph(response.data as GraphRF, 'fromServer');
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

  const toDateChanged = (val) => {
    setToDateFilter(val);
  };

  const fromDateChanged = (val) => {
    setFromDateFilter(val);
  };

  return (
    <>
      <Accordion expanded={expandedJobs} onChange={handleChangeJobs}>
        <AccordionSummary
          expandIcon={<OpenInBrowser />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <SidebarTooltip
            text={`Drag and drop Tasks from their categories
          to the canvas to create graphs.`}
          >
            <Typography>Filters</Typography>
          </SidebarTooltip>
        </AccordionSummary>
        <AccordionDetails style={{ flexDirection: 'column' }}>
          <div className={classes.detailsLabels}>
            <TextField
              id="outlined-basic"
              label="Workflow Name"
              variant="outlined"
              value={workflowNameFilter}
            />
          </div>
          <div className={classes.detailsLabels}>
            <TextField
              id="date"
              label="From"
              type="date"
              value={fromDateFilter}
              // defaultValue={new Date().toString()}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              onChange={fromDateChanged}
            />
          </div>
          <div className={classes.detailsLabels}>
            <TextField
              id="date"
              label="To"
              type="date"
              value={toDateFilter}
              // defaultValue={new Date().toString()}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              onChange={toDateChanged}
            />
          </div>
          <Button
            style={{ margin: '8px' }}
            variant="outlined"
            color="primary"
            // onClick={console.log('filter')}
            size="small"
          >
            Filter
          </Button>
        </AccordionDetails>
      </Accordion>
      {/* <Accordion expanded={expandedJobs} onChange={handleChangeJobs}>
        <AccordionSummary
          expandIcon={<OpenInBrowser />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <SidebarTooltip
            text={`Drag and drop Tasks from their categories
          to the canvas to create graphs.`}
          >
            <Typography>Jobs</Typography>
          </SidebarTooltip>
        </AccordionSummary>
        <AccordionDetails style={{ flexWrap: 'wrap' }}>
          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                backgroundColor:
                  job.status === 'finished' ? '#b6beec' : 'rgb(255, 167, 1)',
                borderRadius: '5px',
                margin: '2px',
                width: '98%',
              }}
            >
              <div
                style={{
                  paddingTop: '5px',
                  paddingBottom: '5px',
                }}
              >
                <Chip
                  label={formatedDate(job)} // `${job.job_id.slice(0, 28)}...`
                  onClick={() => jobDetails(job)}
                  style={{
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    backgroundColor: '#e9ebf7',
                  }}
                  size="medium"
                  // variant="outlined"
                />
                {selectedJob.id === job.id && (
                  <div style={{ display: 'flex', width: '98%' }}>
                    <ReactJson
                      src={job} // showSelected(job)
                      name="Execution details"
                      theme="monokai"
                      collapsed
                      collapseStringsAfterLength={15}
                      groupArraysAfterLength={15}
                      enableClipboard={false}
                      quotesOnKeys={false}
                      style={{
                        backgroundColor: 'rgb(58, 77, 172)',
                        margin: '7px',
                      }}
                      displayDataTypes={false}
                    />
                  </div>
                )}
                {selectedJob.id === job.id && (
                  <IntegratedSpinner
                    getting={false}
                    tooltip="Execute Workflow and exit Execution mode"
                    action={executeJob}
                    onClick={() => {

                      console.log('Starting Execution');
                    }}
                  >
                    <PlayCircleOutlineIcon fontSize="large" />
                  </IntegratedSpinner>
                )}
              </div>
            </div>
          ))}
        </AccordionDetails>
      </Accordion> */}
      <Accordion expanded={expandedWorkflows} onChange={handleChangeWorkflows}>
        <AccordionSummary
          expandIcon={<OpenInBrowser />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <SidebarTooltip
            text={`Drag and drop Tasks from their categories
          to the canvas to create graphs.`}
          >
            <Typography>Workflows</Typography>
          </SidebarTooltip>
        </AccordionSummary>
        <AccordionDetails style={{ flexWrap: 'wrap', flexDirection: 'column' }}>
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
        </AccordionDetails>
      </Accordion>

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
