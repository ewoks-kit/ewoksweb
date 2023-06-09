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
import styles from './AddNodes.module.css';

function TaskManagementButtons() {
  const [elementToEdit, setElementToEdit] = useState<Task>({});
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [doAction, setDoAction] = useState<FormAction>();
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);

  const initializedTask = useStore((state) => state.initializedTask);
  const selectedTask = useStore((state) => state.selectedTask);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const tasks = useStore((state) => state.tasks);

  function onAction(action: FormAction, element?: string) {
    setDoAction(action);

    if (['cloneTask', 'editTask'].includes(action)) {
      const task = tasks.find((tas) => tas.task_identifier === element);
      if (task) {
        setElementToEdit(task);
        setOpenSaveDialog(true);
        return;
      }
    }

    if (action === 'newTask') {
      setElementToEdit(initializedTask);
      setOpenSaveDialog(true);
    }
  }

  const deleteTaskDialog = () => {
    setOpenAgreeDialog(true);
  };

  const getTasks = useGetTasks();

  const agreeDeleteTask = async () => {
    setOpenAgreeDialog(false);
    if (!selectedTask.task_identifier) {
      return;
    }

    try {
      await deleteTask(selectedTask.task_identifier);
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

  const disAgreeDeleteTask = () => {
    setOpenAgreeDialog(false);
  };

  return (
    <div className={styles.taskButtonsContainer}>
      <IconButton
        aria-label="Edit task details"
        onClick={() =>
          onAction(FormAction.editTask, selectedTask.task_identifier)
        }
        color="primary"
        size="small"
      >
        <Edit fontSize="small" />
      </IconButton>
      <IconButton
        onClick={deleteTaskDialog}
        aria-label="Delete task"
        color="secondary"
        size="small"
      >
        <Delete fontSize="small" />
      </IconButton>

      <IconButton
        onClick={() =>
          onAction(FormAction.cloneTask, selectedTask.task_identifier)
        }
        aria-label="Clone task"
        color="primary"
        size="small"
      >
        <LibraryAdd fontSize="small" />
      </IconButton>
      <ConfirmDialog
        title={`Delete "${selectedTask.task_identifier || ''}" task?`}
        content={`You are about to delete a task.
                    Please make sure that it is not used in any workflow!
                    Do you agree to continue?`}
        open={openAgreeDialog}
        agreeCallback={agreeDeleteTask}
        disagreeCallback={disAgreeDeleteTask}
      />
      <FormDialog
        elementToEdit={elementToEdit}
        action={doAction || FormAction.undefined}
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
      />
    </div>
  );
}

export default TaskManagementButtons;
