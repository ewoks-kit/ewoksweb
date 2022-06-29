import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';
// import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import IntegratedSpinner from './IntegratedSpinner';
import state from '../store/state';
import { TextField, Button, FormControl } from '@material-ui/core';
import SidebarTooltip from './SidebarTooltip';
import type { Event, GraphRF } from '../types';
import DashboardStyle from '../layout/DashboardStyle';
import AutocompleteDrop from '../Components/AutocompleteDrop';
import ExecutionTable from '../Components/ExecutionTable';
import { getWorkflow } from '../utils/api';

const useStyles = DashboardStyle;

export default function ExecutionFilters() {
  const classes = useStyles();

  const [workflowNameFilter, setWorkflowNameFilter] = useState<String>('');
  const [fromDateFilter, setFromDateFilter] = useState<String>('');
  const [toDateFilter, setToDateFilter] = useState<String>('');
  const [workflowId, setWorkflowId] = React.useState('');
  const [categoryValue, setCategoryValue] = React.useState('');

  const toDateChanged = (val) => {
    console.log(val, workflowNameFilter);
    setToDateFilter(val);
  };

  const fromDateChanged = (val) => {
    console.log(val, workflowNameFilter);
    setFromDateFilter(val);
  };

  const workflowNameChanged = (val) => {
    console.log(val, workflowNameFilter);
  };

  const setInputValue = (workflowDetails) => {
    if (workflowDetails && workflowDetails.id) {
      setWorkflowId(workflowDetails.id || '');
    }
  };

  const setInputCategoryValue = async (workflowDetails) => {
    // filter according to the selected category
    setCategoryValue(workflowDetails.title);
  };

  return (
    <>
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
            variant="standard"
            style={{ width: '100%', minWidth: '200px', margin: '0px 8px' }}
          >
            <AutocompleteDrop
              setInputValue={setInputValue}
              placeholder="Workflows"
              category={categoryValue}
            />
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
            // defaultValue={new Date().toString()}
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
      <ExecutionTable />
    </>
  );
}
