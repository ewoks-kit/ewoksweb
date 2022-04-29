import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {
  Button,
  // Fab,
  FormControl,
  Grid,
  Paper,
  styled,
  Tooltip,
} from '@material-ui/core';
import ReactJson from 'react-json-view';

import AutocompleteDrop from './AutocompleteDrop';
import state from '../store/state';
import axios from 'axios';
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
import configData from '../configData.json';
import type { Task } from '../types';
import ConfirmDialog from './ConfirmDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import EventNoteIcon from '@material-ui/icons/EventNote';
// import AddIcon from '@material-ui/icons/Add';

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
  const [selectedIcon, setSelectedIcon] = React.useState('');
  const [openAgreeDialog, setOpenAgreeDialog] = React.useState<boolean>(false);
  const [workflowValue, setWorkflowValue] = React.useState({});

  const setOpenSnackbar = state((state) => state.setOpenSnackbar);

  const setInputValue = async (val: string) => {
    // console.log(val);

    const response = await axios.get(`${configData.serverUrl}/workflow/${val}`);
    setWorkflowValue(response.data);
    // console.log(response);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const uploadFile = (event) => {
    event.preventDefault();
    console.log(event.target, value);
    const formData = new FormData(event.target);

    // formData.append('file', file);
    // TODO after server ready
    axios
      .post('/api/upload', formData)
      .then((res) => console.log(res))
      .catch((error) => console.warn(error));
  };

  const clickIcon = (icon) => {
    console.log('selected icon', icon, fileToBeSent);
    setSelectedIcon(icon);
  };

  const deleteIcon = async () => {
    try {
      const tasksData = await axios.get(
        `${configData.serverUrl}/tasks/descriptions`
      );

      const allTasks = tasksData.data as Task[];

      if (allTasks.map((task) => task.icon).includes(selectedIcon)) {
        setOpenSnackbar({
          open: true,
          text: `Icon cannot be deleted since it is used in one or more Tasks!`,
          severity: 'warning',
        });
      } else {
        setOpenSnackbar({
          open: true,
          text: `Icon can be deleted since it is not used in any Task!`,
          severity: 'success',
        });
        setOpenAgreeDialog(true);
      }
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text:
          error.response?.data ||
          'Error in deleting Task. Please check connectivity with the server!',
        severity: 'error',
      });
    }
  };

  // const getIcons = async () => {
  //   const iconsData = await axios.get(
  //     `${configData.serverUrl}/icons/descriptions`
  //   );
  //   const icons = iconsData.data as string[];
  //   setIcons(icons);
  // };

  const agreeDeleteTask = async () => {
    setOpenAgreeDialog(false);
    await axios
      .delete(`${configData.serverUrl}/icon/${selectedIcon}`)
      .then(() => {
        setOpenSnackbar({
          open: true,
          text: `Icon was succesfully deleted!`,
          severity: 'success',
        });
        // getIcons();
      })
      .catch((error) => {
        setOpenSnackbar({
          open: true,
          text: error?.response?.data || 'Error in deleting Task',
          severity: 'error',
        });
      });
  };

  const disAgreeDeleteTask = () => {
    setOpenAgreeDialog(false);
  };

  const inputNew = (ne) => {
    console.log(ne, ne.target.files[0].size, fileToBeSent);
    if (ne.target.files[0].size < 1000) {
      setOpenSnackbar({
        open: true,
        text: 'File ready to be uploadede as an icon',
        severity: 'success',
      });
      setFileToBeSent(ne.target.value);
    } else {
      setFileToBeSent('');
      setOpenSnackbar({
        open: true,
        text: 'Files more than 1Kb are not acceptable for icons',
        severity: 'warning',
      });
    }
  };

  const discoverTasks = (event) => {
    console.log(event, value);
    setOpenSnackbar({
      open: true,
      text: 'A form for info regarding discovery',
      severity: 'success',
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <ConfirmDialog
        title={`Delete "${selectedIcon}" icon?`}
        content={`You are about to delete an icon.
              After deletion it will not be available to be used in any Task description!
              Do you agree to continue?`}
        open={openAgreeDialog}
        agreeCallback={agreeDeleteTask}
        disagreeCallback={disAgreeDeleteTask}
      />
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
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid
          container
          spacing={1}
          direction="row"
          // justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item xs={12} sm={8} md={8} lg={5} className="dndflow">
            <AddNodes title="Tasks" />
          </Grid>
          <Grid item xs={12} sm={8} md={8} lg={2} className="dndflow">
            <Button
              startIcon={<EventNoteIcon />}
              style={{ margin: '8px' }}
              variant="outlined"
              color="primary"
              onClick={discoverTasks}
              size="small"
            >
              Discover Tasks
            </Button>
          </Grid>
        </Grid>
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
                          style={{
                            overflow: 'hidden',
                            overflowWrap: 'break-word',
                          }}
                        >
                          <img src={iconsObj[ico]} alt={ico} />
                        </span>
                      </Tooltip>
                    </span>
                  ))}
                </span>
              </Item>
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={3}>
              <Item style={{ backgroundColor: 'rgb(248, 248, 249)' }}>
                <form
                  onSubmit={uploadFile}
                  // enctype="multipart/form-data"
                >
                  <Button
                    startIcon={<DeleteIcon />}
                    style={{ margin: '8px' }}
                    variant="outlined"
                    color="secondary"
                    onClick={deleteIcon}
                    size="small"
                    disabled={selectedIcon === ''}
                  >
                    Delete
                  </Button>
                  <Button
                    startIcon={<CloudUploadIcon />}
                    variant="outlined"
                    type="submit"
                    color="primary"
                    size="small"
                    disabled={fileToBeSent === ''}
                  >
                    Upload
                  </Button>
                  <hr />

                  <div>
                    <label htmlFor="upload-icon">
                      Select an Icon to Upload
                      <div>
                        <input
                          // style={{ display: 'none' }}
                          type="file"
                          id="upload-icon"
                          name="upload-icon"
                          accept="image/*"
                          onChange={inputNew}
                          aria-label="Select Icon"
                        />
                        {/* <Fab
                          color="secondary"
                          size="small"
                          component="span"
                          aria-label="add"
                          variant="extended"
                        >
                          <AddIcon /> Upload photo
                        </Fab>
                        {fileToBeSent} */}
                      </div>
                    </label>
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
