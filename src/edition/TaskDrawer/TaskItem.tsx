import type { SvgIcon } from '@mui/material';
import { Tooltip } from '@mui/material';

import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import type { Task } from '../../types';
import { getTaskName } from '../../utils';
import TaskIcon from '../Sidebar/TaskIcon';
import TaskButton from './TaskButton';
import TaskButtonGroup from './TaskButtonGroup';
import styles from './TaskList.module.css';

interface Props {
  task: Task;
  selectedTaskId: string | undefined;
  onTaskSelection: (id: string | undefined) => void;
  tooltip?: string;
  customIcon?: typeof SvgIcon;
}

function TaskItem(props: Props) {
  const {
    task,
    selectedTaskId,
    onTaskSelection,
    tooltip,
    customIcon: CustomIcon,
  } = props;
  const { task_identifier, icon, task_type, category } = task;

  const isSelected = selectedTaskId === task.task_identifier;
  const isEditable = category !== 'General';

  return (
    <Tooltip title={tooltip || task_identifier} arrow>
      <div className={styles.item} data-selected={isSelected || undefined}>
        <TaskButton
          taskInfo={{
            task_type,
            task_identifier,
            category,
            icon,
          }}
          label={getTaskName(task.task_identifier)}
          onClick={() => onTaskSelection(task.task_identifier)}
          icon={() =>
            CustomIcon ? (
              <CustomIcon fontSize="large" />
            ) : (
              <SuspenseBoundary>
                <TaskIcon name={icon} />
              </SuspenseBoundary>
            )
          }
        />
        {isEditable && isSelected && <TaskButtonGroup task={task} />}
      </div>
    </Tooltip>
  );
}

export default TaskItem;
