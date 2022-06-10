import { Box, FormControl, Grid, Paper, styled } from '@material-ui/core';
import AutocompleteDrop from './AutocompleteDrop';
import ReactJson from 'react-json-view';
import React from 'react';
import { getWorkflow } from '../utils/api';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default function ManageWorkflows() {
  const [workflowValue, setWorkflowValue] = React.useState({});
  const [categoryValue, setCategoryValue] = React.useState('');

  const setInputWorkflowValue = async (workflowDetails) => {
    if (workflowDetails) {
      const response = await getWorkflow(workflowDetails.id);
      // console.log('setInputWorkflowValue', val, response);
      setWorkflowValue(response.data);
    }
  };

  const setInputCategoryValue = async (workflowDetails) => {
    // filter according to the selected category
    setCategoryValue(workflowDetails.title);
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
        {/* <Grid item xs={12} sm={12} md={6} lg={3}>
          <Item style={{ backgroundColor: 'rgb(248, 248, 249)' }}>
            Categories
            <FormControl
              variant="standard"
              style={{ width: '100%', minWidth: '260px' }}
            >
              <AutocompleteDrop setInputWorkflowValue={setInputWorkflowValue} />
            </FormControl>
          </Item>
        </Grid> */}
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <Item>
            <FormControl
              variant="standard"
              style={{ width: '100%', minWidth: '260px' }}
            >
              <AutocompleteDrop
                setInputValue={setInputCategoryValue}
                placeholder="Categories"
                category={categoryValue}
              />
            </FormControl>
            <FormControl
              variant="standard"
              style={{ width: '100%', minWidth: '260px' }}
            >
              <AutocompleteDrop
                setInputValue={setInputWorkflowValue}
                placeholder="Workflows"
                category={categoryValue}
              />
            </FormControl>
          </Item>
          {/* <hr />
          <Item>Files</Item> */}
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
