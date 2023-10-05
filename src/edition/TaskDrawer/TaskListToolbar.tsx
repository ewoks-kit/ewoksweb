import DiscoverTasksButton from './DiscoverTasksButton';
import styles from './TaskList.module.css';

function TaskListToolbar() {
  return (
    <div className={styles.toolbar}>
      <DiscoverTasksButton />
    </div>
  );
}

export default TaskListToolbar;
