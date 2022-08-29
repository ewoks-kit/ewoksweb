import { Box, FormControl, Grid, Paper, styled } from '@material-ui/core';
import AutocompleteDrop from './AutocompleteDrop';
import ReactJson from 'react-json-view';
import React from 'react';
import { getWorkflow } from '../utils/api';
import GetFromServerButtons from './GetFromServerButtons';
import type { GraphEwoks } from '../types';
import state from '../store/state';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default function ManageWorkflows() {
  const initializedGraph = state((state) => state.initializedGraph);
  const [workflowValue, setWorkflowValue] = React.useState<GraphEwoks>(
    initializedGraph
  );
  const [categoryValue, setCategoryValue] = React.useState('');

  const setInputWorkflowValue = async (workflowDetails) => {
    if (workflowDetails) {
      const response = await getWorkflow(workflowDetails.id);
      // console.log('setInputWorkflowValue', val, response);
      setWorkflowValue(response.data as GraphEwoks);
    }
  };

  const setInputCategoryValue = async (workflowDetails) => {
    // filter according to the selected category
    if (workflowDetails && workflowDetails.title) {
      setCategoryValue(workflowDetails.title);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={1}
        direction="row"
        // justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <Item>
            <FormControl variant="standard" style={{ width: '100%' }}>
              <AutocompleteDrop
                setInputValue={setInputCategoryValue}
                placeholder="Categories"
                category={categoryValue}
              />
            </FormControl>
            <FormControl variant="standard" style={{ width: '100%' }}>
              <AutocompleteDrop
                setInputValue={setInputWorkflowValue}
                placeholder="Workflows"
                category={categoryValue}
              />
            </FormControl>
          </Item>
          <span style={{ display: 'flex' }}>
            <GetFromServerButtons
              workflowId={workflowValue.graph.id}
              showButtons={[true, true]}
            />
          </span>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Item>
            <ReactJson
              src={workflowValue}
              name="Ewoks graph"
              theme="monokai"
              collapsed
              defaultValue="graph"
              collapseStringsAfterLength={30}
              groupArraysAfterLength={15}
              enableClipboard={false}
              quotesOnKeys={false}
              style={{ backgroundColor: 'rgb(59, 77, 172)' }}
              displayDataTypes
            />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
