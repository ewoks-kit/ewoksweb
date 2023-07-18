import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { useState } from 'react';
import { deleteIcon, useMutateIcons } from '../../../../api/icons';
import { fetchTaskDescriptions } from '../../../../api/tasks';
import ConfirmDialog from '../../../../general/ConfirmDialog';
import { textForError } from '../../../../utils';

import commonStrings from '../../../../commonStrings.json';
import useStore from '../../../../store/useStore';

interface Props {
  iconName: string;
}

function DeleteIconButton(props: Props) {
  const { iconName } = props;

  const [isDialogOpen, setOpenDialog] = useState(false);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const mutateIcons = useMutateIcons();

  async function agreeDeleteIcon() {
    setOpenDialog(false);

    try {
      const { data: taskDescriptions } = await fetchTaskDescriptions();

      if (taskDescriptions.items.length > 0) {
        const allTasks = taskDescriptions.items;

        if (allTasks.some((task) => task.icon === iconName)) {
          setOpenSnackbar({
            open: true,
            text: `${iconName} cannot be deleted since it is used in one or more Tasks!`,
            severity: 'warning',
          });
          return;
        }
      }
    } catch (error) {
      // TODO: general error handling for all cases like workflows?
      setOpenSnackbar({
        open: true,
        text: textForError(error, commonStrings.retrieveTasksError),
        severity: 'error',
      });
    }

    try {
      await deleteIcon(iconName);

      setOpenSnackbar({
        open: true,
        text: `${iconName} was successfully deleted!`,
        severity: 'success',
      });

      mutateIcons();
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(error, `Error in deleting ${iconName}`),
        severity: 'error',
      });
    }
  }

  return (
    <>
      <ConfirmDialog
        title={`Delete "${iconName}" icon?`}
        content="Are you sure to delete this icon ?"
        open={isDialogOpen}
        agreeCallback={agreeDeleteIcon}
        disagreeCallback={() => setOpenDialog(false)}
      />
      <IconButton
        onClick={() => {
          setOpenDialog(true);
        }}
        size="small"
        aria-label="Delete icon"
      >
        <Delete />
      </IconButton>
    </>
  );
}

export default DeleteIconButton;
