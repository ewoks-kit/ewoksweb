import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  Paper,
  styled,
  Tooltip,
} from '@material-ui/core';
import ReactJson from 'react-json-view';

import AutocompleteDrop from './AutocompleteDrop';
import state from '../store/state';
import axios from 'axios';
import { PhotoCamera } from '@material-ui/icons';
import AddNodes from './AddNodes';
import orange1 from '../images/orange1.png';
import orange2 from '../images/orange2.png';
import orange3 from '../images/orange3.png';
import AggregateColumns from '../images/AggregateColumns.svg';
import Continuize from '../images/Continuize.svg';
import graphInput from '../images/graphInput.svg';
import graphOutput from '../images/graphOutput.svg';
import Correlations from '../images/Correlations.svg';
import CreateClass from '../images/CreateClass.svg';

const icons = [
  'orange1',
  'Continuize',
  'graphInput',
  'graphOutput',
  'orange2',
  'orange3',
  'AggregateColumns',
  'Correlations',
  'CreateClass',
];

const iconsObj = {
  orange1,
  Continuize,
  graphInput,
  graphOutput,
  orange2,
  orange3,
  AggregateColumns,
  Correlations,
  CreateClass,
};

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
  // // console.log(val, value);
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
  // textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [fileToBeSent, setFileToBeSent] = React.useState('');
  const graphRF = state((state) => state.graphRF);
  const [selectedIcon, setSelectedIcon] = React.useState('');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const onChangeFile = (file) => {
    console.log(file, value);
  };

  const uploadFile = (e) => {
    e.preventDefault();
    console.log(e, value);
    const file = fileToBeSent;
    const formData = new FormData(e.target);

    // formData.append('file', file);

    axios
      .post('/api/upload', formData)
      .then((res) => console.log(res))
      .catch((error) => console.warn(error));
  };

  const clickIcon = (elem) => {
    setSelectedIcon(elem);
  };

  const deleteIcon = (icon) => {
    // TODO: see if it is selected for a task and warn on deletion
    // if icon is deleted check that a task that includes it behaves correctly using text???
    console.log(icon, value);
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
          <Tab label="Icons" {...a11yProps(2)} />
          <Tab label="Settings" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={1}
            direction="row"
            // justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item xs={12} sm={12} md={6} lg={2}>
              <Item style={{ backgroundColor: 'rgb(248, 248, 249)' }}>
                Folders
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <Item>
                <FormControl
                  variant="standard"
                  style={{ width: '100%', minWidth: '260px' }}
                >
                  <AutocompleteDrop setInputValue={setInputValue} />
                </FormControl>
              </Item>
              <hr />
              <Item>Files</Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={7}>
              <Item>
                <ReactJson
                  src={graphRF}
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
      </TabPanel>
      <TabPanel value={value} index={1}>
        Tasks
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={1}
            direction="row"
            // justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item xs={12} sm={12} md={8} lg={6}>
              <Item style={{ backgroundColor: 'rgb(246, 248, 249)' }}>
                <span className="dndflow" style={{ display: 'flex' }}>
                  {icons.map((ico) => (
                    <span
                      onClick={() => clickIcon(ico)}
                      aria-hidden="true"
                      role="button"
                      tabIndex={0}
                      key={ico}
                      className={`dndnode ${
                        selectedIcon && selectedIcon === ico
                          ? 'selectedTask'
                          : ''
                      }`}
                    >
                      <Tooltip title={ico} arrow>
                        {/* TODO: for deleting task and clone in dialog? */}
                        <span
                          // onContextMenu={onRigthClick}
                          role="button"
                          tabIndex={0}
                        >
                          <img src={iconsObj[ico]} alt="" />
                        </span>
                      </Tooltip>
                    </span>
                  ))}
                </span>
              </Item>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={2}>
              <Item style={{ backgroundColor: 'rgb(248, 248, 249)' }}>
                <Button
                  style={{ margin: '8px' }}
                  variant="outlined"
                  color="secondary"
                  onClick={deleteIcon}
                  size="small"
                >
                  Delete
                </Button>
                <Button
                  style={{ margin: '8px' }}
                  variant="outlined"
                  color="primary"
                  // onClick={() =>
                  //   action('cloneTask', selectedTask.task_identifier)
                  // }
                  // onClick={cloneTask}
                  size="small"
                >
                  Clone
                </Button>
                <form
                  onSubmit={uploadFile}
                  // enctype="multipart/form-data"
                >
                  <div>
                    <label htmlFor="image">Select an Icon to Upload</label>
                    <div>
                      <input
                        type="file"
                        id="image"
                        name="file"
                        accept="image/*"
                        className="file-custom"
                      />
                    </div>
                  </div>

                  <div>
                    <Button
                      variant="outlined"
                      type="submit"
                      className="btn btn-md btn-primary"
                    >
                      Upload Icon
                    </Button>
                  </div>
                </form>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={3}>
        Settings
      </TabPanel>
    </Box>
  );
}
