import { Tooltip } from '@material-ui/core';
import IconBoundary from '../../IconBoundary';
import type { Task } from '../../types';
import { attachTaskInfo } from '../Canvas/utils';
import TaskIcon from '../Sidebar/TaskIcon';
import TaskButtonGroup from './TaskButtonGroup';

import styles from './TaskList.module.css';

interface Props {
  task: Task;
  isSelected?: boolean;
  onClick?: () => void;
}

function TaskItem(props: Props) {
  const { task, isSelected, onClick } = props;
  const { task_identifier, icon, task_type } = task;

  if (!task_identifier) {
    return null;
  }

  return (
    <Tooltip title={task_identifier} arrow>
      <div className={styles.item} data-selected={isSelected || undefined}>
        <button
          className={styles.itemBtn}
          type="button"
          onClick={onClick}
          onDragStart={(event) =>
            attachTaskInfo(event.dataTransfer, {
              task_type: task_type || '',
              task_identifier,
              icon,
            })
          }
          aria-label={task_identifier}
          draggable
        >
          <IconBoundary>
            <TaskIcon name={icon} alt={task_identifier} />
          </IconBoundary>
          <label className={styles.itemLabel}>
            {task_identifier.split('.').pop()}
          </label>
        </button>
        {isSelected && <TaskButtonGroup />}
      </div>
    </Tooltip>
  );
}

export default TaskItem;
