import type { Task } from '../../types';
import { attachTaskInfo } from '../Canvas/utils';
import { Tooltip } from '@material-ui/core';
import IconBoundary from '../../IconBoundary';
import TaskIcon from '../Sidebar/TaskIcon';
import { useStyles } from './AddNodes';

interface Props {
  task: Task;
  isSelected?: boolean;
  onClick?: () => void;
}

function TaskItem(props: Props) {
  const { task, isSelected, onClick } = props;

  const classes = useStyles();

  return (
    <span
      onClick={onClick}
      aria-hidden="true"
      role="button"
      tabIndex={0}
      className={`dndnode ${isSelected ? 'selectedTask' : ''}`}
      onDragStart={(event) =>
        attachTaskInfo(event.dataTransfer, {
          task_identifier: task.task_identifier || '',
          task_type: task.task_type || '',
          icon: task.icon || '',
        })
      }
      draggable
    >
      <Tooltip title={task.task_identifier || ''} arrow>
        <span
          role="button"
          tabIndex={0}
          className={classes.imgHolder}
          aria-label={task.task_identifier}
        >
          <span className={classes.imgLabelHolder}>
            {task.task_identifier?.split('.').pop()}
          </span>
          <IconBoundary>
            <TaskIcon
              className={classes.image}
              name={task.icon}
              alt={task.task_identifier}
            />
          </IconBoundary>
        </span>
      </Tooltip>
    </span>
  );
}

export default TaskItem;
