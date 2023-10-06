import { Button } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { useState } from 'react';

import { postIcon, useInvalidateIcons } from '../../../../api/icons';
import useSnackbarStore from '../../../../store/useSnackbarStore';
import { textForError } from '../../../../utils';
import styles from './IconsDrawer.module.css';

function UploadIconControl() {
  const [iconContentToUpload, setIconContentToUpload] = useState<
    string | ArrayBuffer
  >('');
  const [iconNameToUpload, setIconNameToUpload] = useState('');
  const showSuccessMsg = useSnackbarStore((state) => state.showSuccessMsg);
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const invalidateIcons = useInvalidateIcons();

  async function uploadIcon(event: SyntheticEvent<Element, Event>) {
    event.preventDefault();

    try {
      await postIcon(iconNameToUpload, iconContentToUpload);

      showSuccessMsg(`Icon ${iconNameToUpload} was successfully uploaded`);

      invalidateIcons();
      setIconNameToUpload('');
    } catch (error) {
      showErrorMsg(
        textForError(
          error,
          'Error in uploading the Icon. Please check connectivity with the server!',
        ),
      );
    }
  }

  function handleIconFilePicked(ne: ChangeEvent<HTMLInputElement>) {
    const { files } = ne.target;
    const inputFile = files?.[0];

    if (!inputFile) {
      showWarningMsg('No file was selected');
      return;
    }

    if (inputFile.size > 10_000) {
      showWarningMsg('Files more than 10Kb are not acceptable for icons');
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

    showSuccessMsg('File ready to be uploaded as an icon');
  }

  return (
    <div className={styles.upload}>
      <form
        onSubmit={(e: React.SyntheticEvent) => {
          uploadIcon(e);
        }}
      >
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
        <hr />

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
      </form>
    </div>
  );
}

export default UploadIconControl;
