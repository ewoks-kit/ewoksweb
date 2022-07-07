import { useState } from 'react';
// import state from '../store/state';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
// import SidebarTooltip from './SidebarTooltip';
// import type { Event, GraphRF } from '../types';
import DashboardStyle from '../layout/DashboardStyle';
import AutocompleteDrop from '../Components/AutocompleteDrop';
// import { DatePicker } from '@material-ui/lab/';
// import DatePicker from '@material-ui/lab/Date';

const useStyles = DashboardStyle;

export default function ExecutionFilters() {
  const classes = useStyles();

  // const [workflowNameFilter, setWorkflowNameFilter] = useState<String>('');
  const [fromDateFilter, setFromDateFilter] = useState<String>('');
  const [toDateFilter, setToDateFilter] = useState<String>('');
  const [workflowId, setWorkflowId] = useState('');
  const [categoryValue, setCategoryValue] = useState('');
  const [status, setStatus] = useState('');

  const toDateChanged = (val) => {
    // console.log(val.target.value, workflowNameFilter);
    setToDateFilter(val);
  };

  const fromDateChanged = (val) => {
    /* eslint-disable no-console */
    console.log(val, workflowId);
    setFromDateFilter(val);
  };

  // const workflowNameChanged = (val) => {
  //   console.log(val, workflowNameFilter);
  // };

  const setInputValue = (workflowDetails) => {
    if (workflowDetails && workflowDetails.id) {
      setWorkflowId(workflowDetails.id || '');
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

  return (
    <div style={{ display: 'flex' }}>
      <div className={classes.hasMarginSides} style={{ display: 'flex' }}>
        <FormControl
          variant="outlined"
          style={{ width: '100%', minWidth: '200px', margin: '0px 8px' }}
        >
          <AutocompleteDrop
            setInputValue={setInputCategoryValue}
            placeholder="Categories"
            category={categoryValue}
          />
        </FormControl>
        <FormControl
          variant="outlined"
          style={{ width: '100%', minWidth: '200px', margin: '0px 8px' }}
        >
          <AutocompleteDrop
            setInputValue={setInputValue}
            placeholder="Workflows"
            category={categoryValue}
          />
        </FormControl>
        <FormControl
          variant="filled"
          style={{ width: '100%', minWidth: '200px', margin: '0px 8px' }}
        >
          <InputLabel id="demo-select-small">Status</InputLabel>
          <Select value={status} label="Status" onChange={statusChanged}>
            <MenuItem value="">{/* <em>None</em> */}</MenuItem>
            <MenuItem value="Success">Success</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
            <MenuItem value="Executing">Executing</MenuItem>
          </Select>
        </FormControl>
        {/* <AutocompleteDrop
          setInputValue={setInputValue}
          placeholder="Workflows"
          category=""
        /> */}
      </div>
      <div className={classes.detailsLabels} style={{ margin: '0px 8px' }}>
        <TextField
          id="date"
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
      <div className={classes.detailsLabels} style={{ margin: '0px 8px' }}>
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
    </div>
  );
}
