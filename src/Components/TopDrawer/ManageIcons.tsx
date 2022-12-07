import { useCallback, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Button, Box, Grid, Paper, styled, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from 'axios';
import useStore from 'store/useStore';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { getTaskDescription } from 'utils/api';
import orange2 from 'images/orange2.png';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import commonStrings from 'commonStrings.json';
import type { Icon } from '../../types';
import getIconsFromServer from '../../utils/getIconsFromServer';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  backgroundColor: 'rgb(246, 248, 249)',
  color: theme.palette.text.secondary,
}));

const useStyles = makeStyles(() =>
  createStyles({
    imgHolder: {
      overflow: 'hidden',
      overflowWrap: 'break-word',
      position: 'relative',
      textAlign: 'center',
      color: 'black',
      display: 'flex',
    },
    button: {
      margin: '8px',
    },
  })
);

export default function ManageIcons() {
  const classes = useStyles();

  const [selectedIcon, setSelectedIcon] = useState('');
  const [fileToBeSent, setFileToBeSent] = useState<string | ArrayBuffer>('');
  const [fileNameToBeSent, setFileNameToBeSent] = useState<string>('');
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const allIcons = useStore((state) => state.allIcons);
  const setAllIcons = useStore((state) => state.setAllIcons);

  function clickIcon(icon: string) {
    setSelectedIcon(icon);
  }

  async function deleteIcon() {
    try {
      const tasksData = await getTaskDescription();
      if (tasksData?.data?.items?.length > 0) {
        const allTasks = tasksData.data.items;

        if (allTasks.some((task) => task.icon === selectedIcon)) {
          setOpenSnackbar({
            open: true,
            text: `Icon cannot be deleted since it is used in one or more Tasks!`,
            severity: 'warning',
          });
          return;
        }

        setOpenSnackbar({
          open: true,
          text: `Icon can be deleted since it is not used in any Task!`,
          severity: 'success',
        });

        setOpenAgreeDialog(true);
      }
    } catch (error) {
      // TODO: general error handling for all cases like workflows?
      setOpenSnackbar({
        open: true,
        text: error.response?.data?.message || commonStrings.retrieveTasksError,
        severity: 'error',
      });
    }
  }

  async function uploadFile(event) {
    event.preventDefault();

    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/icon/${fileNameToBeSent}`,
        { data_url: fileToBeSent }
      );

      setOpenSnackbar({
        open: true,
        text: `Icon ${fileNameToBeSent} was successfully uploaded`,
        severity: 'success',
      });

      getIcons();
      setFileNameToBeSent('');
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text:
          error.response?.data?.message ||
          'Error in uploading the Icon. Please check connectivity with the server!',
        severity: 'error',
      });
    }
  }

  function inputNew(ne: ChangeEvent<HTMLInputElement>) {
    const { files } = ne.target;

    if (files[0].size > 10_000) {
      setOpenSnackbar({
        open: true,
        text: 'Files more than 10Kb are not acceptable for icons',
        severity: 'warning',
      });
      return;
    }

    const fileReader = new FileReader();

    fileReader.readAsDataURL(files[0]);

    fileReader.addEventListener('load', (event) => {
      setFileToBeSent(event.target.result);
      setFileNameToBeSent(files[0].name);
    });

    setOpenSnackbar({
      open: true,
      text: 'File ready to be uploaded as an icon',
      severity: 'success',
    });
  }

  async function agreeDeleteIcon() {
    setOpenAgreeDialog(false);
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/icon/${selectedIcon}`
      );

      setOpenSnackbar({
        open: true,
        text: `Icon was succesfully deleted!`,
        severity: 'success',
      });

      getIcons();
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error?.response?.data || 'Error in deleting Icon',
        severity: 'error',
      });
    }
  }

  function disAgreeDeleteIcon() {
    setOpenAgreeDialog(false);
  }

  const getIcons = useCallback(async () => {
    try {
      const icons: Icon[] | object = await getIconsFromServer();

      if (Array.isArray(icons) && icons?.length > 0) {
        setAllIcons([...icons]);
      }
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: error.response?.data?.message || commonStrings.retrieveIconsError,
        severity: 'error',
      });
    }
  }, [setOpenSnackbar, setAllIcons]);

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
            <span className="dndflow">
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
                    <span
                      role="button"
                      tabIndex={0}
                      className={classes.imgHolder}
                    >
                      <img
                        src={icon.image?.data_url || orange2}
                        alt={icon.name}
                        key={icon.name}
                      />
                    </span>
                  </Tooltip>
                </span>
              ))}
            </span>
          </Item>
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={3}>
          <Item>
            <form onSubmit={uploadFile}>
              <Button
                startIcon={<DeleteIcon />}
                className={classes.button}
                variant="outlined"
                color="secondary"
                onClick={deleteIcon}
                size="small"
                disabled={selectedIcon === ''}
                data-cy="iconDeleteButton"
              >
                Delete
              </Button>
              <Button
                startIcon={<CloudUploadIcon />}
                variant="outlined"
                type="submit"
                color="primary"
                size="small"
                disabled={fileNameToBeSent === ''}
                data-cy="iconUploadButton"
              >
                Upload
              </Button>
              <hr />

              <div>
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
                      data-cy="browseInput"
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
