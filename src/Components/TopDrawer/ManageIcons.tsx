import React from 'react';
import { Button, Box, Grid, Paper, styled, Tooltip } from '@material-ui/core';
import orange1 from 'images/orange1.png';
import orange2 from 'images/orange2.png';
import orange3 from 'images/orange3.png';
import AggregateColumns from 'images/AggregateColumns.svg';
import Continuize from 'images/Continuize.svg';
import graphInput from 'images/graphInput.svg';
import graphOutput from 'images/graphOutput.svg';
import Correlations from 'images/Correlations.svg';
import CreateClass from 'images/CreateClass.svg';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from 'axios';
import type { Task } from 'types';
import useStore from 'store/useStore';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { getTaskDescription } from 'utils/api';

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
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const allIcons = useStore((state) => state.allIcons);

  function clickIcon(icon: string) {
    console.log(icon);

    setSelectedIcon(icon);
  }

  async function deleteIcon() {
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
  }

  async function uploadFile(event) {
    event.preventDefault();
    const data = new FormData();

    data.append('file', (fileToBeSent.file as unknown) as File);
    console.log(fileToBeSent, data);
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/icon/${fileToBeSent.file.name}`,
        {
          data_url:
            'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRjUwMjM7IiBkPSJNMjU2LDUxMmMtNjguNDgsMC0xMzIuNzk3LTI2LjYtMTgxLjA5Ni03NC45MDRDMjYuNiwzODguNzk3LDAsMzI0LjQ4LDAsMjU2DQoJYzAtNjguNDg2LDI2LjYtMTMyLjc5Nyw3NC45MDQtMTgxLjA5NkMxMjMuMjA0LDI2LjYsMTg3LjUxNSwwLDI1NiwwYzY4LjQ4LDAsMTMyLjc5NywyNi42LDE4MS4wOTYsNzQuOTA0DQoJQzQ4NS40LDEyMy4yMDMsNTEyLDE4Ny41Miw1MTIsMjU2YzAsNjguNDg2LTI2LjYsMTMyLjc5Ny03NC45MDQsMTgxLjA5NmwwLDBsMCwwQzM4OC43OTcsNDg1LjQsMzI0LjQ4Niw1MTIsMjU2LDUxMnoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNDRDJBMDA7IiBkPSJNMjU2LDB2NTEyYzY4LjQ4NiwwLDEzMi43OTctMjYuNiwxODEuMDk2LTc0LjkwNEM0ODUuNCwzODguNzk3LDUxMiwzMjQuNDg2LDUxMiwyNTYNCgljMC02OC40OC0yNi42LTEzMi43OTctNzQuOTA0LTE4MS4wOTZDMzg4Ljc5NywyNi42LDMyNC40OCwwLDI1NiwweiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0zNTYuMDcyLDM5NS4wNTRIMTU1LjU5NGMtNi40NTUsMC0xMi4zMzQtMy43Mi0xNS4wOTctOS41NDljLTIuNzYyLTUuODM1LTEuOTItMTIuNzQyLDIuMTY0LTE3LjczNQ0KCWw5MS41ODktMTExLjkzN2wtOTEuNTg2LTExMS45MzdjLTQuMDg0LTQuOTkyLTQuOTI3LTExLjktMi4xNjQtMTcuNzM1YzIuNzYyLTUuODI5LDguNjQyLTkuNTQ5LDE1LjA5Ny05LjU0OWgyMDAuNDc5DQoJYzkuMjI5LDAsMTYuNzA3LDcuNDc4LDE2LjcwNywxNi43MDd2MzMuNDEzYzAsOS4yMjktNy40NzgsMTYuNzA3LTE2LjcwNywxNi43MDdjLTkuMjI5LDAtMTYuNzA3LTcuNDc4LTE2LjcwNy0xNi43MDd2LTE2LjcwNw0KCUgxOTAuODUxbDc3LjkxNSw5NS4yMzFjNS4wMzEsNi4xNSw1LjAzMSwxNS4wMDUsMCwyMS4xNTVsLTc3LjkxNSw5NS4yMzFoMTQ4LjUxNXYtMTYuNzA3YzAtOS4yMjksNy40NzgtMTYuNzA3LDE2LjcwNy0xNi43MDcNCglzMTYuNzA3LDcuNDc4LDE2LjcwNywxNi43MDd2MzMuNDEzQzM3Mi43NzksMzg3LjU3NywzNjUuMzAyLDM5NS4wNTQsMzU2LjA3MiwzOTUuMDU0eiIvPg0KPGc+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRTZCMzsiIGQ9Ik0zNzIuNzc5LDM3OC4zNDh2LTMzLjQxM2MwLTkuMjI5LTcuNDc4LTE2LjcwNy0xNi43MDctMTYuNzA3cy0xNi43MDcsNy40NzgtMTYuNzA3LDE2LjcwN3YxNi43MDcNCgkJaC04My41MzN2MzMuNDEzaDEwMC4yMzlDMzY1LjMwMiwzOTUuMDU0LDM3Mi43NzksMzg3LjU3NywzNzIuNzc5LDM3OC4zNDh6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRTZCMzsiIGQ9Ik0yNjguNzY2LDI0NS4yNTVsLTEyLjkzMy0xNS44MDd2NTIuNzY4bDEyLjkzMi0xNS44MDcNCgkJQzI3My43OTYsMjYwLjI2LDI3My43OTYsMjUxLjQwNywyNjguNzY2LDI0NS4yNTV6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRTZCMzsiIGQ9Ik0zNTYuMDcyLDExNi42MTJIMjU1LjgzM3YzMy40MTNoODMuNTMzdjE2LjcwN2MwLDkuMjI5LDcuNDc4LDE2LjcwNywxNi43MDcsMTYuNzA3DQoJCXMxNi43MDctNy40NzgsMTYuNzA3LTE2LjcwN3YtMzMuNDEzQzM3Mi43NzksMTI0LjA5LDM2NS4zMDIsMTE2LjYxMiwzNTYuMDcyLDExNi42MTJ6Ii8+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==',
        }
      );
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error.response?.data?.message,
        severity: 'error',
      });
    }
  }

  // TODO: Typescript
  function inputNew(ne) {
    console.log(ne.target);
    if (ne.target.files[0].size < 10_000) {
      setOpenSnackbar({
        open: true,
        text: 'File ready to be uploaded as an icon',
        severity: 'success',
      });

      setFileToBeSent({ file: ne.target.files[0], filename: ne.target.value });
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Files more than 10Kb are not acceptable for icons',
        severity: 'warning',
      });
    }
  }

  async function agreeDeleteIcon() {
    setOpenAgreeDialog(false);
    await axios
      .delete(`${process.env.REACT_APP_SERVER_URL}/icon/${selectedIcon}`)
      .then(() => {
        setOpenSnackbar({
          open: true,
          text: `Icon was succesfully deleted!`,
          severity: 'success',
        });
      })
      .catch((error) => {
        setOpenSnackbar({
          open: true,
          text: error?.response?.data || 'Error in deleting Task',
          severity: 'error',
        });
      });
  }

  function disAgreeDeleteIcon() {
    setOpenAgreeDialog(false);
  }

  // TODO: Examine the code
  // const getIcons = async () => {
  //   const iconsData = await axios.get(
  //     `${process.env.REACT_APP_SERVER_URL}/icons/descriptions`
  //   );
  //   const icons = iconsData.data as string[];
  //   setIcons(icons);
  // };

  // const getIconL = async (id: string) => {
  //   /* eslint-disable no-console */
  //   console.log(selectedIcon, id);
  //   const iconsData: AxiosResponse<string> = await getIcon(id);
  //   console.log(iconsData, selectedIcon, id);
  //   // console.log(iconsData);
  //   // const parser = new DOMParser();
  //   // const doc = parser.parseFromString(
  //   //   iconsData.data as string,
  //   //   'image/svg+xml'
  //   // );
  //   // // console.log(doc.childNodes[1]);
  //   setSelectedIcon(iconsData.data);
  // };

  // const image =
  //   '<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width="47.4" height="40.65" viewBox="21 18.5 158 135.5"><path d="M25,50 l150,0 0,100 -150,0 z" stroke-width="4" stroke="black" fill="rgb(128,224,255)" fill-opacity="1" ></path><path d="M25,50 L175,150 M25,150 L175,50" stroke-width="4" stroke="black" fill="black" ></path><g transform="translate(0,0)" stroke-width="4" stroke="black" fill="none" ><circle cx="100" cy="30" r="7.5" fill="black" ></circle><circle cx="70" cy="30" r="7.5" fill="black" ></circle><circle cx="130" cy="30" r="7.5" fill="black" ></circle></g></svg>';

  return (
    <Box>
      <ConfirmDialog
        title={`Delete "${selectedIcon}" icon?`}
        content={`You are about to delete an icon.
              After deletion it will not be available to be used in any Task description!
              Do you agree to continue?`}
        open={openAgreeDialog}
        agreeCallback={agreeDeleteIcon}
        disagreeCallback={disAgreeDeleteIcon}
      />
      <Grid container spacing={1} direction="row" alignItems="center">
        <Grid item xs={12} sm={12} md={8} lg={6}>
          <Item>
            <span className="dndflow" style={{ display: 'flex' }}>
              <span>
                {allIcons.map((icon) => (
                  <span
                    onClick={() => clickIcon(icon.name)}
                    aria-hidden="true"
                    role="button"
                    tabIndex={0}
                    key={icon.name}
                    className={`dndnode ${
                      selectedIcon && selectedIcon === icon.name
                        ? 'selectedTask'
                        : ''
                    }`}
                  >
                    <Tooltip title={icon.name} arrow>
                      <span role="button" tabIndex={0} className="iconDetails">
                        <img
                          src={icon.image.data_url}
                          alt={icon.name}
                          key={icon.name}
                        />
                      </span>
                    </Tooltip>
                  </span>
                ))}
              </span>
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
                    <span role="button" tabIndex={0} className="iconDetails">
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
                disabled={fileToBeSent.filename === ''}
              >
                Upload
              </Button>
              <hr />

              <div>
                <img
                  src={`data:image/svg+xml;utf8,${selectedIcon}`}
                  alt="missing"
                />
                <label htmlFor="upload-icon">
                  Select an Icon to Upload
                  <div>
                    <input
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
