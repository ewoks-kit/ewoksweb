import { useState } from 'react';
import { Button, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/EditOutlined';
import BookmarksIcon from '@material-ui/icons/Bookmarks';

import { FormAction } from '../../types';
import type { Task } from '../../types';
import useStore from 'store/useStore';
import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmDialog from 'Components/General/ConfirmDialog';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { deleteTask } from 'api/tasks';
import { textForError } from 'utils';
import FormDialog from '../General/FormDialog';
import { useGetTasks } from '../TopNavBar/hooks';

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      margin: '4px',
    },
  })
);

function TaskManagementButtons() {
  const classes = useStyles();

  const [elementToEdit, setElementToEdit] = useState<Task>({});
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);
  const [doAction, setDoAction] = useState<FormAction>();
  const [openAgreeDialog, setOpenAgreeDialog] = useState<boolean>(false);

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
    <>
      <IconButton
        onClick={deleteTaskDialog}
        aria-label="delete"
        color="secondary"
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        aria-label="edit"
        onClick={() =>
          onAction(FormAction.editTask, selectedTask.task_identifier)
        }
        color="primary"
      >
        <EditIcon />
      </IconButton>
      <Button
        className={classes.button}
        startIcon={<BookmarksIcon />}
        variant="outlined"
        color="primary"
        onClick={() =>
          onAction(FormAction.cloneTask, selectedTask.task_identifier)
        }
        size="small"
      >
        Clone
      </Button>
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
    </>
  );
}

export default TaskManagementButtons;
