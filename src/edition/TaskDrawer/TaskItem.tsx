import { Tooltip } from '@material-ui/core';
import SuspenseBoundary from '../../Suspense/SuspenseBoundary';
import type { Task } from '../../types';
import { getTaskName } from '../../utils';
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
              task_type: task_type || 'class',
              task_identifier,
              icon,
            })
          }
          aria-label={task_identifier}
          draggable
        >
          <SuspenseBoundary>
            <TaskIcon name={icon} alt={task_identifier} />
          </SuspenseBoundary>
          <label className={styles.itemLabel}>{getTaskName(task)}</label>
        </button>
        {isSelected && <TaskButtonGroup task={task} />}
      </div>
    </Tooltip>
  );
}

export default TaskItem;
