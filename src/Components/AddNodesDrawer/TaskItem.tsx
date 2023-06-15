import type { Task } from '../../types';
import { attachTaskInfo } from '../Canvas/utils';
import { Tooltip } from '@material-ui/core';
import IconBoundary from '../../IconBoundary';
import TaskIcon from '../Sidebar/TaskIcon';
import TaskButtonGroup from './TaskButtonGroup';

interface Props {
  task: Task;
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

function TaskItem(props: Props) {
  const { task, className, isSelected, onClick } = props;
  const { task_identifier, icon, task_type } = task;

  if (!task_identifier) {
    return null;
  }

  return (
    <Tooltip title={task_identifier} arrow>
      <button
        className={className}
        type="button"
        onClick={onClick}
        onDragStart={(event) =>
          attachTaskInfo(event.dataTransfer, {
            task_type: task_type || '',
            task_identifier,
            icon,
          })
        }
        data-selected={isSelected || undefined}
        aria-label={task_identifier}
        draggable
      >
        <IconBoundary>
          <TaskIcon name={icon} alt={task_identifier} />
        </IconBoundary>
        <label>{task_identifier.split('.').pop()}</label>
        {isSelected && <TaskButtonGroup />}
      </button>
    </Tooltip>
  );
}

export default TaskItem;
