import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { FormControl, Grid, Paper, styled } from '@material-ui/core';
import ReactJson from 'react-json-view';

import AutocompleteDrop from './AutocompleteDrop';
import state from '../store/state';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const setInputValue = () => {
  // //console.log(val, value);
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const graphRF = state((state) => state.graphRF);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Workflows" {...a11yProps(0)} />
          <Tab label="Tasks" {...a11yProps(1)} />
          <Tab label="Settings" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={6} md={2}>
              <Item style={{ backgroundColor: 'rgb(248, 248, 249)' }}>
                Folders
              </Item>
            </Grid>
            <Grid item xs={6} md={4}>
              <Item>
                <FormControl variant="standard" style={{ minWidth: '320px' }}>
                  <AutocompleteDrop setInputValue={setInputValue} />
                </FormControl>
              </Item>
              <hr />
              <Item>Files</Item>
            </Grid>
            <Grid item xs={6} md={6}>
              <Item>
                <ReactJson
                  src={graphRF}
                  name="Ewoks graph"
                  theme="monokai"
                  collapsed
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
      </TabPanel>
      <TabPanel value={value} index={1}>
        Tasks
      </TabPanel>
      <TabPanel value={value} index={2}>
        Settings
      </TabPanel>
    </Box>
  );
}
