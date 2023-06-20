import { useState } from 'react';
import { IconButton } from '@material-ui/core';

import { FormAction } from '../../types';
import type { Task } from '../../types';
import FormDialog from '../General/FormDialog';
import { Edit, LibraryAdd } from '@material-ui/icons';
import styles from './TaskButtonGroup.module.css';
import DeleteTaskButton from './DeleteTaskButton';

type ActionType = FormAction.cloneTask | FormAction.editTask;

interface Props {
  task: Task;
}

function TaskButtonGroup(props: Props) {
  const { task } = props;

  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [action, setAction] = useState<ActionType>();

  function onEditOrClone(actionType: ActionType) {
    setAction(actionType);
    setOpenSaveDialog(true);
  }

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

      <DeleteTaskButton task={task} />

      <FormDialog
        elementToEdit={task}
        action={action || FormAction.undefined}
        open={openSaveDialog}
        setOpenSaveDialog={setOpenSaveDialog}
      />
    </div>
  );
}

export default TaskButtonGroup;
