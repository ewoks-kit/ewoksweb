import type { ChangeEvent } from 'react';
import { useState } from 'react';
// import useStore from '../store/state';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { getExecutionEvents } from '../../utils/api';
import useStore from '../../store/useStore';
import type {
  ExecutedJobsResponse,
  WorkflowDescription,
  filterParams,
} from '../../types';
import CategoryDropdown from '../General/dropdown/CategoryDropdown';
import WorkflowDropdown from '../General/dropdown/WorkflowDropdown';

export default function ExecutionFilters() {
  // const [workflowNameFilter, setWorkflowNameFilter] = useState<String>('');
  const [fromTimeFilter, setFromTimeFilter] = useState<string>('');
  const [toTimeFilter, setToTimeFilter] = useState<string>('');
  const [fromDateFilter, setFromDateFilter] = useState<string>('');
  const [toDateFilter, setToDateFilter] = useState<string>('');
  const [workflowId, setWorkflowId] = useState('');
  const [categoryValue, setCategoryValue] = useState('');
  const [status, setStatus] = useState('');
  // const [error, setError] = useState<boolean>(false);
  // const [context, setContext] = useState<string>('');
  const [nodeId, setNodeId] = useState<string>('');
  const [taskId, setTaskId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [jobId, setJobId] = useState<string>('');
  // const [type, setType] = useState<string>('');
  const [moreFilters, setMoreFilters] = useState<boolean>(false);
  const setExecutedWorkflows = useStore((state) => state.setExecutedWorkflows);

  const toDateChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setToDateFilter(event.target.value);
  };

  const fromDateChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setFromDateFilter(event.target.value);
  };

  const toTimeChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setToTimeFilter(event.target.value);
  };

  const fromTimeChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setFromTimeFilter(event.target.value);
  };

  // TODO: same as in manageWorkflows for category and workflows
  function setInputValue(workflowDetails: WorkflowDescription) {
    setWorkflowId(workflowDetails?.id ?? '');
  }

  function setCategoryFilter(category: string) {
    setCategoryValue(category ?? '');
  }

  function statusChanged(event: ChangeEvent<{ value: string }>) {
    setStatus(event.target.value);
  }

  async function getEvents() {
    try {
      const filterParams = {} as filterParams;
      if (workflowId) {
        filterParams.workflow_id = workflowId;
      }

      filterParams.error = status !== 'Success';

      if (fromDateFilter) {
        filterParams.starttime = fromDateFilter.toString();
      }
      if (toDateFilter) {
        filterParams.endtime = toDateFilter.toString();
      }
      if (fromTimeFilter && fromDateFilter) {
        filterParams.starttime += ` ${fromTimeFilter.toString()}`;
      }
      if (toTimeFilter && toDateFilter) {
        filterParams.endtime += ` ${toTimeFilter.toString()}`;
      }
      if (nodeId) {
        filterParams.node_id = nodeId;
      }
      if (taskId) {
        filterParams.task_id = taskId;
      }
      if (userName) {
        filterParams.user_name = userName;
      }
      if (jobId) {
        filterParams.job_id = jobId;
      }
      const response = await getExecutionEvents(filterParams);
      if (response.data) {
        const execJobs = response.data as ExecutedJobsResponse;
        setExecutedWorkflows(execJobs.jobs, false);
      } else {
        /* eslint-disable no-console */
        console.log('no response data');
      }
    } catch (error) {
      console.log(error);
    }
  }

  function moreFiltersChanged(event: ChangeEvent<HTMLInputElement>) {
    setMoreFilters(event.target.checked);
  }

  function nodeIdChanged(event: ChangeEvent<HTMLInputElement>) {
    setNodeId(event.target.value);
  }

  function taskIdChanged(event: ChangeEvent<HTMLInputElement>) {
    setTaskId(event.target.value);
  }

  function userNameChanged(event: ChangeEvent<HTMLInputElement>) {
    setUserName(event.target.value);
  }

  function jobIdChanged(event: ChangeEvent<HTMLInputElement>) {
    setJobId(event.target.value);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <FormControl
        variant="outlined"
        style={{ minWidth: '200px', margin: '8px' }}
      >
        <CategoryDropdown onChange={setCategoryFilter} />
      </FormControl>
      <FormControl
        variant="outlined"
        style={{ minWidth: '200px', margin: '8px' }}
      >
        <WorkflowDropdown onChange={setInputValue} category={categoryValue} />
      </FormControl>
      <FormControl
        variant="filled"
        style={{ minWidth: '100px', margin: '8px' }}
      >
        <InputLabel>Status</InputLabel>
        <Select value={status} label="Status" onChange={statusChanged}>
          <MenuItem value="">{/* <em>None</em> */}</MenuItem>
          <MenuItem value="Success">Success</MenuItem>
          <MenuItem value="Failed">Failed</MenuItem>
          <MenuItem value="Executing">Executing</MenuItem>
        </Select>
      </FormControl>
      <div style={{ margin: '8px' }}>
        <TextField
          label="From"
          type="date"
          value={fromDateFilter}
          defaultValue={new Date().toString()}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          onChange={fromDateChanged}
        />
      </div>
      <div style={{ margin: '8px' }}>
        <TextField
          label="To"
          type="date"
          value={toDateFilter}
          defaultValue={new Date().toString()}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          onChange={toDateChanged}
        />
      </div>

      <div style={{ margin: '8px' }}>
        <FormControlLabel
          value={moreFilters}
          control={<Switch color="primary" onChange={moreFiltersChanged} />}
          label="More"
          labelPlacement="bottom"
        />
      </div>

      {moreFilters && (
        <>
          <div style={{ margin: '8px' }}>
            <TextField
              label="From time"
              type="time"
              // value={toDateFilter}
              defaultValue={new Date().toString()}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              onChange={fromTimeChanged}
            />
          </div>
          <div style={{ margin: '8px' }}>
            <TextField
              label="To time"
              type="time"
              // value={toDateFilter}
              defaultValue={new Date().toString()}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              onChange={toTimeChanged}
            />
          </div>
          <div style={{ margin: '8px' }}>
            <TextField
              label="Node id"
              value={nodeId}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              onChange={nodeIdChanged}
            />
          </div>
          <div style={{ margin: '8px' }}>
            <TextField
              label="Task id"
              value={taskId}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              onChange={taskIdChanged}
            />
          </div>
          <div style={{ margin: '8px' }}>
            <TextField
              label="User Name"
              value={userName}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              onChange={userNameChanged}
            />
          </div>
          <div style={{ margin: '8px' }}>
            <TextField
              label="Job id"
              value={jobId}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              onChange={jobIdChanged}
            />
          </div>
        </>
      )}
      <Button
        style={{ margin: '8px' }}
        variant="outlined"
        color="primary"
        onClick={() => {
          getEvents();
        }}
        size="small"
      >
        Filter
      </Button>
    </div>
  );
}
