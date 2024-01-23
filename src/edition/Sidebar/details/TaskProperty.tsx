import styles from './TaskProperty.module.css';

interface Props {
  label: string;
  value: string;
}

function TaskProperty(props: Props) {
  const { label, value } = props;

  return (
    <div className={styles.entry} data-cy="task_props">
      <span className={styles.label}>{label}:</span> {value}
    </div>
  );
}
export default TaskProperty;
