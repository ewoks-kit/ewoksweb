import type { TaskInfo } from '../Canvas/models';
import { attachTaskInfo } from '../Canvas/utils';
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
      {/* Subtle bug in Firefox (https://bugzilla.mozilla.org/show_bug.cgi?id=568313):
      It is actually the **content** of the button that is draggable.
      This draggableContent div ensures that the draggable area takes the full dimensions of the button.
      */}
      <div className={styles.draggableContent}>
        <div className={styles.icon}>
          <Icon />
        </div>
        <label className={styles.label}>{label}</label>
      </div>
    </button>
  );
}

export default TaskButton;
