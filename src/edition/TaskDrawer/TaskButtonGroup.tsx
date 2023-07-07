import { useState } from 'react';
import { IconButton } from '@material-ui/core';

import type { Task } from '../../types';
import { Edit, LibraryAdd } from '@material-ui/icons';
import styles from './TaskButtonGroup.module.css';
import DeleteTaskButton from './DeleteTaskButton';
import TaskForm from '../../General/forms/TaskForm';

type ActionType = 'clone' | 'edit';

interface Props {
  task: Task;
}

function TaskButtonGroup(props: Props) {
  const { task } = props;

  const [action, setAction] = useState<ActionType>();

  return (
    <div className={styles.container}>
      <IconButton
        className={styles.edit}
        onClick={() => setAction('edit')}
        aria-label="Edit task"
        color="primary"
        size="small"
      >
        <Edit fontSize="small" />
      </IconButton>

      <IconButton
        className={styles.clone}
        onClick={() => setAction('clone')}
        aria-label="Clone task"
        color="primary"
        size="small"
      >
        <LibraryAdd fontSize="small" />
      </IconButton>

      <DeleteTaskButton task={task} />

      <TaskForm
        isOpen={action !== undefined}
        onClose={() => setAction(undefined)}
        elementToEdit={task}
        editExistingTask={action === 'edit'}
      />
    </div>
  );
}

export default TaskButtonGroup;
