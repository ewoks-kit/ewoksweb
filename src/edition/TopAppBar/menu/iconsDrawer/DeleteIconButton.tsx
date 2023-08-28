import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { useState } from 'react';

import { deleteIcon, useInvalidateIcons } from '../../../../api/icons';
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
  const showSuccessMsg = useStore((state) => state.showSuccessMsg);
  const showWarningMsg = useStore((state) => state.showWarningMsg);
  const showErrorMsg = useStore((state) => state.showErrorMsg);
  const invalidateIcons = useInvalidateIcons();

  async function agreeDeleteIcon() {
    setOpenDialog(false);

    if (tasks.some((task) => task.icon === iconName)) {
      showWarningMsg(
        `${iconName} cannot be deleted since it is used in one or more Tasks!`
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
