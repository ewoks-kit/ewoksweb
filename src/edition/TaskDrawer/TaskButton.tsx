import { attachTaskInfo } from '../Canvas/utils';
import type { TaskInfo } from '../Canvas/models';

import styles from './TaskButton.module.css';

interface Props {
  taskInfo: TaskInfo;
  label: string;
  onClick?: () => void;
  icon: () => JSX.Element;
}

function TaskButton(props: Props) {
  const { taskInfo, label, onClick, icon: Icon } = props;

  return (
    <button
      className={styles.btn}
      type="button"
      onClick={onClick}
      onDragStart={(event) => attachTaskInfo(event.dataTransfer, taskInfo)}
      aria-label={taskInfo.task_identifier}
      draggable
    >
      <div className={styles.icon}>
        <Icon />
      </div>
      <label className={styles.label}>{label}</label>
    </button>
  );
}

export default TaskButton;
