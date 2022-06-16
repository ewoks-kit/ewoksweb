import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
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
} from '@material-ui/core';
import SidebarTooltip from './SidebarTooltip';
import type { Event } from '../types';

const executeJob = () => {
  // co;
};

const showSelected = (work) => {
  Object.keys(work).forEach((key) => {
    if (work[key] === null) {
      delete work[key];
    }
  });
  return work;
};

export default function ExecutionDetails() {
  // const { props } = propsIn;
  // const { element } = props;
  // const { setElement } = propsIn;

  const graphRF = state((state) => state.graphRF);

  const currentExecutionEvent = state((state) => state.currentExecutionEvent);

  const executedEvents = state((state) => state.executedEvents);
  const setExecutingEvents = state((state) => state.setExecutingEvents);

  const [jobs, setJobs] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Event>({});
  const [selectedJob, setSelectedJob] = useState<Event>({});
  const [expandedJobs, setExpandedJobs] = useState<boolean>(false);
  const [expandedWorkflows, setExpandedWorkflows] = useState<boolean>(false);

  useEffect(() => {
    const allJobs = executedEvents
      .filter((ev) => ev.context === 'job' && ev.type === 'start')
      .map((job) => {
        if (
          executedEvents.find(
            (jo) => jo.job_id === job.job_id && jo.type === 'end'
          )
        ) {
          return { ...job, status: 'finished' };
        } else {
          return { ...job, status: 'executing' };
        }
      });

    setJobs(allJobs);

    const allWorkflows = executedEvents
      .filter((ev) => ev.context === 'workflow' && ev.type === 'start')
      .map((work) => {
        if (
          executedEvents.find(
            (wor) => wor.workflow_id === work.workflow_id && wor.type === 'end'
          )
        ) {
          return { ...work, status: 'finished' };
        } else {
          return { ...work, status: 'executing' };
        }
      });

    setWorkflows(allWorkflows);
  }, [executedEvents]);

  const handleChangeJobs = (
    event: React.SyntheticEvent,
    newExpanded: boolean
  ) => {
    // if (newExpanded) {
    //   getTasks();
    // }
    setExpandedJobs(newExpanded);
  };

  const handleChangeWorkflows = (
    event: React.SyntheticEvent,
    newExpanded: boolean
  ) => {
    setExpandedWorkflows(newExpanded);
  };

  const workflowDetails = (work) => {
    console.log(workflows, work);
    setSelectedWorkflow(work);
  };

  const jobDetails = (job) => {
    setSelectedJob(job);
  };

  const executeWorkflow = () => {
    const events = executedEvents.filter(
      (ev) =>
        ev.workflow_id === selectedWorkflow.workflow_id &&
        ev.job_id === selectedWorkflow.job_id
    );
    console.log(selectedWorkflow, events.length, executedEvents.length);
    events.forEach((ev) => setExecutingEvents(ev));
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
            <Typography>Jobs</Typography>
          </SidebarTooltip>
        </AccordionSummary>
        <AccordionDetails style={{ flexWrap: 'wrap' }}>
          {jobs.map((job) => (
            <div
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
                  label={`${job.job_id.slice(0, 28)}...`}
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
                  <IntegratedSpinner
                    getting={false}
                    tooltip="Execute Workflow and exit Execution mode"
                    action={executeJob}
                    onClick={() => {
                      /* eslint-disable no-console */
                      console.log('Starting Execution');
                    }}
                  >
                    <PlayCircleOutlineIcon fontSize="large" />
                  </IntegratedSpinner>
                )}
              </div>
              {selectedJob.id === job.id && (
                <div style={{ display: 'flex', width: '98%' }}>
                  <ReactJson
                    src={showSelected(job)}
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
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
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
        <AccordionDetails style={{ flexWrap: 'wrap' }}>
          {workflows.map((work) => (
            <div
              style={{
                backgroundColor:
                  work.status === 'finished' ? '#b6beec' : 'rgb(255, 167, 1)',
                borderRadius: '5px',
                margin: '2px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  paddingTop: '5px',
                  paddingBottom: '5px',
                }}
              >
                <Chip
                  label={work.workflow_id}
                  onClick={() => workflowDetails(work)}
                  style={{
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    backgroundColor: '#e9ebf7',
                  }}
                  size="medium"
                  // variant="outlined"
                />
                {selectedWorkflow.id === work.id && (
                  <IntegratedSpinner
                    getting={false}
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
              {selectedWorkflow.id === work.id && (
                <div style={{ display: 'flex', width: '98%' }}>
                  <ReactJson
                    src={showSelected(work)}
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
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
      <div>
        <b>Id:</b> {graphRF.graph.id}
      </div>
      <div>
        <b>Inputs </b>
        {/* {graphInputs.length > 0 && <DenseTable data={graphInputs} />} */}
      </div>
      <div>
        <b>Outputs </b>
        {/* {graphOutputs.length > 0 && <DenseTable data={graphOutputs} />} */}
      </div>
      <ReactJson
        src={showSelected(executedEvents[currentExecutionEvent - 1])}
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
    </>
  );
}
