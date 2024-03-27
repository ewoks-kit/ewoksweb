import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState } from 'react';

import { deleteIcon, useInvalidateIcons } from '../../../../api/icons';
import { useTasks } from '../../../../api/tasks';
import ConfirmDialog from '../../../../general/ConfirmDialog';
import useSnackbarStore from '../../../../store/useSnackbarStore';
import { textForError } from '../../../../utils';

interface Props {
  iconName: string;
}

function DeleteIconButton(props: Props) {
  const { iconName } = props;
  const tasks = useTasks();

  const [isDialogOpen, setOpenDialog] = useState(false);
  const showSuccessMsg = useSnackbarStore((state) => state.showSuccessMsg);
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const invalidateIcons = useInvalidateIcons();

  async function agreeDeleteIcon() {
    if (tasks.some((task) => task.icon === iconName)) {
      showWarningMsg(
        `${iconName} cannot be deleted since it is used in one or more Tasks!`,
      );
      return;
    }

    try {
      await deleteIcon(iconName);

      showSuccessMsg(`${iconName} was successfully deleted!`);

      invalidateIcons();
    } catch (error) {
      showErrorMsg(textForError(error, `Error in deleting ${iconName}`));
    }
  }

  return (
    <>
      <ConfirmDialog
        title={`Delete "${iconName}" icon?`}
        content="Are you sure to delete this icon ?"
        open={isDialogOpen}
        onClose={() => setOpenDialog(false)}
        onConfirm={agreeDeleteIcon}
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
