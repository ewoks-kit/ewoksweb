import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { useState } from 'react';

import { deleteIcon, useMutateIcons } from '../../../../api/icons';
import { useTasks } from '../../../../api/tasks';
import ConfirmDialog from '../../../../general/ConfirmDialog';
import useStore from '../../../../store/useStore';
import { textForError } from '../../../../utils';

interface Props {
  iconName: string;
}

function DeleteIconButton(props: Props) {
  const { iconName } = props;
  const tasks = useTasks();

  const [isDialogOpen, setOpenDialog] = useState(false);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const mutateIcons = useMutateIcons();

  async function agreeDeleteIcon() {
    setOpenDialog(false);

    if (tasks.some((task) => task.icon === iconName)) {
      setOpenSnackbar({
        open: true,
        text: `${iconName} cannot be deleted since it is used in one or more Tasks!`,
        severity: 'warning',
      });
      return;
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
