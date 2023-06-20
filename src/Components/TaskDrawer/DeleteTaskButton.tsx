import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { useState } from 'react';
import { deleteTask } from '../../api/tasks';
import useStore from '../../store/useStore';
import type { Task } from '../../types';
import { textForError } from '../../utils';
import ConfirmDialog from '../General/ConfirmDialog';
import { useGetTasks } from '../TopNavBar/hooks';

import styles from './TaskButtonGroup.module.css';

interface Props {
  task: Task;
}

function DeleteTaskButton(props: Props) {
  const { task } = props;

  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const getTasks = useGetTasks();

  const onAgreeDeleteTask = async () => {
    setOpenAgreeDialog(false);
    if (!task.task_identifier) {
      return;
    }

    try {
      await deleteTask(task.task_identifier);
      setOpenSnackbar({
        open: true,
        text: `Task was successfully deleted!`,
        severity: 'success',
      });
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
  };

  const onDisagreeDeleteTask = () => {
    setOpenAgreeDialog(false);
  };

  return (
    <>
      <ConfirmDialog
        title={`Delete "${task.task_identifier || ''}" task?`}
        content={`You are about to delete a task.
              Please make sure that it is not used in any workflow!
              Do you agree to continue?`}
        open={openAgreeDialog}
        agreeCallback={onAgreeDeleteTask}
        disagreeCallback={onDisagreeDeleteTask}
      />

      <IconButton
        className={styles.delete}
        onClick={() => setOpenAgreeDialog(true)}
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
