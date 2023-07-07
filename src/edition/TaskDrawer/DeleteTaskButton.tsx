import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { useState } from 'react';
import { deleteTask as deleteTaskOnServer } from '../../api/tasks';
import useStore from '../../store/useStore';
import type { Task } from '../../types';
import { textForError } from '../../utils';
import ConfirmDialog from '../../General/ConfirmDialog';
import { useGetTasks } from '../TopAppBar/hooks';

import styles from './TaskButtonGroup.module.css';

interface Props {
  task: Task;
}

function DeleteTaskButton(props: Props) {
  const { task } = props;

  const [isDialogOpen, setOpenDialog] = useState(false);

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const getTasks = useGetTasks();

  async function deleteTask() {
    if (!task.task_identifier) {
      return;
    }

    try {
      await deleteTaskOnServer(task.task_identifier);
      setOpenSnackbar({
        open: true,
        text: `Task was successfully deleted!`,
        severity: 'success',
      });
      // Update task list
      getTasks();
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(
          error,
          'Error in task deletion. Please check connectivity with the server'
        ),
        severity: 'error',
      });
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
