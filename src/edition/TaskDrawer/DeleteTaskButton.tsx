import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState } from 'react';

import { deleteTask as deleteTaskOnServer } from '../../api/tasks';
import { useInvalidateTasks } from '../../api/tasks';
import ConfirmDialog from '../../general/ConfirmDialog';
import useSnackbarStore from '../../store/useSnackbarStore';
import type { Task } from '../../types';
import { textForError } from '../../utils';
import styles from './TaskButtonGroup.module.css';

interface Props {
  task: Task;
}

function DeleteTaskButton(props: Props) {
  const { task } = props;

  const [isDialogOpen, setOpenDialog] = useState(false);

  const showSuccessMsg = useSnackbarStore((state) => state.showSuccessMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const invalidateTasks = useInvalidateTasks();

  async function deleteTask() {
    if (!task.task_identifier) {
      return;
    }

    try {
      await deleteTaskOnServer(task.task_identifier);
      showSuccessMsg('Task was successfully deleted!');
      // Update task list
      invalidateTasks();
    } catch (error) {
      showErrorMsg(
        textForError(
          error,
          'Error in task deletion. Please check connectivity with the server',
        ),
      );
    }
  }

  return (
    <>
      <ConfirmDialog
        title={`Delete "${task.task_identifier || ''}" task?`}
        content={`You are about to delete a task.
              Please make sure that it is not used in any workflow!
              Do you agree to continue?`}
        open={isDialogOpen}
        agreeCallback={async () => {
          setOpenDialog(false);
          await deleteTask();
        }}
        disagreeCallback={() => setOpenDialog(false)}
      />

      <IconButton
        className={styles.delete}
        onClick={() => setOpenDialog(true)}
        aria-label="Delete task"
        color="secondary"
        size="small"
      >
        <Delete fontSize="small" />
      </IconButton>
    </>
  );
}

export default DeleteTaskButton;
