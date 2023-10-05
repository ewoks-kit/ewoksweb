import { Tooltip } from '@material-ui/core';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import type { Task } from '../../types';
import { getTaskName } from '../../utils';
import TaskIcon from '../Sidebar/TaskIcon';
import TaskButton from './TaskButton';
import TaskButtonGroup from './TaskButtonGroup';

import styles from './TaskList.module.css';

interface Props {
  task: Task;
  isSelected?: boolean;
  onClick?: () => void;
}

function TaskItem(props: Props) {
  const { task, isSelected, onClick } = props;
  const { task_identifier, icon, task_type, category } = task;

  if (!task_identifier) {
    return null;
  }

  return (
    <Tooltip title={task_identifier} arrow>
      <div className={styles.item} data-selected={isSelected || undefined}>
        <TaskButton
          taskInfo={{ task_type, task_identifier, icon, category }}
          label={getTaskName(task)}
          onClick={onClick}
          icon={() => (
            <SuspenseBoundary>
              <TaskIcon name={icon} alt={task_identifier} />
            </SuspenseBoundary>
          )}
        />
        {isSelected && <TaskButtonGroup task={task} />}
      </div>
    </Tooltip>
  );
}

export default TaskItem;
