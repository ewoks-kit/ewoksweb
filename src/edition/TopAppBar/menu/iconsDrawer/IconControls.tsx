import { Button } from '@material-ui/core';
import { CloudUpload, Delete } from '@material-ui/icons';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { useState } from 'react';
import { deleteIcon, postIcon, useMutateIcons } from '../../../../api/icons';
import { getTaskDescription } from '../../../../api/tasks';
import ConfirmDialog from '../../../../general/ConfirmDialog';
import useStore from '../../../../store/useStore';
import { textForError } from '../../../../utils';
import commonStrings from '../../../../commonStrings.json';

import styles from './ManageIcons.module.css';

interface Props {
  selectedIcon: string;
}

function IconControls(props: Props) {
  const { selectedIcon } = props;
  const [iconContentToUpload, setIconContentToUpload] = useState<
    string | ArrayBuffer
  >('');
  const [iconNameToUpload, setIconNameToUpload] = useState('');
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const mutateIcons = useMutateIcons();

  async function agreeDeleteIcon() {
    setOpenAgreeDialog(false);
    try {
      await deleteIcon(selectedIcon);

      setOpenSnackbar({
        open: true,
        text: `Icon was successfully deleted!`,
        severity: 'success',
      });

      mutateIcons();
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(error, 'Error in deleting Icon'),
        severity: 'error',
      });
    }
  }

  async function handleDeleteIcon() {
    try {
      const tasksData = await getTaskDescription();
      if (tasksData.data.items.length > 0) {
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
        text: textForError(error, commonStrings.retrieveTasksError),
        severity: 'error',
      });
    }
  }

  async function uploadIcon(event: SyntheticEvent<Element, Event>) {
    event.preventDefault();

    try {
      await postIcon(iconNameToUpload, iconContentToUpload);

      setOpenSnackbar({
        open: true,
        text: `Icon ${iconNameToUpload} was successfully uploaded`,
        severity: 'success',
      });

      mutateIcons();
      setIconNameToUpload('');
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(
          error,
          'Error in uploading the Icon. Please check connectivity with the server!'
        ),
        severity: 'error',
      });
    }
  }

  function handleIconFilePicked(ne: ChangeEvent<HTMLInputElement>) {
    const { files } = ne.target;
    const inputFile = files?.[0];

    if (!inputFile) {
      setOpenSnackbar({
        open: true,
        text: 'No file was selected',
        severity: 'warning',
      });
      return;
    }

    if (inputFile.size > 10_000) {
      setOpenSnackbar({
        open: true,
        text: 'Files more than 10Kb are not acceptable for icons',
        severity: 'warning',
      });
      return;
    }

    const fileReader = new FileReader();

    fileReader.readAsDataURL(inputFile);

    fileReader.addEventListener('load', (event) => {
      if (event.target?.result) {
        setIconContentToUpload(event.target.result);
        setIconNameToUpload(inputFile.name);
      }
    });

    setOpenSnackbar({
      open: true,
      text: 'File ready to be uploaded as an icon',
      severity: 'success',
    });
  }

  return (
    <div className={styles.controlList}>
      <ConfirmDialog
        title={`Delete "${selectedIcon}" icon?`}
        content={`You are about to delete an icon.
              After deletion it will not be available to be used in any Task description!
              Do you agree to continue?`}
        open={openAgreeDialog}
        agreeCallback={agreeDeleteIcon}
        disagreeCallback={() => setOpenAgreeDialog(false)}
      />
      <form
        onSubmit={(e: React.SyntheticEvent) => {
          uploadIcon(e);
        }}
      >
        <Button
          startIcon={<Delete />}
          variant="outlined"
          color="secondary"
          onClick={() => {
            handleDeleteIcon();
          }}
          size="small"
          disabled={selectedIcon === ''}
        >
          Delete
        </Button>
        <Button
          startIcon={<CloudUpload />}
          variant="outlined"
          type="submit"
          color="primary"
          size="small"
          disabled={iconNameToUpload === ''}
        >
          Upload
        </Button>
        <hr />

        <div>
          <label htmlFor="upload-icon" id="upload-icon">
            Select an Icon to Upload
            <div>
              <input
                type="file"
                id="upload-icon"
                aria-labelledby="upload-icon"
                name="upload-icon"
                accept="image/*"
                onChange={handleIconFilePicked}
                aria-label="Select Icon"
              />
            </div>
          </label>
        </div>
      </form>
    </div>
  );
}

export default IconControls;
