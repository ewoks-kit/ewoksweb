import React from 'react';
import { Button, Box, Grid, Paper, styled, Tooltip } from '@material-ui/core';
import orange1 from '../images/orange1.png';
import orange2 from '../images/orange2.png';
import orange3 from '../images/orange3.png';
import AggregateColumns from '../images/AggregateColumns.svg';
import Continuize from '../images/Continuize.svg';
import graphInput from '../images/graphInput.svg';
import graphOutput from '../images/graphOutput.svg';
import Correlations from '../images/Correlations.svg';
import CreateClass from '../images/CreateClass.svg';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from 'axios';
import configData from '../configData.json';
import type { Task } from '../types';
import state from '../store/state';
import ConfirmDialog from './ConfirmDialog';
import { getTaskDescription } from '../utils/api';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  backgroundColor: 'rgb(246, 248, 249)',
  color: theme.palette.text.secondary,
}));

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

export default function ManageIcons() {
  const [selectedIcon, setSelectedIcon] = React.useState('');
  const [fileToBeSent, setFileToBeSent] = React.useState({
    file: File,
    filename: '',
  });

  const [openAgreeDialog, setOpenAgreeDialog] = React.useState<boolean>(false);
  const setOpenSnackbar = state((state) => state.setOpenSnackbar);

  const clickIcon = (icon) => {
    setSelectedIcon(icon);
  };

  const deleteIcon = async () => {
    try {
      const tasksData = await getTaskDescription();
      const tasks = tasksData.data as { items: Task[] };
      const allTasks = tasks.items;

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
          error.response?.data?.message ||
          'Error in deleting Task. Please check connectivity with the server!',
        severity: 'error',
      });
    }
  };

  const uploadFile = async (event) => {
    event.preventDefault();
    // console.log(event.target, fileToBeSent.file);
    const data = new FormData();

    data.append('file', (fileToBeSent.file as unknown) as File);
    // data.append('filename', fileToBeSent.filename);

    try {
      await axios.post(`${configData.serverUrl}/icons`, data);
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error.response?.data?.message || configData.retrieveTasksError,
        severity: 'error',
      });
    }
  };

  const inputNew = (ne) => {
    if (ne.target.files[0].size < 10_000) {
      setOpenSnackbar({
        open: true,
        text: 'File ready to be uploadede as an icon',
        severity: 'success',
      });
      // console.log(ne.target.value, ne.target.files[0]);
      getIcon('up.svg');
      setFileToBeSent({ file: ne.target.files[0], filename: ne.target.value });
    } else {
      // setFileToBeSent('');
      setOpenSnackbar({
        open: true,
        text: 'Files more than 1Kb are not acceptable for icons',
        severity: 'warning',
      });
    }
  };

  const agreeDeleteIcon = async () => {
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

  const disAgreeDeleteIcon = () => {
    setOpenAgreeDialog(false);
  };

  // const getIcons = async () => {
  //   const iconsData = await axios.get(
  //     `${configData.serverUrl}/icons/descriptions`
  //   );
  //   const icons = iconsData.data as string[];
  //   setIcons(icons);
  // };

  const getIcon = async (id: string) => {
    // console.log(selectedIcon, id);
    const iconsData = await axios.get(`${configData.serverUrl}/icon/${id}`);
    // console.log(iconsData);
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      iconsData.data as string,
      'image/svg+xml'
    );
    // console.log(doc.childNodes[1]);
    setSelectedIcon((doc.childNodes[1] as unknown) as string);
  };

  // const image =
  //   '<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width="47.4" height="40.65" viewBox="21 18.5 158 135.5"><path d="M25,50 l150,0 0,100 -150,0 z" stroke-width="4" stroke="black" fill="rgb(128,224,255)" fill-opacity="1" ></path><path d="M25,50 L175,150 M25,150 L175,50" stroke-width="4" stroke="black" fill="black" ></path><g transform="translate(0,0)" stroke-width="4" stroke="black" fill="none" ><circle cx="100" cy="30" r="7.5" fill="black" ></circle><circle cx="70" cy="30" r="7.5" fill="black" ></circle><circle cx="130" cy="30" r="7.5" fill="black" ></circle></g></svg>';

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ConfirmDialog
        title={`Delete "${selectedIcon}" icon?`}
        content={`You are about to delete an icon.
              After deletion it will not be available to be used in any Task description!
              Do you agree to continue?`}
        open={openAgreeDialog}
        agreeCallback={agreeDeleteIcon}
        disagreeCallback={disAgreeDeleteIcon}
      />
      <Grid
        container
        spacing={1}
        direction="row"
        // justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item xs={12} sm={12} md={8} lg={6}>
          <Item>
            <span className="dndflow" style={{ display: 'flex' }}>
              {icons.map((ico) => (
                <span
                  onClick={() => clickIcon(ico)}
                  aria-hidden="true"
                  role="button"
                  tabIndex={0}
                  key={ico}
                  className={`dndnode ${
                    selectedIcon && selectedIcon === ico ? 'selectedTask' : ''
                  }`}
                >
                  <Tooltip title={ico} arrow>
                    <span
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
          <Item>
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
                // disabled={fileToBeSent === ''}
              >
                Upload
              </Button>
              <hr />

              <div>
                {/* <img src={`data:image/svg+xml;utf8,${image}`} alt="image" /> */}
                <svg>{selectedIcon}</svg>
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
                  </div>
                </label>
              </div>
            </form>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
