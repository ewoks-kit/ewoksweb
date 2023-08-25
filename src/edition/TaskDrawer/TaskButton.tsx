import styles from './TaskList.module.css';
import { attachTaskInfo } from '../Canvas/utils';
import type { TaskInfo } from '../Canvas/models';

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
      className={styles.itemBtn}
      type="button"
      onClick={onClick}
      onDragStart={(event) => attachTaskInfo(event.dataTransfer, taskInfo)}
      aria-label={taskInfo.task_identifier}
      draggable
    >
      <Icon />
      <label className={styles.itemLabel}>{label}</label>
    </button>
  );
}

export default TaskButton;
