import { Button } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { useState } from 'react';
import { postIcon, useMutateIcons } from '../../../../api/icons';
import useStore from '../../../../store/useStore';
import { textForError } from '../../../../utils';

import styles from './ManageIcons.module.css';

function IconControls() {
  const [iconContentToUpload, setIconContentToUpload] = useState<
    string | ArrayBuffer
  >('');
  const [iconNameToUpload, setIconNameToUpload] = useState('');
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const mutateIcons = useMutateIcons();

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
      <form
        onSubmit={(e: React.SyntheticEvent) => {
          uploadIcon(e);
        }}
      >
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
