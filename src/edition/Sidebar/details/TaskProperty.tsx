import styles from './TaskProperty.module.css';

interface Props {
  label: string;
  value: string | string[];
}

function TaskProperty(props: Props) {
  const { label, value } = props;

  const valueAsStr = Array.isArray(value) ? value.join(', ') : value;

  return (
    <div className={styles.entry} data-cy="task_props">
      <span className={styles.label}>{label}:</span> {valueAsStr}
    </div>
  );
}
export default TaskProperty;
