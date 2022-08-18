import { useState } from 'react';
// import state from '../store/state';
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
import AutocompleteDrop from '../Components/AutocompleteDrop';
import { getExecutionEvents } from '../utils/api';
import state from '../store/state';
import type { ExecutedJobsResponse } from '../types';

interface filterParams {
  workflow_id: string;
  status: string;
  starttime: string;
  endtime: string;
  // sets context filters out within the job array that is not practical
  // context: string;
  node_id: string;
  // TODO: filter jobs that include this task_id and give back all jobs' steps
  task_id: string;
  user_name: string;
  job_id: string;
  // type: string;
  error?: boolean;
}

export default function ExecutionFilters() {
  // const [workflowNameFilter, setWorkflowNameFilter] = useState<String>('');
  const [fromDateFilter, setFromDateFilter] = useState<String>('');
  const [toDateFilter, setToDateFilter] = useState<String>('');
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
  const setExecutedWorkflows = state((state) => state.setExecutedWorkflows);

  // useEffect(() => {
  //   console.log(new Date().toString());
  //   // setFromDateFilter(new Date().toString());
  // }, []);

  const toDateChanged = (event) => {
    // console.log(event.target.value, workflowId);
    setToDateFilter(event.target.value);
  };

  const fromDateChanged = (event) => {
    // console.log(event.target.value, workflowId);
    setFromDateFilter(event.target.value);
  };

  // const workflowNameChanged = (val) => {
  //   console.log(val, workflowNameFilter);
  // };

  const setInputValue = (workflowDetails) => {
    if (workflowDetails && workflowDetails.id) {
      setWorkflowId(workflowDetails.id || '');
    } else {
      setWorkflowId('');
    }
  };

  const setInputCategoryValue = async (workflowDetails) => {
    // filter according to the selected category
    if (workflowDetails && workflowDetails.title) {
      setCategoryValue(workflowDetails.title);
    }
  };

  const statusChanged = (event) => {
    // console.log(event.target.value, workflowNameFilter);
    setStatus(event.target.value);
  };

  const getEvents = async () => {
    try {
      const filterParams = {} as filterParams;
      if (workflowId) {
        filterParams.workflow_id = workflowId;
      }
      if (status === 'Failed') {
        filterParams.error = true;
      }
      if (fromDateFilter) {
        filterParams.starttime = fromDateFilter.toString();
      }
      if (toDateFilter) {
        filterParams.endtime = toDateFilter.toString();
      }
      // if (context) {
      //   filterParams.context = context;
      // }
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
      // if (type) {
      //   filterParams.type = type;
      // }

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
    // finally {

    // }
  };

  // const errorChanged = (event) => {
  //   console.log(event.target.checked);
  //   setError(event.target.checked);
  // };

  const moreFiltersChanged = (event) => {
    setMoreFilters(event.target.checked);
  };

  // const contextChanged = (event) => {
  //   setContext(event.target.value);
  // };

  const nodeIdChanged = (event) => {
    setNodeId(event.target.value);
  };

  const taskIdChanged = (event) => {
    setTaskId(event.target.value);
  };

  const userNameChanged = (event) => {
    setUserName(event.target.value);
  };

  const jobIdChanged = (event) => {
    setJobId(event.target.value);
  };

  // const typeChanged = (event) => {
  //   setType(event.target.value);
  // };

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
        <AutocompleteDrop
          setInputValue={setInputCategoryValue}
          placeholder="Categories"
          category={categoryValue}
        />
      </FormControl>
      <FormControl
        variant="outlined"
        style={{ minWidth: '200px', margin: '8px' }}
      >
        <AutocompleteDrop
          setInputValue={setInputValue}
          placeholder="Workflows"
          category={categoryValue}
        />
      </FormControl>
      <FormControl
        variant="filled"
        style={{ minWidth: '100px', margin: '8px' }}
      >
        <InputLabel id="demo-select-small">Status</InputLabel>
        <Select value={status} label="Status" onChange={statusChanged}>
          <MenuItem value="">{/* <em>None</em> */}</MenuItem>
          <MenuItem value="Success">Success</MenuItem>
          <MenuItem value="Failed">Failed</MenuItem>
          <MenuItem value="Executing">Executing</MenuItem>
        </Select>
      </FormControl>
      {/* <div style={{ margin: '8px' }}>
        <FormControlLabel
          value={error}
          control={<Switch color="primary" onChange={errorChanged} />}
          label="Error"
          labelPlacement="bottom"
        />
      </div> */}
      <div style={{ margin: '8px' }}>
        <TextField
          id="date"
          label="From"
          type="date"
          // value={fromDateFilter}
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
          id="date"
          label="To"
          type="date"
          // value={toDateFilter}
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
              id="date"
              label="From time"
              type="time"
              // value={toDateFilter}
              defaultValue={new Date().toString()}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              onChange={toDateChanged}
            />
          </div>
          <div style={{ margin: '8px' }}>
            <TextField
              id="date"
              label="To time"
              type="time"
              // value={toDateFilter}
              defaultValue={new Date().toString()}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              onChange={toDateChanged}
            />
          </div>
          {/* <div style={{ margin: '8px' }}>
            <TextField
              label="Context"
              value={context}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              onChange={contextChanged}
            />
          </div> */}
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
          {/* <div style={{ margin: '8px' }}>
            <TextField
              label="Type"
              value={type}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              onChange={typeChanged}
            />
          </div> */}
        </>
      )}
      <Button
        style={{ margin: '8px' }}
        variant="outlined"
        color="primary"
        onClick={getEvents}
        size="small"
      >
        Filter
      </Button>
    </div>
  );
}
