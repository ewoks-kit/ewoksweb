import { useState } from 'react';
import { IconButton } from '@material-ui/core';

import { FormAction } from '../../types';
import type { Task } from '../../types';
import useStore from 'store/useStore';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { deleteTask } from 'api/tasks';
import { textForError } from 'utils';
import FormDialog from '../General/FormDialog';
import { useGetTasks } from '../TopNavBar/hooks';
import { Delete, Edit, LibraryAdd } from '@material-ui/icons';
import styles from './TaskButtonGroup.module.css';

interface Props {
  task: Task;
}

function TaskButtonGroup(props: Props) {
  const { task } = props;

  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [action, setAction] = useState<
    FormAction.cloneTask | FormAction.editTask
  >();
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  function onEditOrClone(
    actionType: FormAction.cloneTask | FormAction.editTask
  ) {
    setAction(actionType);
    setOpenSaveDialog(true);
  }

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
    <div className={styles.container}>
      <IconButton
        className={styles.edit}
        aria-label="Edit task details"
        onClick={() => onEditOrClone(FormAction.editTask)}
        color="primary"
        size="small"
      >
        <Edit fontSize="small" />
      </IconButton>

      <IconButton
        className={styles.clone}
        onClick={() => onEditOrClone(FormAction.cloneTask)}
        aria-label="Clone task"
        color="primary"
        size="small"
      >
        <LibraryAdd fontSize="small" />
      </IconButton>
      <ConfirmDialog
        title={`Delete "${task.task_identifier || ''}" task?`}
        content={`You are about to delete a task.
                    Please make sure that it is not used in any workflow!
                    Do you agree to continue?`}
        open={openAgreeDialog}
        agreeCallback={onAgreeDeleteTask}
        disagreeCallback={onDisagreeDeleteTask}
      />
      <FormDialog
        elementToEdit={task}
        action={action || FormAction.undefined}
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
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
    </div>
  );
}

export default TaskButtonGroup;
