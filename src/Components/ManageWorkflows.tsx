import { Box, FormControl, Grid, Paper, styled } from '@material-ui/core';
import AutocompleteDrop from './AutocompleteDrop';
import ReactJson from 'react-json-view';
import React from 'react';
import configData from '../configData.json';
import axios from 'axios';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ManageWorkflows() {
  const [workflowValue, setWorkflowValue] = React.useState({});

  const setInputValue = async (val: string) => {
    // console.log(val);

    const response = await axios.get(`${configData.serverUrl}/workflow/${val}`);
    setWorkflowValue(response.data);
    // console.log(response);
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
        {/* <Grid item xs={12} sm={12} md={6} lg={2}>
              <Item style={{ backgroundColor: 'rgb(248, 248, 249)' }}>
                Folders
              </Item>
            </Grid> */}
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <Item>
            <FormControl
              variant="standard"
              style={{ width: '100%', minWidth: '260px' }}
            >
              <AutocompleteDrop setInputValue={setInputValue} />
            </FormControl>
          </Item>
          {/* <hr />
              <Item>Files</Item> */}
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={7}>
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
